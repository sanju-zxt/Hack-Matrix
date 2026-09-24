/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HACK-MATRIX 2026 · CENTRAL EVENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every editable piece of the website lives here. No component should hardcode
 *  event information. Edit a value below and it updates everywhere it appears.
 *
 *  ⌄⌄⌄  ORGANIZERS: start here. Placeholders are surrounded by [BRACKETS].
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const event = {
  name: "HACK-MATRIX",
  edition: "2026",
  /** Shown as the main headline: "HACK-MATRIX 2026" */
  displayName: "HACK-MATRIX 2026",
  tagline: "BUILD. SOLVE. INNOVATE.",
  subtitle: "8-Hour Inter-Collegiate Hackathon",
  institution: "Vijaya Vittala Institute of Technology",
  city: "Bengaluru",
  heroDescription:
    "An intense 8-hour build-from-zero hackathon where teams receive the problem statement at the start of the event and turn ideas into working solutions.",
  /**
   * Live status windows (absolute IST timestamps). The status pill switches
   * between REGISTRATIONS OPEN SOON → REGISTRATIONS OPEN → LIVE NOW → EVENT
   * ENDED based on these gates.
   */
  date: "2026-10-15T09:00:00+05:30",
  registrationsOpenAt: "2026-09-15T00:00:00+05:30",
  liveAt: "2026-10-15T09:00:00+05:30",
  endsAt: "2026-10-15T19:00:00+05:30",
} as const;

/* ── LIVE STATUS HELPER ───────────────────────────────────────────────────── */
type EventKind = "soon" | "open" | "live" | "ended";

export interface EventStatus {
  kind: EventKind;
  label: string;
  detail: string;
}

const STATUS_GATES = {
  opens: Date.parse(event.registrationsOpenAt),
  live: Date.parse(event.liveAt),
  ends: Date.parse(event.endsAt),
} as const;

export function getEventStatus(now: Date = new Date()): EventStatus {
  const t = now.getTime();
  if (t < STATUS_GATES.opens) {
    return {
      kind: "soon",
      label: "REGISTRATIONS OPEN SOON",
      detail: `Registrations open ${scheduleDates.dateLabel}`,
    };
  }
  if (t < STATUS_GATES.live) {
    return {
      kind: "open",
      label: "REGISTRATIONS OPEN",
      detail: `Build day ${scheduleDates.dateLabel} · ${scheduleDates.startTime} ${scheduleDates.timeZone}`,
    };
  }
  if (t < STATUS_GATES.ends) {
    return {
      kind: "live",
      label: "LIVE NOW",
      detail: `Live until ${scheduleDates.endTime} ${scheduleDates.timeZone} · ${scheduleDates.dateLabel}`,
    };
  }
  return {
    kind: "ended",
    label: "EVENT ENDED",
    detail: `Event concluded ${scheduleDates.dateLabel}`,
  };
}

/* ── EVENT DATE & TIME ────────────────────────────────────────────────────── */
export const scheduleDates = {
  /** Human friendly label used across the site */
  dateLabel: "15 October 2026",
  /** ISO date for structured data */
  dateISO: "2026-10-15",
  /** Start / end time (24h). 8-hour build happens inside this window. */
  startTime: "09:00",
  endTime: "19:00",
  timeZone: "IST",
  /** UTC offset used for absolute timestamps (countdown + JSON-LD). */
  timeZoneOffset: "+05:30",
  /** Duration of the build phase */
  durationLabel: "8 Hours",
  format: "Offline + Hybrid",
} as const;

/**
 * HERO COUNTDOWN
 *  — enabled + targetISO  → a live countdown runs until the event starts.
 *  — enabled + targetISO in the past → countdown switches to "EVENT IS LIVE".
 *  Set the target to the moment registrations/check-in begins.
 */
export const countdown = {
  enabled: true,
  targetISO: "2026-10-15T09:00:00+05:30",
  label: "EVENT STARTS IN",
  /** Optional note shown under the countdown. Empty string hides it. */
  note: "Check-in opens at 09:00 IST · times may be fine-tuned by the organizing team",
} as const;

/* ── VENUE ────────────────────────────────────────────────────────────────── */
export const venue = {
  name: "Vijaya Vittala Institute of Technology",
  addressLine1: "Bengaluru, Karnataka, India",
  /**
   * Google Maps. A search query is safe (unknown official pin) — replace with
   * a pinned embed/maps URL once the exact campus block is finalized.
   */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Vijaya%20Vittala%20Institute%20of%20Technology%20Bengaluru",
  /** Google Maps embed src used on the contact map (lazy-loaded). */
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Vijaya%20Vittala%20Institute%20of%20Technology%20Bengaluru&output=embed",
} as const;

/* ── REGISTRATION & FEE ───────────────────────────────────────────────────── */
export const registration = {
  /**
   * THE ONE FIELD YOU MUST FILL BEFORE GOING LIVE.
   * Paste the shareable link to your Google Form here.
   * While empty, the REGISTER buttons show a friendly "Form link coming soon"
   * state instead of sending visitors to a dead link.
   */
  googleFormUrl: "", // TODO: paste your Google Form link here
  fee: "₹399",
  feePer: "per team",
  feeNote:
    "Registrations are handled through the official registration form. The ₹399 fee per team is collected as part of the registration process.",
  teamSize: { min: 2, max: 4, label: "2 – 4 members per team" },
  /** Registration window. Leave fields null until announced. */
  opens: null as string | null, // e.g. "2026-09-01T09:00:00+05:30"
  closes: null as string | null, // e.g. "2026-10-10T23:59:59+05:30"
  deadlineLabel: "To be announced",
  /** Checklist shown on the Register page — things teams should have ready. */
  whatToPrepare: [
    "Team details — name, college, city",
    "Full name, email, phone, branch & year for every member",
    "GitHub profiles (required for submission)",
    "LinkedIn profiles (recommended)",
    "All members must be students (eligible colleges as listed)",
  ],
} as const;

/* ── THEMES ───────────────────────────────────────────────────────────────── */
/** Icon keys are resolved in the Themes component — keep keys from that list. */
export const themes = [
  { title: "Artificial Intelligence", icon: "brain", description: "Intelligent systems, reasoning, agents and generative AI." },
  { title: "Machine Learning", icon: "chart", description: "Models, predictions and data-driven decision making." },
  { title: "Data Science", icon: "database", description: "Extracting insight from data and building analytics tools." },
  { title: "Web & Full-Stack", icon: "globe", description: "Modern applications, APIs and complete product builds." },
  { title: "Automation", icon: "zap", description: "Tools and bots that reduce human effort and error." },
  { title: "Cybersecurity", icon: "shield", description: "Protecting systems, data and privacy in a connected world." },
  { title: "Cloud & DevOps", icon: "cloud", description: "Infrastructure, deployment, scaling and reliability." },
  { title: "Social Impact", icon: "heart", description: "Technology that solves problems for communities." },
  { title: "Open Innovation", icon: "sparkles", description: "Anything bold, novel and unexpected — build it." },
] as const;

export const themesNote =
  "Final problem statements will be revealed at the beginning of the hackathon.";

/* ── ELIGIBILITY ──────────────────────────────────────────────────────────── */
export const eligibility = {
  title: "Who can participate?",
  groups: [
    { label: "Engineering students", note: "All branches — B.E. / B.Tech" },
    { label: "Computer Science", note: "CSE / ISE / AI & DS / ML" },
    { label: "AI / ML students", note: "Core & applied AI programs" },
    { label: "Data Science students", note: "Analytics, engineering & statistics" },
    { label: "Electronics & other disciplines", note: "ECE, EEE, mechanical, civil…" },
    { label: "Anyone passionate about tech & innovation", note: "Interest matters more than the degree" },
  ],
  note:
    "Configurable — entry criteria, year bands and any college restrictions are controlled by the organizing team.",
  /** Optional, only render if set */
  extra: null as string | null,
} as const;

/* ── PRIZES ───────────────────────────────────────────────────────────────── */
export const prizes = {
  /** TBA until finalized. When set, edit|notice is hidden and items render. */
  status: "TBA" as "TBA" | "FINAL",
  notice: "PRIZES & SPECIAL AWARDS — TO BE ANNOUNCED",
  /** Future prize categories (rendered as ghost slots once status = FINAL). */
  categories: [
    "Winner",
    "Runner Up",
    "Best AI Solution",
    "Best Use of APIs",
    "Best Automation",
    "Best Cloud Deployment",
    "Special Jury Award",
  ],
} as const;

/* ── SPONSORS & PARTNERS ──────────────────────────────────────────────────── */
export const sponsors = {
  notice: "PARTNERS WILL BE ANNOUNCED SOON",
  /** Add paid partners here — each entry becomes a logo slot automatically. */
  categories: [
    "Title Partner",
    "Technology Partner",
    "AI Partner",
    "Cloud Partner",
    "Developer Partner",
    "Community Partner",
  ],
  /** Items below are placeholders — fill real names/logos (public/<name>.png). */
  partners: [] as { name: string; category: string; logo?: string }[],
} as const;

/* ── HOW IT WORKS ─────────────────────────────────────────────────────────── */
export const howItWorks = [
  { step: "01", title: "Register", description: "Complete your team registration." },
  { step: "02", title: "Check In", description: "Arrive at the venue and complete verification." },
  { step: "03", title: "Problem Reveal", description: "Problem statements are released at the beginning of the event." },
  { step: "04", title: "Build", description: "Teams have 8 hours to build their solution." },
  { step: "05", title: "Submit", description: "Submit project, repository and required documentation before the deadline." },
  { step: "06", title: "Demo", description: "Shortlisted teams present their solutions to the judges." },
  { step: "07", title: "Results", description: "Winners are announced during the closing ceremony." },
] as const;

/* ── ABOUT ────────────────────────────────────────────────────────────────── */
export const about = {
  paragraphs: [
    "HACK-MATRIX is an 8-hour innovation sprint where participants receive the challenge / problem statements at the beginning of the event. Teams must ideate, design, develop, deploy and present a working solution within the given time.",
    "No pre-built projects, no prepared pitches — everything starts from zero on event day. What matters is how fast your team can think, prototype and ship.",
  ],
  pillars: [
    { title: "Build from zero", description: "Ideate, build and ship within the event window." },
    { title: "Real-world problem solving", description: "Tackle practical challenges that matter." },
    { title: "Rapid prototyping", description: "Turn an idea into a working demo — fast." },
    { title: "AI & emerging tech", description: "Experiment with the stacks that define tomorrow." },
    { title: "Deployment", description: "Ship something that actually runs and works." },
    { title: "Final demonstration", description: "Present your solution live to judges." },
    { title: "Industry exposure", description: "Interact with peers, mentors and reviewers." },
  ],
} as const;

/* ── EVENT TIMELINE (SCHEDULE) ────────────────────────────────────────────── */
/** value can be a label, a time or a date — everything shown exactly as written. */
export const schedule = [
  { key: "opens", label: "Registration Opens", value: "To be announced", highlight: false },
  { key: "closes", label: "Registration Closes", value: "To be announced", highlight: false },
  { key: "eventDay", label: "Event Day", value: "15 October 2026", highlight: true },
  { key: "reveal", label: "Problem Statement Reveal", value: "At event start · 09:00 IST", highlight: false },
  { key: "submission", label: "Submission Deadline", value: "Announced at the event", highlight: false },
  { key: "finals", label: "Final Presentations", value: "Announced at the event", highlight: false },
  { key: "results", label: "Results & Closing", value: "Announced at the event", highlight: false },
] as const;

/* ── RULES ────────────────────────────────────────────────────────────────── */
/**
 * Every rule is configurable. Defaults are conservative and intentionally avoid
 * inventing policy — organizers must finalize each one before go-live.
 */
export const rules = [
  {
    title: "Eligibility",
    body: "Open to currently enrolled college students. Team members must provide valid institutional email / college details. [Organizers: finalize eligible colleges & year bands]",
  },
  {
    title: "Team size",
    body: `Teams of ${registration.teamSize.min}–${registration.teamSize.max} members. Each participant may be part of only one team.`,
  },
  {
    title: "Originality",
    body: "All work must be original and created during the event. Pre-built or submitted-elsewhere projects are not permitted.",
  },
  {
    title: "AI usage",
    body: "AI-assisted development is permitted and encouraged — but the understanding of your solution must be demonstrated during evaluation. [Organizers: finalize AI-tool policy]",
  },
  {
    title: "Open-source usage",
    body: "Open-source libraries and frameworks may be used with proper attribution and licenses.",
  },
  {
    title: "Pre-built code",
    body: "Templates, boilerplates and starter code are allowed as foundations, but the core logic and functionality must be built during the hackathon.",
  },
  {
    title: "APIs",
    body: "External APIs and services may be used, subject to their terms of service. API keys must not be committed to the repository.",
  },
  {
    title: "Submission requirements",
    body: "Teams must submit their source repository, a working demo link/app and any required documentation before the deadline. [Organizers: finalize exact submission channel & format]",
  },
  {
    title: "Late submission",
    body: "Submissions after the deadline are marked late; grace periods and penalties are at the organizing team's discretion.",
  },
  {
    title: "Judging",
    body: "Solutions are judged on innovation, technical complexity, impact, usability and the quality of the presentation. [Organizers: finalize rubric]",
  },
  {
    title: "Disqualification",
    body: "Plagiarism, copied code without attribution, violation of the code of conduct, or any form of misconduct results in disqualification.",
  },
  {
    title: "Intellectual property",
    body: "Teams retain ownership of the work they create during the event. [Organizers: finalize IP terms]",
  },
  {
    title: "Code of conduct",
    body: "All participants agree to behave respectfully and inclusively throughout the event. Harassment or discrimination of any kind is not tolerated.",
  },
] as const;

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
export const faqs = [
  { q: "What is HACK-MATRIX?", a: "HACK-MATRIX is an 8-hour inter-collegiate hackathon at VVIT, Bengaluru, where teams receive the problem statement at the start and build a working solution within the event window." },
  { q: "Who can participate?", a: "College students from any discipline — engineering, computer science, AI/ML, data science, electronics and technology-orientated programs. See the eligibility section." },
  { q: "How many members can be in a team?", a: `Teams of ${registration.teamSize.min}–${registration.teamSize.max} members.` },
  { q: "Is the event online or offline?", a: "The event is primarily offline at the VVIT campus, with hybrid participation options where applicable. [Organizers: finalize hybrid scope]" },
  { q: "What should participants bring?", a: "A laptop, charger, any required adapters and a valid student ID for check-in. Everything else needed to build." },
  { q: "Will the problem statement be provided beforehand?", a: "No. Problem statements are revealed at the beginning of the event, and teams build from zero from that moment." },
  { q: "Can we use AI tools?", a: "Yes — AI-assisted development is encouraged. Be ready to explain and defend your solution during evaluation." },
  { q: "Can we use external APIs?", a: "Yes, subject to the terms of each service. Don't commit API keys to your repository." },
  { q: "Is GitHub required?", a: "A GitHub repository is required for submission. Create your team repo before the event day." },
  { q: "What happens after registration?", a: "You'll receive confirmation with next steps including check-in timing, venue details and what to prepare." },
  { q: "Is food provided?", a: "[Configurable — to be confirmed by the organizing team.]" },
  { q: "Are certificates provided?", a: "Participation certificates are typically provided; details are announced by the organizing team." },
  { q: "What are the judging criteria?", a: "Innovation, technical complexity, real-world impact, usability and quality of the final demo presentation." },
  { q: "How will teams submit their projects?", a: "Submission includes the source repository, working demo and required documentation, via the channel announced at the event." },
] as const;

/* ── CONTACT ──────────────────────────────────────────────────────────────── */
export const contact = {
  email: "hackmatrix@vvit.edu.in", // TODO: replace with real inbox
  phone: "+91 XXXXX XXXXX", // TODO: replace with real number
  instagram: "https://instagram.com/vvithackmatrix", // TODO: replace handle
  linkedin: "https://linkedin.com/in/vvit-bengaluru", // TODO: replace company profile
  whatsapp: "", // TODO: add shareable WhatsApp invite link
  discord: "", // TODO: add invite link when ready
  socialLabel: "Follow HACK-MATRIX for updates",
} as const;

/* ── NAVIGATION ───────────────────────────────────────────────────────────── */
export const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Themes", to: "/#themes" },
  { label: "Timeline", to: "/#timeline" },
  { label: "Rules", to: "/rules" },
  { label: "FAQ", to: "/faq" },
  { label: "Register", to: "/register" },
  { label: "Contact", to: "/#contact" },
] as const;

/* ── FOOTER ───────────────────────────────────────────────────────────────── */
export const footer = {
  quickLinks: [
    { label: "Home", to: "/" },
    { label: "About", to: "/#about" },
    { label: "Themes", to: "/#themes" },
    { label: "Timeline", to: "/#timeline" },
    { label: "Rules", to: "/rules" },
    { label: "FAQ", to: "/faq" },
    { label: "Register", to: "/register" },
    { label: "Contact", to: "/#contact" },
  ],
  copyright: "© 2026 HACK-MATRIX. All rights reserved.",
  madeBy: "Organized by Vijaya Vittala Institute of Technology, Bengaluru.",
} as const;

/* ── SEO ──────────────────────────────────────────────────────────────────── */
export const seo = {
  /** Replace with the real production URL once deployed (used for canonicals + OG + sitemap). */
  siteUrl: "https://hack-matrix.example.com", // TODO: set production URL
  title: "HACK-MATRIX 2026 | 8-Hour Hackathon | VVIT Bengaluru",
  description:
    "HACK-MATRIX 2026 is an 8-hour inter-collegiate hackathon at Vijaya Vittala Institute of Technology, Bengaluru. Build from zero, solve real-world challenges and present your solution.",
  keywords: [
    "HACK-MATRIX",
    "hackathon",
    "Bengaluru",
    "VVIT",
    "college hackathon",
    "8-hour hackathon",
    "inter-collegiate",
  ],
  ogImage: "/og-image.png",
  lang: "en",
  themeColor: "#05060A",
} as const;

/* ── SITE FLAGS ───────────────────────────────────────────────────────────── */
export const flags = {
  /** Sticky "REGISTER NOW" bar on mobile */
  stickyMobileCta: true,
  /** Show the VVIT logo chip in navbar / hero / footer */
  showLogo: true,
} as const;