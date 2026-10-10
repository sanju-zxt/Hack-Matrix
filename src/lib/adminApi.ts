import { admin } from "../data/eventConfig";

/**
 * Client for the organizer dashboard API.
 *
 * The backend is a Google Apps Script Web App bound to the registration sheet
 * (see `tool/apps-script/Code.gs`). Every request carries the organizer
 * passcode as a `token` query param; the script rejects anything else. GET-only
 * so the browser never needs a CORS preflight.
 */

export interface AdminTeam {
  /** Row identifier assigned by the sheet (stable within a session). */
  id: string;
  /** "Pending" | "Approved" | "Rejected" (free-form, case-insensitive). */
  status: string;
  /** Every column from the sheet, keyed by header name. */
  values: Record<string, string>;
}

export class AdminApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export const adminConfigured = (): boolean => admin.endpoint.trim().length > 0;

interface ApiResponse {
  teams?: AdminTeam[];
  error?: string;
  ok?: boolean;
}

async function call(params: Record<string, string>): Promise<ApiResponse> {
  const base = admin.endpoint.trim();
  if (!base) throw new AdminApiError("The dashboard endpoint is not configured.", 0);

  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), { method: "GET", redirect: "follow" });
  } catch {
    throw new AdminApiError(
      "Could not reach the dashboard service. Check your connection and try again.",
      0
    );
  }

  if (res.status === 401) {
    throw new AdminApiError("Incorrect passcode. Please try again.", 401);
  }
  if (!res.ok) {
    throw new AdminApiError(`The dashboard service returned HTTP ${res.status}.`, res.status);
  }

  let data: ApiResponse;
  try {
    data = (await res.json()) as ApiResponse;
  } catch {
    throw new AdminApiError(
      "The dashboard service returned an unexpected response. Is the endpoint a deployed Apps Script Web App?",
      res.status
    );
  }

  if (data.error) {
    const status = /unauthor/i.test(data.error) ? 401 : 0;
    throw new AdminApiError(
      status === 401 ? "Incorrect passcode. Please try again." : data.error,
      status
    );
  }

  return data;
}

export async function fetchTeams(token: string): Promise<AdminTeam[]> {
  const data = await call({ action: "list", token });
  return Array.isArray(data.teams) ? data.teams : [];
}

export async function decideTeam(
  token: string,
  id: string,
  status: "Approved" | "Rejected" | "Pending"
): Promise<void> {
  await call({ action: "decide", token, id, status });
}

/**
 * Public lookup for a single team, keyed by a registered email address or a
 * team code. Does NOT require the organizer passcode — the Apps Script only
 * returns rows whose email/code cell exactly matches `query`.
 */
export async function lookupTeam(query: string): Promise<AdminTeam[]> {
  const data = await call({ action: "status", query });
  return Array.isArray(data.teams) ? data.teams : [];
}

const TITLE_KEYS = [/team\s*name/i, /^team/i, /name/i];

/** Best-effort human label for a team, from whatever columns the sheet has. */
export function teamTitle(team: AdminTeam): string {
  const entries = Object.entries(team.values);
  for (const re of TITLE_KEYS) {
    const hit = entries.find(([key, value]) => re.test(key) && value.trim());
    if (hit) return hit[1].trim();
  }
  const firstFilled = entries.map(([, value]) => value.trim()).find(Boolean);
  return firstFilled || `Team ${team.id}`;
}
