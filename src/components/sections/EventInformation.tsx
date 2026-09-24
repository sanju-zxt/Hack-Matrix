import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Timer,
  Users,
  Wallet,
  Radio,
} from "lucide-react";
import {
  registration,
  scheduleDates,
  venue,
} from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const isTba = (value: string) =>
  /\bto be announced\b|\bto be confirmed\b|^\[|\[.*\]/i.test(value);

interface InfoCard {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tba?: boolean;
}

const cards: InfoCard[] = [
  {
    label: "Date",
    value: scheduleDates.dateLabel,
    sub: "Mark your calendars",
    icon: CalendarDays,
  },
  {
    label: "Time",
    value: `${scheduleDates.startTime} â€“ ${scheduleDates.endTime}`,
    sub: `${scheduleDates.timeZone} timezone`,
    icon: Clock,
  },
  {
    label: "Venue",
    value: venue.name,
    sub: venue.addressLine1,
    icon: MapPin,
  },
  {
    label: "Duration",
    value: scheduleDates.durationLabel,
    sub: "of pure build time",
    icon: Timer,
  },
  {
    label: "Format",
    value: scheduleDates.format,
    sub: "on-campus Â· hybrid slots",
    icon: Radio,
  },
  {
    label: "Team Size",
    value: registration.teamSize.label,
    sub: "leader + members",
    icon: Users,
  },
  {
    label: "Registration Fee",
    value: `${registration.fee} ${registration.feePer}`,
    sub: "payable via registration form",
    icon: Wallet,
  },
];

export function EventInformation() {
  return (
    <Section id="event-info" className="bg-ink-900/30">
      <Container>
        <SectionHeading
          eyebrow="Event Overview"
          title="Everything you need to know"
          description="The essential details at a glance â€” all controlled from the central configuration."
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <li key={card.label}>
              <Reveal delay={(i % 3) * 0.08} y={20}>
                <div className="glass card-sheen group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40">
                  <span aria-hidden className="hairline absolute inset-x-6 top-0 h-px opacity-60" />
                  <span
                    aria-hidden
                    className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet/5 blur-2xl transition-all duration-500 group-hover:bg-violet/15"
                  />
                  <card.icon
                    size={20}
                    strokeWidth={1.75}
                    className={
                      card.label === "Venue"
                        ? "text-leaf-light"
                        : "text-violet-bright"
                    }
                  />
                  <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
                    {card.label}
                  </p>
                  <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-white">
                    {card.value}
                  </p>
                  {card.sub && (
                    <p className="mt-1 text-sm text-white/60">{card.sub}</p>
                  )}
                  {card.tba && isTba(card.value) && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-amber-300">
                      To be announced â€” configurable
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}