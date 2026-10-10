/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  IGNITE 2026 · ORGANIZER DASHBOARD API  (Google Apps Script Web App)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Attach this to the Google Sheet that collects your Google Form responses:
 *    Sheet → Extensions → Apps Script → paste this file → Save.
 *
 *  Then:
 *    1. Project Settings ⚙ → Script properties → add
 *         IGNITE_ADMIN_PASSCODE = <your secret passcode>
 *    2. Deploy → New deployment → type "Web app"
 *         Execute as:  Me
 *         Who has access: Anyone
 *    3. Copy the Web app URL (ends in /exec).
 *    4. Paste that URL into admin.endpoint in src/data/eventConfig.ts
 *       (or give it to whoever manages the site).
 *
 *  The site calls this with ?action=...&token=<passcode>. The passcode is the
 *  only secret — keep it private and rotate it here if it leaks.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Name of the sheet tab holding form responses. Empty = first sheet. */
var SHEET_NAME = "";

/** Column headers this script manages (added automatically if missing). */
var STATUS_HEADER = "Status";
var DECISION_AT_HEADER = "Decision At";

var PASSCODE_PROP = "IGNITE_ADMIN_PASSCODE";

function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = params.action || "list";

  // Public (no passcode): a team may look up ONLY its own row by an email or
  // team code that exactly matches a cell. Nothing else is exposed.
  if (action === "status") {
    try {
      return json({ ok: true, teams: lookupTeam(params.query || "") });
    } catch (err) {
      return json({ error: "Server error: " + (err && err.message ? err.message : String(err)) });
    }
  }

  var expected = PropertiesService.getScriptProperties().getProperty(PASSCODE_PROP);

  if (!expected) {
    return json({ error: "Server not configured: set the IGNITE_ADMIN_PASSCODE script property." });
  }
  if (params.token !== expected) {
    return json({ error: "unauthorized" });
  }

  try {
    if (action === "list") {
      return json({ ok: true, teams: listTeams() });
    }
    if (action === "decide") {
      return json(decide(params.id, params.status));
    }
    return json({ error: "Unknown action: " + action });
  } catch (err) {
    return json({ error: "Server error: " + (err && err.message ? err.message : String(err)) });
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("This script must be bound to a spreadsheet.");
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function listTeams() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];

  var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h == null ? "" : h).trim();
  });
  var statusCol = header.indexOf(STATUS_HEADER); // -1 if absent

  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var teams = [];

  for (var r = 0; r < rows.length; r++) {
    var values = {};
    var hasContent = false;
    for (var c = 0; c < header.length; c++) {
      var key = header[c] || "Column " + (c + 1);
      var value = rows[r][c];
      var text = value == null ? "" : (value instanceof Date ? value.toISOString() : String(value));
      values[key] = text;
      if (text.trim() !== "") hasContent = true;
    }
    if (!hasContent) continue;

    var status = statusCol >= 0 ? String(rows[r][statusCol] || "").trim() : "";
    if (status === "") status = "Pending";

    teams.push({
      id: String(r + 2), // sheet row number == stable id
      status: status,
      values: values,
    });
  }

  return teams;
}

/**
 * Public lookup used by the /team page. Matches `query` (case-insensitive)
 * against any cell that looks like an email, or against a "Team Code" column.
 * Returns at most 5 rows, and only rows that matched — never the whole sheet.
 */
function lookupTeam(query) {
  var q = String(query || "").trim().toLowerCase();
  if (!q) return [];

  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];

  var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h == null ? "" : h).trim();
  });
  var statusCol = header.indexOf(STATUS_HEADER);

  var codeCol = -1;
  for (var i = 0; i < header.length; i++) {
    if (/team\s*code|^code$|registration\s*id/i.test(header[i])) {
      codeCol = i;
      break;
    }
  }

  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var out = [];

  for (var r = 0; r < rows.length; r++) {
    var values = {};
    var matched = false;
    var hasContent = false;

    for (var c = 0; c < header.length; c++) {
      var key = header[c] || "Column " + (c + 1);
      var raw = rows[r][c];
      var text = raw == null ? "" : (raw instanceof Date ? raw.toISOString() : String(raw));
      values[key] = text;
      if (text.trim() !== "") hasContent = true;

      var lower = text.trim().toLowerCase();
      if (lower && lower === q) {
        var isEmailCell = text.indexOf("@") !== -1;
        if (isEmailCell || c === codeCol) matched = true;
      }
    }

    if (!hasContent || !matched) continue;

    var status = statusCol >= 0 ? String(rows[r][statusCol] || "").trim() : "";
    if (status === "") status = "Pending";

    out.push({ id: String(r + 2), status: status, values: values });
    if (out.length >= 5) break;
  }

  return out;
}

function decide(id, status) {
  if (!id) return { error: "Missing team id." };
  if (["Approved", "Rejected", "Pending"].indexOf(status) === -1) {
    return { error: "Invalid status: " + status };
  }

  var sheet = getSheet();
  var row = parseInt(id, 10);
  if (!row || row < 2 || row > sheet.getLastRow()) {
    return { error: "Team id out of range: " + id };
  }

  var lastCol = sheet.getLastColumn();
  var header = lastCol >= 1 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  var statusCol = findOrCreateColumn(sheet, header, STATUS_HEADER);
  var decisionCol = findOrCreateColumn(sheet, header, DECISION_AT_HEADER);

  sheet.getRange(row, statusCol).setValue(status);
  sheet.getRange(row, decisionCol).setValue(
    status === "Pending" ? "" : new Date()
  );

  return { ok: true, id: String(id), status: status };
}

/** Returns the 1-based column index for `name`, appending a header if needed. */
function findOrCreateColumn(sheet, header, name) {
  var index = header.indexOf(name);
  if (index !== -1) return index + 1;

  var newCol = sheet.getLastColumn() + 1;
  sheet.getRange(1, newCol).setValue(name);
  return newCol;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
