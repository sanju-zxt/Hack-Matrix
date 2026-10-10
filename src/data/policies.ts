/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  IGNITE 2026 · LEGAL & INFORMATIONAL PAGES
 * ─────────────────────────────────────────────────────────────────────────────
 *  All wording is drafted from facts that already live on this site (fee,
 *  team size, dates, organizer / partner list, contact details).
 *  Edit the text below — every page is rendered from this data.
 */

import { contact, registration, scheduleDates } from "./eventConfig";

export interface LegalSection {
  heading: string;
  body?: string[];
  bullets?: string[];
}

export interface LegalPage {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const UPDATED = "10 October 2026";

const contactLine = `Questions about this page? Email ${contact.email}, or call ${contact.phone} / ${contact.phoneAlt}.`;
const feeLine = `${registration.fee} ${registration.feePer}`;

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    label: "Privacy Policy",
    eyebrow: "Privacy",
    title: "Privacy Policy",
    description:
      "What IGNITE 2026 collects when you register, why we collect it, who can see it and how long we keep it.",
    lastUpdated: UPDATED,
    sections: [
      {
        heading: "Who we are",
        body: [
          "IGNITE 2026 is organised by Vijaya Vittala Institute of Technology (VVIT), Bengaluru, together with Samagra — the VVIT student body — and the technology partners SmartX Technologies and AptPath. In this policy, we, us and our mean the IGNITE 2026 organising team and the partners named here.",
        ],
      },
      {
        heading: "Information we collect",
        body: ["We collect only what you choose to share when you register and take part:"],
        bullets: [
          "Name, email address and phone number of every member of your team",
          "College, city, branch and year of study",
          "GitHub profile links, if you choose to share them",
          "Team name, size and member roles",
          "Anything else you type into the registration form or send us by email or phone",
        ],
      },
      {
        heading: "How we use it",
        body: ["We use your information only to run the event:"],
        bullets: [
          "To register and verify your team and check eligibility",
          "To evaluate applications and shortlist teams for mentoring",
          "To assign mentors and run the weekly milestone reviews",
          "To send schedules, announcements, certificates and results",
          "To run the finale, prizes and any related communications",
          "To answer questions you send us",
        ],
      },
      {
        heading: "Who can see it",
        body: [
          "Your details are visible to the IGNITE 2026 organising team. For evaluation and mentoring, the parts they need are also shared with mentors and evaluation partners from SmartX Technologies and AptPath. We do not sell, rent or trade your personal information with anyone.",
        ],
      },
      {
        heading: "Payments",
        body: [
          `The registration fee (${feeLine}) is paid through the official payment page (Razorpay). Card, UPI or net-banking details are entered on the payment provider's secure page — we never see or store them.`,
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "We keep registration information until the sprint and its results are complete, and for a reasonable period afterwards for records, certificates and any questions. You can ask us to delete it sooner — see Your choices below.",
        ],
      },
      {
        heading: "Your choices",
        body: ["You can ask us to:"],
        bullets: [
          "Tell you what information we hold about your team",
          "Correct anything that is wrong",
          "Delete your information once we no longer need to keep it",
          "Stop sending you anything except essential event notices",
        ],
      },
      {
        heading: "Third-party services",
        body: [
          "We rely on third-party tools such as Google Forms for registration and an online payment provider for the fee. Their use of your data is governed by their own privacy policies.",
        ],
      },
      {
        heading: "Security",
        body: [
          "We take reasonable steps to protect your information. No method of storage or transmission is completely secure, so please share only what we need.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "If we update this policy, the latest version will appear on this page with the date shown above.",
        ],
      },
      { heading: "Contact us", body: [contactLine] },
    ],
  },

  {
    slug: "terms-conditions",
    label: "Terms & Conditions",
    eyebrow: "Terms",
    title: "Terms & Conditions",
    description:
      "The terms that apply to every participant of IGNITE 2026 — eligibility, originality, conduct, judging and liability.",
    lastUpdated: UPDATED,
    sections: [
      {
        heading: "Acceptance",
        body: [
          "By registering for IGNITE 2026, your team agrees to these terms, the Rules & Code of Conduct, and the decisions of the organising team.",
        ],
      },
      {
        heading: "Eligibility",
        body: ["To take part you must:"],
        bullets: [
          "Be a current student — all branches and years are welcome",
          "Register as part of a team of 2 – 3 members",
          "Provide accurate, truthful details for every member",
          "Take part as one team — a team registers once, and every member shares responsibility for the submission",
        ],
      },
      {
        heading: "Your idea and originality",
        body: [
          "You bring your own idea to IGNITE — there are no set problem statements. You are responsible for having the rights to the idea, code, data and assets you submit. Plagiarism, or submitting work you do not have the rights to, will lead to disqualification.",
          "AI assistance is encouraged, but you must be able to explain and defend every part of your project when the judges ask.",
        ],
      },
      {
        heading: "Conduct",
        body: [
          "Follow the instructions of the organising team and mentors, respect other participants, and observe the rules of the campus. Harassment, disruptive behaviour or damage to property will result in removal from the event.",
        ],
      },
      {
        heading: "Judging and decisions",
        body: [
          "Judging criteria, the panel and the schedule are decided by the organising team. Decisions made by the organising team on evaluation, shortlisting and results are final.",
        ],
      },
      {
        heading: "Registration fee",
        body: [
          `The registration fee is ${feeLine}, paid through the payment link shared in the registration form after you register. The fee is non-refundable — see the Refund & Cancellation Policy.`,
        ],
      },
      {
        heading: "Dates and changes",
        body: [
          "Dates and milestones shown on this site are indicative. The organising team may adjust the schedule, format or venue where necessary, and will inform registered teams by email or the official social channels.",
        ],
      },
      {
        heading: "Your work and showcasing",
        body: [
          "You keep ownership of the project you build. By submitting it, you allow the organisers to feature the project, your team name and screenshots in the event showcase, results and promotional material.",
        ],
      },
      {
        heading: "Equipment and liability",
        body: [
          "You bring your own laptop, charger and internet access. The organisers are not responsible for loss, damage or theft of personal property, or for interruptions to the event that are beyond reasonable control.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of India, and the courts of Bengaluru, Karnataka have jurisdiction over them.",
        ],
      },
      { heading: "Contact us", body: [contactLine] },
    ],
  },

  {
    slug: "refund-cancellation",
    label: "Refund & Cancellation Policy",
    eyebrow: "Refunds",
    title: "Refund & Cancellation Policy",
    description:
      "How cancellations are handled for IGNITE 2026 — the registration fee is non-refundable once paid.",
    lastUpdated: UPDATED,
    sections: [
      {
        heading: "Registration fee",
        body: [
          `The registration fee is ${feeLine} and is payable through the payment link shared in the registration form.`,
        ],
      },
      {
        heading: "Cancellations by you",
        body: [
          "If your team can no longer take part, write to us at the email below. We will confirm that your registration has been withdrawn.",
        ],
      },
      {
        heading: "No refunds",
        body: [
          `The ${feeLine} registration fee is non-refundable once it has been paid. No refund is issued if:`,
        ],
        bullets: [
          "Your team withdraws or chooses not to take part",
          "Members drop out or the team cannot continue",
          "You miss a registration, submission or session deadline",
          "Your team is not shortlisted for a stage or is disqualified under the rules",
          "The format or schedule of the event changes in a way that still lets your team participate",
        ],
      },
      {
        heading: "Cancellation by the organisers",
        body: [
          "If IGNITE 2026 is cancelled entirely by the organising team, we will communicate the refund decision to registered teams directly.",
        ],
      },
      {
        heading: "Failed or duplicate payments",
        body: [
          "If a payment fails but the amount is debited, or you are charged twice, write to us with the payment reference. We will verify it with the payment provider and, where a duplicate charge is confirmed, arrange a refund of the extra amount.",
        ],
      },
      {
        heading: "How to raise a request",
        body: [contactLine],
      },
    ],
  },

  {
    slug: "shipping-delivery",
    label: "Shipping / Delivery Policy",
    eyebrow: "Delivery",
    title: "Shipping / Delivery Policy",
    description:
      "What is delivered digitally for IGNITE 2026, and how selected on-campus teams collect their goodies.",
    lastUpdated: UPDATED,
    sections: [
      {
        heading: "A digital-first event",
        body: [
          "IGNITE 2026 runs on campus and online. Registration, participation, submissions, certificates and badges are delivered digitally. Nothing you register for is shipped or couriered to you, and there are no shipping charges of any kind.",
        ],
      },
      {
        heading: "Digital delivery",
        body: [
          "Registration confirmations, schedules, links, certificates and digital badges are sent to the email address you register with, or posted on the event's official pages, as and when they are issued.",
        ],
      },
      {
        heading: "Physical goodies",
        body: ["Goodies are for selected teams only, and are collected in person:"],
        bullets: [
          "Goodies go to selected teams that are attending on campus",
          "They are distributed in person at the finale showcase, in the week of " +
            scheduleDates.endLabel,
          "You must attend on campus to collect them — they are not couriered or posted",
          "Contents are subject to availability and the organiser's discretion",
        ],
      },
      {
        heading: "Shipping charges",
        body: ["There are no shipping, handling or delivery charges. The registration fee is the only amount you pay."],
      },
      { heading: "Contact us", body: [contactLine] },
    ],
  },

  {
    slug: "pricing",
    label: "Pricing / Plans",
    eyebrow: "Pricing",
    title: "Pricing / Plans",
    description:
      "One simple plan for IGNITE 2026 — a flat fee per team for the full 4-week sprint, with nothing hidden.",
    lastUpdated: UPDATED,
    sections: [
      {
        heading: "One plan, one price",
        body: [
          `IGNITE 2026 has a single plan: ${feeLine} for the whole team for the entire 4-week sprint. The fee is per team, not per person, so it is split however your team prefers.`,
        ],
      },
      {
        heading: "What the fee covers",
        body: ["Your team's registration includes:"],
        bullets: [
          "Team registration for the full 4-week sprint",
          "The kickoff and four weeks of guided building",
          "Weekly mentor milestone reviews",
          "Access to the sprint templates, resources and community channels",
          "Your submission slot and final judging",
          "A showcase slot at the finale",
          "Certificates of participation for every member",
          "A chance to win the published prizes",
        ],
      },
      {
        heading: "How you pay",
        body: [
          `Register first, then pay ${feeLine} through the official payment page or the link shared in the registration form. Payment is completed online and your team is confirmed once it is received.`,
        ],
      },
      {
        heading: "No hidden charges",
        body: [
          "There is no additional participation fee, no per-person charge and no platform fee. The registration fee is the only amount payable for IGNITE 2026.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "The registration fee is non-refundable. Please read the Refund & Cancellation Policy before you pay.",
        ],
      },
      { heading: "Contact us", body: [contactLine] },
    ],
  },

  {
    slug: "payment-policy",
    label: "Payment Policy",
    eyebrow: "Payment",
    title: "Payment Policy",
    description:
      "How the IGNITE 2026 registration fee is paid, confirmed and recorded — including failed and duplicate payments.",
    lastUpdated: UPDATED,
    sections: [
      {
        heading: "The fee",
        body: [
          `The only amount payable for IGNITE 2026 is ${feeLine}, for the full 4-week sprint.`,
        ],
      },
      {
        heading: "When you pay",
        body: [
          "You register first, then pay through the payment link on the official payment page or the one shared in the registration form.",
        ],
      },
      {
        heading: "Payment methods",
        body: [
          "Payment is made online through our secure Razorpay payment link, using UPI, cards or net banking.",
        ],
      },
      {
        heading: "Confirmation and receipts",
        body: [
          "Once a payment is received and verified, the organising team confirms your team's registration. Keep your payment reference or receipt — email us if you need a copy for your records.",
        ],
      },
      {
        heading: "Failed or duplicate payments",
        body: [
          "If a payment fails but the amount is debited, or you are charged twice, write to us with the payment reference and we will check it with the payment provider. Duplicates are resolved under the Refund & Cancellation Policy.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Payments are handled on the payment provider's secure page. We never see or store your card, UPI or net-banking credentials.",
        ],
      },
      {
        heading: "No refunds",
        body: [
          "The registration fee is non-refundable once paid. See the Refund & Cancellation Policy for details.",
        ],
      },
      { heading: "Contact us", body: [contactLine] },
    ],
  },
];

export function getLegalPage(slug?: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}

export function legalPath(slug: string): string {
  return `/legal/${slug}`;
}

/** Footer group — the full set of information pages the site links to. */
export const infoLinks: { label: string; to: string }[] = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  ...legalPages.map((page) => ({ label: page.label, to: legalPath(page.slug) })),
];
