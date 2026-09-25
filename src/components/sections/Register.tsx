import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Mail,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import {
  event,
  getEventStatus,
  registration,
  scheduleDates,
  venue,
} from "../../data/eventConfig";
import { getRegistrationUrl } from "../../lib/registration";
import { Container, Section } from "../ui/Section";
import { RegisterButton } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Link } from "react-router-dom";

const registrationUrl = getRegistrationUrl();
const registrationStatus = getEventStatus();

const steps = [
  {
    icon: ClipboardList,
    title: "1 · Fill the registration form",
    desc: registrationUrl
      ? "Complete all team + member details in the official form."
      : "The official form is being finalized. Review the details below while the link is prepared.",
  },
  {
    icon: Wallet,
    title: "2 · Complete the fee payment",
    desc: registrationUrl
      ? `${registration.fee} ${registration.feePer} · instructions inside the form.`
      : `${registration.fee} ${registration.feePer} · payment instructions will be shared with the form.`,
  },
  {
    icon: Ticket,
    title: "3 · Get confirmed",
    desc: "Receive your confirmation with check-in details before event day.",
  },
];

export function Register() {
  return (
    <Section id="register" className="relative overflow-hidden">
      {/* section glow */}
      <span
        aria-hidden
        className="glow-orb animate-float-b left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 bg-violet/10"
      />

      <Container className="relative">
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
          />

          <div className="relative grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            {/* CTA copy */}
            <div>
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright">
                  <span aria-hidden className="h-px w-8 bg-violet/50" />
                  {registrationUrl
                    ? registrationStatus.label
                    : "Registration form coming soon"}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
                  Ready to ship something{" "}
                  <span className="text-gradient">extraordinary?</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">
                  {registration.fee} {registration.feePer} · teams of{" "}
                  {registration.teamSize.min}–{registration.teamSize.max}.{" "}
                  {registrationUrl
                    ? "Registering takes about 5 minutes — the form opens in a new tab."
                    : "The official form link is being finalized. Check back for registration updates."}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  <RegisterButton
                    size="lg"
                    label="REGISTER FOR HACK-MATRIX"
                    className="w-full sm:w-auto"
                  />
                  <Link
                    to="/register"
                    className="group inline-flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-normal break-words px-4 py-3 text-center text-sm font-semibold text-white/70 transition-colors hover:text-violet-bright sm:w-auto sm:px-0 sm:py-0"
                  >
                    Registration guide
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap items-start gap-x-5 gap-y-3 text-sm text-white/55 sm:gap-x-7">
                  <span className="inline-flex min-w-0 max-w-full items-start gap-2 break-words">
                    <CalendarDays size={15} className="text-violet-bright" />
                    Deadline: {registration.deadlineLabel}
                  </span>
                  <span className="inline-flex min-w-0 max-w-full items-start gap-2 break-words">
                    <Users size={15} className="text-violet-bright" />
                    {registration.teamSize.label}
                  </span>
                  <span className="inline-flex min-w-0 max-w-full items-start gap-2 break-words">
                    <Mail size={15} className="text-violet-bright" />
                    Questions? Email the organizing team
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Step panel */}
            <Reveal delay={0.15} y={28}>
              <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5 sm:p-8">
                <h3 className="font-display text-lg font-semibold text-white">
                  How registration works
                </h3>
                <ol className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
                  {steps.map((step) => (
                    <li key={step.title} className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet/30 bg-violet/10 text-violet-bright">
                        <step.icon size={19} strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-white">{step.title}</p>
                        <p className="mt-0.5 break-words text-sm leading-relaxed text-white/55">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:mt-8">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                    Event snapshot
                  </p>
                  <p className="mt-2 text-sm text-white/65">
                    {event.name} {event.edition} · {scheduleDates.dateLabel} ·{" "}
                    {scheduleDates.startTime}–{scheduleDates.endTime}{" "}
                    {scheduleDates.timeZone}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{venue.name}</p>
                  <p className="mt-1 text-sm text-white/60">
                    {scheduleDates.format} · {registration.fee} {registration.feePer}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}