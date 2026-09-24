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
  registration,
  scheduleDates,
  venue,
} from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { RegisterButton } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: ClipboardList,
    title: "1 Â· Fill the registration form",
    desc: "Complete all team + member details in the official form.",
  },
  {
    icon: Wallet,
    title: "2 Â· Complete the fee payment",
    desc: `${registration.fee} ${registration.feePer} Â· instructions inside the form.`,
  },
  {
    icon: Ticket,
    title: "3 Â· Get confirmed",
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
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
          />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            {/* CTA copy */}
            <div>
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright">
                  <span aria-hidden className="h-px w-8 bg-violet/50" />
                  Registration open
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
                  {registration.fee} {registration.feePer} Â· teams of{" "}
                  {registration.teamSize.min}â€“
                  {registration.teamSize.max}. Registering takes about 5 minutes
                  â€” the form opens in a new tab.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <RegisterButton size="lg" label="REGISTER FOR HACK-MATRIX" />
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-violet-bright"
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
                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/55">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={15} className="text-violet-bright" />
                    Deadline: {registration.deadlineLabel}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users size={15} className="text-violet-bright" />
                    {registration.teamSize.label}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Mail size={15} className="text-violet-bright" />
                    Questions? Email the organizing team
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Step panel */}
            <Reveal delay={0.15} y={28}>
              <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
                <h3 className="font-display text-lg font-semibold text-white">
                  How registration works
                </h3>
                <ol className="mt-6 space-y-6">
                  {steps.map((step) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet/30 bg-violet/10 text-violet-bright">
                        <step.icon size={19} strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="font-semibold text-white">{step.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-white/55">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                    Event snapshot
                  </p>
                  <p className="mt-2 text-sm text-white/65">
                    {event.name} {event.edition} Â· {scheduleDates.dateLabel} Â·{" "}
                    {scheduleDates.startTime}â€“{scheduleDates.endTime}{" "}
                    {scheduleDates.timeZone}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{venue.name}</p>
                  <p className="mt-1 text-sm text-white/60">
                    {scheduleDates.format} Â· {registration.fee} {registration.feePer}
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