import { event, scheduleDates } from "../../data/eventConfig";

const words = [
  event.tagline.split(".").filter(Boolean),
  `${scheduleDates.durationLabel.toUpperCase()} SPRINT`,
  `${event.name} ${event.edition}`,
  `${event.institution.toUpperCase()} ${event.city.toUpperCase()}`,
].flat();

/** Decorative marquee strip â€” visual texture, hidden from screen readers. */
export function Ticker() {
  const group = (
    <span className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center gap-8 px-4">
          <span className="whitespace-nowrap">{word}</span>
          <span aria-hidden className="text-leaf-light/80">
            â—†
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <section aria-hidden className="relative overflow-hidden border-y border-white/5 bg-ink-900/40 py-4">
      <p className="sr-only">
        {event.name} {event.edition} â€” {event.tagline}. {scheduleDates.durationLabel},
        {event.city}.
      </p>
      <div className="marquee-track text-sm font-mono uppercase tracking-[0.3em] text-white/60">
        {group}
        {group}
      </div>
    </section>
  );
}