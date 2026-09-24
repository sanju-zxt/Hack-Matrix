import type { ElementType } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Check,
  Hourglass,
  Radio,
  Users,
  Wallet,
} from "lucide-react";
import {
  contact,
  event,
  registration,
  scheduleDates,
  venue,
} from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { RegisterButton } from "../components/ui/Button";
import { AddToCalendarButton } from "../components/ui/AddToCalendarButton";
import { Reveal } from "../components/ui/Reveal";

interface DetailRow {
  icon: ElementType;
  label: string;
  value: string;
}

const details: DetailRow[] = [
  {
    icon: Wallet,
    label: "Fee",
    value: `${registration.fee} ${registration.feePer}`,
  },
  { icon: Users, label: "Team size", value: registration.teamSize.label },
  { icon: Radio, label: "Format", value: scheduleDates.format },
  { icon: CalendarDays, label: "Date", value: scheduleDates.dateLabel },
  { icon: Hourglass, label: "Register by", value: registration.deadlineLabel },
];

const regSteps = [
  {
    n: "01",
    title: "Fill the form",
    desc: "Complete all team and member details in the official registration form.",
  },
  {
    n: "02",
    title: "Pay the fee",
    desc: `${registration.fee} ${registration.feePer} â€” payment instructions are inside the form.`,
  },
  {
    n: "03",
    title: "Get confirmed",
    desc: "Receive your confirmation with check-in details before event day.",
  },
];

function isTba(value: string) {
  return /to be announced|to be confirmed/i.test(value);
}

export default function RegisterPage() {
  usePageMeta({
    title: "Register",
    description:
      "Register for HACK-MATRIX 2026 â€” the 8-hour inter-collegiate hackathon at VVIT, Bengaluru.",
    canonicalPath: "/register",
  });

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32">
      <Container className="relative">
        <Reveal>
          <p className="mb-3 text-center font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm">
            Registration
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-center font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            REGISTER FOR HACK-MATRIX{" "}
            <span className="text-gradient">{event.edition}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/60 sm:text-lg">
            {event.heroDescription}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-strong relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl p-8 text-center sm:p-10">
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]"
            />
            <div className="relative">
              <RegisterButton size="lg" label="REGISTER FOR HACK-MATRIX" />
              <p className="mt-4 text-sm text-white/60">
                Opens the official registration form in a new tab.
              </p>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                  Mark the date
                </p>
                <AddToCalendarButton />
                <p className="mt-3 text-xs text-white/50">
                  Downloads an .ics file you can open in Google, Apple or Outlook
                  Calendar.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="glass h-full rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                Registration details
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                Key details
              </h2>
              <ul className="mt-6 space-y-4">
                {details.map((detail) => (
                  <li
                    key={detail.label}
                    className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="flex items-center gap-3 text-sm text-white/70">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet/20 bg-violet/10 text-violet-bright">
                        <detail.icon size={16} strokeWidth={1.75} />
                      </span>
                      {detail.label}
                    </span>
                    <span className="flex items-center gap-2 text-right text-sm font-medium text-white">
                      {detail.value}
                      {isTba(detail.value) && (
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-amber-300">
                          TBA
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass h-full rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                Preparation
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                What to prepare
              </h2>
              <ul className="mt-6 space-y-3">
                {registration.whatToPrepare.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-violet/30 bg-violet/10 text-violet-bright">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <span className="text-sm leading-relaxed text-white/70">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <Reveal>
            <h2 className="text-center font-display text-2xl font-semibold text-white sm:text-3xl">
              How registration works
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-white/55 sm:text-base">
              Three quick steps from sign-up to a confirmed slot.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {regSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.07}>
                <div className="glass h-full rounded-2xl p-6">
                  <p className="font-mono text-xs font-semibold text-violet-bright">
                    {step.n}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.05}>
          <div className="glass mx-auto mt-14 max-w-2xl rounded-2xl p-6 sm:p-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
              Event snapshot
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              {event.name} {event.edition} Â· {scheduleDates.dateLabel} Â·{" "}
              {scheduleDates.startTime}â€“{scheduleDates.endTime}{" "}
              {scheduleDates.timeZone}
            </p>
            <p className="mt-1.5 text-sm text-white/55">{venue.name}</p>
            <p className="mt-1.5 text-sm text-white/55">
              {scheduleDates.format} Â· {registration.fee} {registration.feePer}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 text-center">
            <RegisterButton size="lg" label="REGISTER FOR HACK-MATRIX" />
            <p className="mt-4 text-sm text-white/60">
              Opens the official registration form in a new tab.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center text-sm text-white/55">
            <p>
              Have questions? Read the{" "}
              <Link
                to="/faq"
                className="font-semibold text-violet-bright underline-offset-4 transition-colors hover:underline"
              >
                FAQ page
              </Link>
              , check the{" "}
              <Link
                to="/rules"
                className="font-semibold text-violet-bright underline-offset-4 transition-colors hover:underline"
              >
                rules
              </Link>
              , or contact the organizing team at{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-semibold text-violet-bright underline-offset-4 transition-colors hover:underline"
              >
                {contact.email}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}