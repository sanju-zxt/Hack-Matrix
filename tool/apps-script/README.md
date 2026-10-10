# IGNITE 2026 — Organizer Dashboard setup

The site's `/admin` page is a team-approval dashboard. It reads your Google
Form responses and writes approve/reject decisions back to the same Google
Sheet, through a free Google Apps Script Web App. No server, no extra accounts.

## Steps (one-time, ~5 minutes)

1. **Open the Google Sheet** that collects your registration form responses
   (the form's *Responses* tab → the Sheet icon).
2. **Extensions → Apps Script.** Delete the sample code.
3. **Paste the contents of [`Code.gs`](./Code.gs)** into the editor. Save
   (name the project anything, e.g. `IGNITE Dashboard API`).
4. **Add the passcode.** In the Apps Script editor: *Project Settings* (⚙) →
   *Script properties* → *Add script property*:
   - Property: `IGNITE_ADMIN_PASSCODE`
   - Value: your secret organizer passcode (share it only with organizers)
5. **Deploy.** *Deploy → New deployment → Select type: Web app*
   - Description: `IGNITE dashboard`
   - **Execute as: Me**
   - **Who has access: Anyone**
   - *Deploy*, then **copy the Web app URL** (it ends in `/exec`).

   > "Anyone" does **not** make your data public — every request still needs the
   > passcode, which the script checks before returning anything.

6. **Connect the site.** Paste that URL into `admin.endpoint` in
   `src/data/eventConfig.ts`, then rebuild/deploy the site:
   ```ts
   export const admin = {
     enabled: true,
     endpoint: "https://script.google.com/macros/s/AKfy.../exec",
     // ...
   };
   ```
7. Open `https://www.ignitearena.live/admin`, enter the passcode, and approve
   teams. The dashboard adds a `Status` column and a `Decision At` column to
   your sheet automatically.

## How it works

- `GET /exec?action=list&token=<passcode>` → every response row as
  `{ id, status, values }` (`id` is the sheet row number).
- `GET /exec?action=decide&token=<passcode>&id=<row>&status=Approved|Rejected|Pending`
  → writes the `Status` (+ `Decision At`) cell for that row.
- The dashboard renders whatever columns your form produces — no schema to
  maintain. Rename/`Approve`/`Reject` safely; the `Status` column is the only
  one the script owns.

## Rotating the passcode

Change the `IGNITE_ADMIN_PASSCODE` script property. Everyone re-enters the new
passcode. No site redeploy needed.

## Notes / limits

- The passcode lives in the browser tab's `sessionStorage` only while unlocked.
- Apps Script free quota is far more than a student event needs.
- If you re-deploy the script, keep using the **same deployment** (Manage
  deployments → edit) or the `/exec` URL changes.
