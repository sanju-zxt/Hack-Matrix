# RESUME — VVIT IGNITE 2026 landing site

Authoritative state doc. Read this FIRST before touching the project.
Last updated: 2026-10-10 (policy review + smoother phone scroll/back-to-top).

## What this is
Marketing/landing site for **IGNITE 2026** — a 4-week (NOT one-day) industry
product prototyping sprint by Vijaya Vittala Institute of Technology (VVIT),
Bengaluru, with **SmartX Technologies** + **AptPath**, supported by **Samagra**
(VVIT student body). Teams bring their OWN ideas (NO fixed problem statements),
team size **2–3**, fee **₹149 per team**, PRISM methodology.

- **Path**: `C:\Users\Sanju\Projects\hack-matrix`
- **Stack**: Vite + React + TypeScript + Tailwind v4 (CSS-first `@theme` in `src/index.css`) + framer-motion. Tests = Playwright.
- **Repo**: `git@github.com:sanju-zxt/Hack-Matrix.git`, branch **`master`**
- **LIVE domain**: **https://www.ignitearena.live** (was `hack-matrix-lac.vercel.app`)
- Brand: ink `#05060a` / violet `#7c6cff` / blue `#5b8cff` + VVIT leaf/olive accents.

## Git state (as of shutdown)
- `HEAD = 3e92606` "smoother phone scroll + back-to-top button" — **all pushed**, `master` in sync with `origin/master`.
- This session's commits (oldest→newest), all pushed:
  1. `eceb6d8` live Razorpay payment + organizer & team-status dashboards
  2. `04972a9` registration deadline 19 Oct 12:00 AM
  3. `ca5f357` policy review — name Razorpay, point to payment page, date bump (`UPDATED` = 10 Oct 2026)
  4. `3e92606` smoother phone scroll + back-to-top button
- Untracked (intentionally NOT in git): `.snapshots/`, `VVIT IGNITE Brochure - October 2026 - v5.pdf.pdf`, root `aptpath.png` / `samagra.png` / `smartx.jpeg`.
- Working tree otherwise clean. Build green, lint clean (only pre-existing `Logo.tsx:23` warning), 56/56 Playwright pass.

## Scroll / mobile UX (2026-10-10)
- `index.css`: `html { scroll-padding-top: var(--nav-h-safe); overscroll-behavior-y: contain; }` + `body { overscroll-behavior-y: contain; }` (anchors clear sticky navbar; no rubber-band chaining on phones).
- New `src/components/layout/BackToTop.tsx` — floating back-to-top button (appears after 640px, sits above the sticky CTA via `--sticky-cta-h`, respects reduced-motion). Rendered in `Layout.tsx`, hidden while the mobile menu is open.

## Payment (LIVE, 2026-10-10)
- `payment.status` = **"live"**; `payment.link` = **https://razorpay.me/@lohithsanjup** (handle `@lohithsanjup`, provider Razorpay).
- `PaymentPage.tsx` rewritten: fee card + **PAY ₹149 NOW** button (opens Razorpay in a new tab) + 4-step flow + security/refund notes. Renders a holding state only if `status` is flipped back to `"pending"`.
- Legal pages (policies.ts) already say the ₹149 is paid through the link in the form / payment provider — no change needed, but still **user-reviewed wording is pending**.

## Dashboards (2026-10-10)
Two new routes, both driven by the **Google Sheet** that collects form responses, via a free **Google Apps Script Web App** (`tool/apps-script/Code.gs` + `README.md`):
- **`/admin`** (`AdminPage.tsx`) — organizer team-approval dashboard. Passcode gate (stored in `sessionStorage` key `admin.sessionKey`). Lists teams, search + status filter, Approve / Reject / Reset per team. Writes to a `Status` (+ `Decision At`) column in the sheet.
- **`/team`** (`TeamPage.tsx`) — public, read-only "My Team" status lookup by **registered email or team code**. Shows members + fields + approval status. No passcode.
- Shared: `src/lib/adminApi.ts` (fetch/decide/lookup + `teamTitle`), `src/lib/teamStatus.ts` (normalize + colors), `src/components/ui/TeamStatusBadge.tsx`.
- **WIRED (2026-10-10)**: `admin.endpoint` = the deployed `.../exec` URL (probed → returns `{"error":"unauthorized"}` for a wrong token, so the Web App is live and the `IGNITE_ADMIN_PASSCODE` script property is set). Organizers enter the passcode at `/admin`; `/team` needs no passcode.
- `/team` is linked from the footer ("Team Status") and the Register page; `/admin` is unlinked by design.

## New pages (2026-10-10)
| Route | Page | Notes |
|---|---|---|
| `/about` | `AboutPage.tsx` | hero + `<About/>` + `<Sponsors/>` + CTA |
| `/contact` | `ContactPage.tsx` | hero + `<Contact/>` |
| `/legal/:slug` | `InfoPage.tsx` | generic doc page (TOC + numbered sections + contact card + cross-links); unknown slug → friendly 404 |

- Content lives in **`src/data/policies.ts`**: `legalPages` (6: `privacy-policy`, `terms-conditions`,
  `refund-cancellation`, `shipping-delivery`, `pricing`, `payment-policy`), `getLegalPage`, `legalPath`,
  **`infoLinks`** (all 8, used by the footer).
- Footer got a 4th column **"Information"** (`grid lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]`);
  `footer.quickLinks` no longer contains About/Contact (moved into the new column — 7 links).
- Policies state: **no refunds**, `₹149 per team` paid **after** registering (link in form),
  goodies **in person at finale** for selected on-campus teams, personal data visible to
  **organizers + SmartX/AptPath mentors**, organiser = **VVIT + Samagra + SmartX + AptPath**.
  Wording is hand-drafted — **user must review before go-live.**

## Single source of truth
`src/data/eventConfig.ts` drives almost everything. Key fields:
- `event` (name/edition/city/tagline/heroDescription), `seo.siteUrl` = `https://www.ignitearena.live`
- `scheduleDates`: dateLabel "16 October 2026", dateISO 2026-10-16, endLabel "13 November 2026",
  startTime "14:00" / endTime "17:00" / timeZone "IST" / timeZoneOffset "+05:30",
  durationLabel "4 Weeks", format "On-campus & Online"
- `countdown`: enabled, `targetISO = "2026-10-16T23:59:59+05:30"` (end of kickoff day), label "KICKOFF IN",
  note "Kickoff 16 October 2026 · Seminar Hall, VVIT Campus"
- `registration`: **`googleFormUrl: ""` (EMPTY — blocker)**, fee "₹149", feePer "per team",
  teamSize {min:2,max:3,label:"2 – 3 members per team"}, `deadlineLabel: "19 October 2026 · 12:00 AM"`, opens 2026-09-25 / closes 2026-10-19
- `payment`: `status:"pending"` (page shows "PAYMENT DETAILS YET TO BE UPDATED"), `fee` inherits ₹149
- `contact`: email `samagra2k26@gmail.com`, phone `+91 74112 64727`, phoneAlt `+91 93809 87187`,
  instagram `https://www.instagram.com/samagra_vvit/`,
  linkedin `https://www.linkedin.com/school/vijaya-vittala-institute-of-technology/`,
  whatsapp "" + discord "" (empty)
- `sponsors.partners`: SmartX (featured) → AptPath → Samagra; logos in `public/logos/`
- `howItWorks`: **7 steps** (Register → Bring your idea → Research & validate → Plan the build →
  Build the prototype → Mentor reviews → Demo & showcase)
- `schedule`: kickoff "16 October 2026"; weeks 1–4 (16 Oct–13 Nov); finale value "To be announced"
- `themes` (9 domains) + `themesNote` (starting points, own idea)

## Done this project (recent)
- **8 info/legal pages added 2026-10-10** — see "New pages" table above; footer "Information" column,
  sitemap gained 8 entries, tests went 33 → **52**.
- VVIT logo (`public/vvitlogo.jpg`) replaced with a clean render of `VVIT logo.pdf` (square, white bg,
  same footprint) — also copied to `vvit-hub-v1\assets\images\vvitlogo.jpg` + `vvit-hub-v1\vvitlogo.jpg`.
- Full rebrand HACK-MATRIX → IGNITE 2026 (all sections, SEO, OG/favicon via `npm run generate:assets`, README).
- Team 2–3; own-idea flow (no problem statements); 7-step how-it-works; 4-week copy (no single-day wording).
- Prizes layout fix (3rd card no longer spans 2 cols on `lg`); Schedule/EventInformation copy de-hackathon'd.
- **Fee ₹149**; payment page still "yet to be updated" by design.
- **Advanced techy site-wide background** — `.bg-grid-fine`, `.bg-aurora` (rotating), `.scanline`, `.bg-dots`,
  3 glow orbs, all pure CSS in `src/index.css` + `SiteBackground` in `src/components/layout/Navbar.tsx`;
  GPU transform/opacity only, reduced-motion safe.
- Times hidden from UI (Hero, EventInformation Time card REMOVED, Schedule footer, Register snapshots).
- Contact info + socials updated; countdown targets end of kickoff day.
- Domain swapped to www.ignitearena.live (UNCOMMITTED — see above).

## Verification (run after any change)
```powershell
npm run build          # tsc -b && vite build   — must be green
npx playwright test    # 56 tests — all must pass
```
Last results: build green, **56/56 Playwright pass** (includes axe on all 15 routes,
8-viewport responsiveness incl. `/about` + `/legal/privacy-policy` + `/team` + `/admin`,
footer link coverage).

## Open items / blockers
1. **`registration.googleFormUrl`** = **https://forms.gle/q2vg9p4EyTctN617A** (set 2026-10-10). REGISTER buttons now go live.
2. **Registration deadline** — set to **19 October 2026 · 12:00 AM** (`closes` 2026-10-19T00:00:00+05:30).
3. **Finale date** — `schedule` finale value still "To be announced".
4. **Dashboards wired (2026-10-10)** — Apps Script deployed; `admin.endpoint` set. Verify end-to-end with a real submission (approve on `/admin`, look up on `/team`).
5. **Policy wording still needs the user's legal review** (drafted by me).
6. **Optional**: whatsapp + discord invite links; exact campus block / Maps pin; confirm prize tiers shown.
7. **Brochure** (deferred): `tool/make-qr.py` default + the brochure QR still encode the OLD url; regenerate with
   `BROCHURE_URL=https://www.ignitearena.live python tool/make-qr.py` if redoing the brochure.
   `tool/patch-six-pages.mjs` is STALE HACK-MATRIX content — ignore.

## Live-history gotchas (learned this project)
- `.snapshots/brochure-7page-CLOBBERED-*.html` — a previous tool run clobbered the brochure. The live brochure
  template is `brochure/hack-matrix-brochure.html` (rebranded copy only); **do NOT rename it, do NOT run the
  render tool** (strict palette/geometry checks).
- Nav was reverted to the original 8 entries; `Partners`/`Payment` are NOT nav items (Payment is in footer quickLinks).
- `Logo.tsx` Brand subtitle = `{event.edition} · {event.city}` (fixed 1024px navbar overflow). 1 pre-existing
  eslint warning at `Logo.tsx:23` (set-state-in-effect) — harmless.
- `rg` is NOT available in this shell; use the Grep tool.

## Suggested next session order
1. Commit+push the pending batch (see PENDING COMMIT) — payment live + dashboards.
2. **Set up the dashboards**: user deploys `tool/apps-script/Code.gs` on the registration sheet, adds the
   `IGNITE_ADMIN_PASSCODE` script property, deploys as Web App (Execute as Me / Access Anyone), pastes the
   `/exec` URL into `admin.endpoint` → build/test → deploy. Then verify `/admin` approve + `/team` lookup.
3. Ask user for the registration form URL + deadline → wire into `eventConfig.ts`.
4. **Ask the user to read the 6 policy pages** — wording drafted by me, not legally reviewed.
5. Redeploy to Vercel (custom domain www.ignitearena.live already configured by user).
