import { event, scheduleDates } from "../../data/eventConfig";

const words = [
  event.tagline
    .split(".")
    .map((word) => word.trim())
    .filter(Boolean),
  `${scheduleDates.durationLabel.toUpperCase()} SPRINT`,
  `${event.name} ${event.edition}`,
  `${event.institution.toUpperCase()} ${event.city.toUpperCase()}`,
].flat();

function TickerGroup() {
  return (
    <span className="flex shrink-0 items-center">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="flex items-center gap-6 px-3 sm:gap-8 sm:px-4"
        >
          <span className="whitespace-nowrap">{word}</span>
          <span aria-hidden className="text-leaf-light/80">
            ×
          </span>
        </span>
      ))}
    </span>
  );
}

export function Ticker() {
  return (
    <section
      aria-label="Event highlights"
      className="relative overflow-hidden border-y border-white/5 bg-ink-900/40 py-4"
    >
      <p className="sr-only">
        {event.name} {event.edition} — {event.tagline}. {scheduleDates.durationLabel}, {event.city}.
      </p>
      <div
        aria-hidden="true"
        className="marquee-track text-xs font-mono uppercase tracking-[0.2em] text-white/70 sm:text-sm sm:tracking-[0.3em]"
      >
        <TickerGroup />
        <TickerGroup />
      </div>
    </section>
  );
}
