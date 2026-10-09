/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  IGNITE 2026 · CENTRAL EVENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every editable piece of the website lives here. No component should hardcode
 *  event information. Edit a value below and it updates everywhere it appears.
 *
 *  ⌄⌄⌄  ORGANIZERS: start here. Placeholders are surrounded by [BRACKETS].
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const event = {
  name: "IGNITE",
  edition: "2026",
  /** Shown as the main headline: "IGNITE 2026" */
  displayName: "IGNITE 2026",
  tagline: "PROTOTYPE. VALIDATE. SHIP.",
  subtitle: "4-Week Industry Product Prototyping Sprint",
  institution: "Vijaya Vittala Institute of Technology",
  city: "Bengaluru",
  heroDescription:
    "IGNITE is a 4-week open innovation sprint where student teams turn their own ideas into working prototypes — mentored end-to-end and powered by SmartX Technologies and AptPath.",
  /**
   * Live status windows (absolute IST timestamps). The status pill switches
   * between REGISTRATIONS OPEN SOON → REGISTRATIONS OPEN → LIVE NOW → EVENT
   * ENDED based on these gates.
   */
  date: "2026-10-16T14:00:00+05:30",
  registrationsOpenAt: "2026-09-25T00:00:00+05:30",
  liveAt: "2026-10-16T14:00:00+05:30",
  endsAt: "2026-11-13T23:59:59+05:30",
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
      detail: `Kickoff ${scheduleDates.dateLabel}`,
    };
  }
  if (t < STATUS_GATES.ends) {
    return {
      kind: "live",
      label: "SPRINT LIVE",
      detail: `Running until ${scheduleDates.endLabel} · ${scheduleDates.dateLabel}`,
    };
  }
  return {
    kind: "ended",
    label: "PROGRAM ENDED",
    detail: `Program concluded ${scheduleDates.endLabel}`,
  };
}

/* ── EVENT DATE & TIME ────────────────────────────────────────────────────── */
export const scheduleDates = {
  /** Human friendly label used across the site */
  dateLabel: "16 October 2026",
  /** ISO date for structured data */
  dateISO: "2026-10-16",
  /** Label for when the sprint wraps up */
  endLabel: "13 November 2026",
  /** Start / end time (24h) — the kickoff session window. */
  startTime: "14:00",
  endTime: "17:00",
  timeZone: "IST",
  /** UTC offset used for absolute timestamps (countdown + JSON-LD). */
  timeZoneOffset: "+05:30",
  /** Duration of the sprint */
  durationLabel: "4 Weeks",
  format: "On-campus & Online",
} as const;

/**
 * HERO COUNTDOWN
 *  — enabled + targetISO  → a live countdown runs until the kickoff.
 *  — enabled + targetISO in the past → countdown switches to "SPRINT IS LIVE".
 *  Set the target to the moment kickoff/check-in begins.
 */
export const countdown = {
  enabled: true,
  targetISO: "2026-10-16T23:59:59+05:30",
  label: "KICKOFF IN",
  /** Optional note shown under the countdown. Empty string hides it. */
  note: "Kickoff 16 October 2026 · Seminar Hall, VVIT Campus",
} as const;

/* ── VENUE ────────────────────────────────────────────────────────────────── */
export const venue = {
  name: "Vijaya Vittala Institute of Technology",
  addressLine1: "Kothanur Post, Hennur–Bagalur Road, Bengaluru – 560077",
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
   * Paste the shareable link to your registration form here.
   * While empty, the REGISTER buttons show a friendly "coming soon"
   * state instead of sending visitors to a dead link.
   */
  googleFormUrl: "", // TODO: paste your registration form link here
  fee: "₹149",
  feePer: "per team",
  feeNote: "Flat ₹149 per team for the full 4-week sprint.",
  teamSize: { min: 2, max: 3, label: "2 – 3 members per team" },
  /** Registration window. Leave fields null until announced. */
  opens: null as string | null, // e.g. "2026-09-25T09:00:00+05:30"
  closes: null as string | null, // e.g. "2026-10-14T23:59:59+05:30"
  deadlineLabel: "To be announced",
  /** Checklist shown on the Register page — things teams should have ready. */
  whatToPrepare: [
    "Team details — name, college, city",
    "Full name, email, phone, branch & year for every member",
    "GitHub profiles (required for the build)",
    "Laptops, chargers and a valid student ID",
    "All members must be students (eligible colleges as listed)",
  ],
} as const;

/* ── PAYMENT ──────────────────────────────────────────────────────────────── */
/**
 * The payment page intentionally shows a "yet to be updated" state until the
 * organizing team finalises the fee and payment channel. Flip `status` to
 * "live" (and fill the fields) once confirmed.
 */
export const payment = {
  status: "pending" as "pending" | "live",
  notice: "PAYMENT DETAILS YET TO BE UPDATED",
  message:
    "The registration fee and payment link for IGNITE 2026 are being finalised. This page will be updated with the official amount, UPI / bank details and a secure payment link once confirmed.",
  fee: registration.fee,
  steps: [
    "Official fee & team confirmation",
    "UPI / bank transfer details",
    "Secure payment link",
    "Payment confirmation & receipt",
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
  "These domains are just starting points — your team brings its own idea and shapes it with mentor guidance.";

/* ── ELIGIBILITY ──────────────────────────────────────────────────────────── */
export const eligibility = {
  title: "Who can participate?",
  groups: [
    { label: "Engineering students", note: "All branches — B.E. / B.Tech" },
    { label: "Computer Science", note: "CSE / ISE / AI & DS / ML" },
    { label: "AI / ML students", note: "Core & applied AI programs" },
    { label: "Data Science students", note: "Analytics, engineering & statistics" },
    { label: "Electronics & other disciplines", note: "ECE, EEE, mechanical, civil…" },
    { label: "Product-minded builders", note: "If you can define a problem, you belong" },
  ],
  note:
    "Open to student teams of 2–3. Each team brings its own idea and works with mentors to turn it into a working prototype.",
  /** Optional, only render if set */
  extra: null as string | null,
} as const;

/* ── PRIZES ───────────────────────────────────────────────────────────────── */
export const prizes = {
  /** When FINAL, the notice is hidden and categories render as cards. */
  status: "FINAL" as "TBA" | "FINAL",
  notice: "REWARDS & RECOGNITION",
  /** Reward tiers. */
  categories: [
    "First Prize — ₹15,000",
    "Runner-Up — ₹10,000",
    "6-Month Program Subscription · worth ₹49,999",
  ],
} as const;

/* ── SPONSORS & PARTNERS ──────────────────────────────────────────────────── */
export const sponsors = {
  notice: "POWERED BY OUR PARTNERS",
  categories: [
    "Presented With",
    "Platform Partner",
    "Technology Partner",
    "Community Partner",
  ],
  /**
   * Priority order (top to bottom): SmartX Technologies → AptPath → Samagra.
   * The first entry renders as the featured partner.
   */
  partners: [
    { name: "SmartX Technologies", category: "In collaboration with", logo: "/logos/smartx.jpeg" },
    { name: "AptPath", category: "Platform Partner", logo: "/logos/aptpath.png" },
    { name: "Samagra", category: "Community Partner", logo: "/logos/samagra.png" },
  ] as { name: string; category: string; logo?: string }[],
} as const;

/* ── HOW IT WORKS (PRISM) ─────────────────────────────────────────────────── */
export const howItWorks = [
  { step: "01", title: "Register your team", description: "Form a team of 2–3 members and register your interest for the sprint." },
  { step: "02", title: "Bring your idea", description: "Come in with your own idea — any domain, any problem you care about solving." },
  { step: "03", title: "Research & validate", description: "Pressure-test the idea, understand users and refine the problem you're solving." },
  { step: "04", title: "Plan the build", description: "Turn your idea into a clear implementation plan with success criteria." },
  { step: "05", title: "Build the prototype", description: "Build a working prototype over the weeks with AI-assisted workflows." },
  { step: "06", title: "Mentor reviews", description: "Weekly milestone check-ins with industry mentors keep you on track." },
  { step: "07", title: "Demo & showcase", description: "Present your working prototype to judges and mentors at the closing showcase." },
] as const;

/* ── ABOUT ────────────────────────────────────────────────────────────────── */
export const about = {
  paragraphs: [
    "IGNITE is a 4-week open innovation sprint run by Vijaya Vittala Institute of Technology with SmartX Technologies and AptPath. Teams bring their own idea and take it from first principles to a working prototype.",
    "Guided by the PRISM product methodology, expert mentors and weekly milestone reviews, you learn by building — and ship something that actually works.",
  ],
  pillars: [
    { title: "Idea first", description: "Start from your own idea and define what's worth solving." },
    { title: "Open domain", description: "Build across AI, web, data, automation, social impact and more." },
    { title: "Expert mentorship", description: "Get guidance from experienced domain professionals." },
    { title: "AI-assisted build", description: "Use AI as a force multiplier — you own every output." },
    { title: "Working prototype", description: "Ship something functional that solves a real problem." },
    { title: "Industry badges", description: "Earn digital credentials recognised by industry." },
    { title: "Finale & showcase", description: "Present to judges and mentors for rewards and recognition." },
  ],
} as const;

/* ── EVENT TIMELINE (4-WEEK SPRINT) ───────────────────────────────────────── */
/** value can be a label, a time or a date — everything shown exactly as written. */
export const schedule = [
  { key: "kickoff", label: "Kickoff & Team Formation", value: "16 October 2026", highlight: true },
  { key: "week1", label: "Week 1 — Ideation & Research", value: "16 – 23 October 2026", highlight: false },
  { key: "week2", label: "Week 2 — Ideation & Implementation Plan", value: "24 – 30 October 2026", highlight: false },
  { key: "week3", label: "Week 3 — System Build (AI-assisted)", value: "31 Oct – 6 November 2026", highlight: false },
  { key: "week4", label: "Week 4 — Testing & Milestone Review", value: "7 – 13 November 2026", highlight: false },
  { key: "finale", label: "Finale — Showcase & Results", value: "To be announced", highlight: false },
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
    body: "All work must be original and created during the sprint. Pre-built or previously-submitted projects are not permitted.",
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
    title: "Starter code",
    body: "Templates, boilerplates and starter code are allowed as foundations, but the core logic and functionality must be built during the sprint.",
  },
  {
    title: "APIs",
    body: "External APIs and services may be used, subject to their terms of service. API keys must not be committed to the repository.",
  },
  {
    title: "Submission requirements",
    body: "Teams must submit their source repository and a working prototype demo before the final review. [Organizers: finalize exact submission channel & format]",
  },
  {
    title: "Milestone reviews",
    body: "Progress is reviewed weekly against defined milestones. Teams are expected to attend mentor check-ins and document their outcomes.",
  },
  {
    title: "Judging",
    body: "Solutions are judged on innovation, technical complexity, impact, usability and the quality of the final demo. [Organizers: finalize rubric]",
  },
  {
    title: "Disqualification",
    body: "Plagiarism, copied code without attribution, violation of the code of conduct, or any form of misconduct results in disqualification.",
  },
  {
    title: "Intellectual property",
    body: "Teams retain ownership of the work they create during the sprint. [Organizers: finalize IP terms]",
  },
  {
    title: "Code of conduct",
    body: "All participants agree to behave respectfully and inclusively throughout the programme. Harassment or discrimination of any kind is not tolerated.",
  },
] as const;

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
export const faqs = [
  { q: "What is IGNITE?", a: "IGNITE 2026 is a 4-week open innovation sprint at VVIT, Bengaluru, where student teams turn their own ideas into working prototypes with expert mentorship." },
  { q: "Who can participate?", a: "College students from any discipline — engineering, computer science, AI/ML, data science, electronics and product-minded builders. See the eligibility section." },
  { q: "How long is the programme?", a: "The sprint runs for 4 weeks, kicking off on 16 October 2026 and closing with the final showcase." },
  { q: "How many members can be in a team?", a: `Teams of ${registration.teamSize.min}–${registration.teamSize.max} members.` },
  { q: "Is the event online or offline?", a: "Kickoff is on campus at the VVIT Seminar Hall, with hybrid and online collaboration through the sprint. [Organizers: finalize hybrid scope]" },
  { q: "Do we need a finished product?", a: "No. You bring your own idea and build a working prototype over the 4 weeks — mentorship and milestone reviews guide you." },
  { q: "Do we have to pick from fixed problem statements?", a: "No — IGNITE is open innovation. You bring your own idea; the themes are just starting points." },
  { q: "What is PRISM?", a: "PRISM is SmartX Technologies' industry-grade product development methodology — problem first, research & ideation, implementation plan, system build and milestone reviews." },
  { q: "What can we win?", a: "₹15,000 for the first prize, ₹10,000 for the runner-up, plus a 6-month programme subscription worth ₹49,999, verified certificates and industry-recognised digital badges." },
  { q: "Are certificates provided?", a: "Yes — verified certificates and digital credentials are awarded to participants." },
  { q: "Can we use AI tools?", a: "Yes — AI-assisted development is encouraged. You must own and be able to explain every output during evaluation." },
  { q: "What should participants bring?", a: "A laptop, charger, a GitHub account and a valid student ID. Everything else needed to build is guided by your mentor." },
  { q: "How do we register?", a: "Team registration opens shortly. The registration and payment links will be updated here once finalised — see the payment page for the current status." },
  { q: "Who organises IGNITE?", a: "Vijaya Vittala Institute of Technology with SmartX Technologies and AptPath, supported by Samagra, the VVIT student body." },
  { q: "Where do we get updates?", a: "Follow the organising team on social media and check back here for schedule, registration and payment updates." },
] as const;

/* ── CONTACT ──────────────────────────────────────────────────────────────── */
export const contact = {
  email: "samagra2k26@gmail.com",
  phone: "+91 74112 64727",
  phoneAlt: "+91 93809 87187",
  instagram: "https://www.instagram.com/samagra_vvit/",
  linkedin:
    "https://www.linkedin.com/school/vijaya-vittala-institute-of-technology/",
  whatsapp: "", // TODO: add shareable WhatsApp invite link
  discord: "", // TODO: add invite link when ready
  socialLabel: "Follow IGNITE for updates",
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
    { label: "Payment", to: "/payment" },
    { label: "Register", to: "/register" },
    { label: "Contact", to: "/#contact" },
  ],
  copyright: "© 2026 IGNITE. All rights reserved.",
  madeBy:
    "Organized by Vijaya Vittala Institute of Technology, Bengaluru, with SmartX Technologies and AptPath.",
} as const;

/* ── SEO ──────────────────────────────────────────────────────────────────── */
export const seo = {
  /** Replace with the real production URL once deployed (used for canonicals + OG + sitemap). */
  siteUrl: "https://hack-matrix-lac.vercel.app",
  title: "IGNITE 2026 | 4-Week Product Prototyping Sprint | VVIT Bengaluru",
  description:
    "IGNITE 2026 is a 4-week industry product prototyping sprint at Vijaya Vittala Institute of Technology, Bengaluru, in collaboration with SmartX Technologies and AptPath. Turn your own ideas into working prototypes.",
  keywords: [
    "IGNITE 2026",
    "IGNITE",
    "product prototyping",
    "innovation sprint",
    "Bengaluru",
    "VVIT",
    "SmartX Technologies",
    "AptPath",
    "student innovation",
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
