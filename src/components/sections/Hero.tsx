import { useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import {
  event,
  flags,
  registration,
  scheduleDates,
  venue,
} from "../../data/eventConfig";
import { Button, RegisterButton } from "../ui/Button";
import { Countdown } from "../ui/Countdown";
import { Logo } from "../ui/Logo";
import { StatusPill } from "../ui/StatusPill";

interface Particle {
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

function useParticles(count: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 53) % 97}%`,
        size: 2 + ((i * 7) % 3),
        duration: 12 + ((i * 13) % 9),
        delay: (i * 1.7) % 12,
        drift: 10 + ((i * 19) % 30),
      })),
    [count]
  );
}

interface StatTilesProps {
  items: { value: string; caption: string }[];
}

function StatTiles({ items }: StatTilesProps) {
  return (
    <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((s) => (
        <li
          key={s.value}
          className="glass flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-4 text-center transition-colors duration-300 hover:border-violet/40"
        >
          <span className="font-mono text-sm font-semibold tracking-wide text-violet-bright sm:text-base">
            {s.value}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/60">
            {s.caption}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const particles = useParticles(16);

  const tagline = event.tagline.split(".").filter(Boolean);
  const [durNum = "8", durUnit = "HOURS"] =
    scheduleDates.durationLabel.split(" ");

  const stats = [
    { value: `${durNum} ${durUnit.toUpperCase()}`, caption: "build from zero" },
    { value: "INTER-COLLEGIATE", caption: "open to all colleges" },
    { value: event.city.toUpperCase(), caption: "on-campus event" },
    { value: `TEAM ${registration.teamSize.max}`, caption: registration.teamSize.label },
  ];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24">
      {/* particles â€” lightweight CSS, GPU-friendly */}
      {!reduce && (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  "--duration": `${p.duration}s`,
                  "--delay": `${p.delay}s`,
                  "--drift": `${p.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        {/* Left â€” copy */}
        <motion.div
          variants={container}
          initial={reduce ? undefined : "hidden"}
          animate="show"
        >
          <motion.div variants={item} className="pb-5">
          <StatusPill />
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            {flags.showLogo && (
              <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4">
                <span className="relative">
                  <Logo size={28} ring />
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-olive shadow-[0_0_8px_rgba(198,201,95,0.9)]"
                  />
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-white/70">
                  {event.institution}
                </span>
              </span>
            )}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight"
          >
            <span className="text-gradient drop-shadow-[0_0_40px_rgba(124,108,255,0.25)]">
              HACK-MATRIX
            </span>
            <span className="mt-2 block text-white">{event.edition}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm font-semibold uppercase tracking-[0.35em] text-violet-bright sm:text-base"
          >
            {tagline.map((word) => (
              <span key={word} className="inline-flex items-center gap-3">
                {word}
                <span aria-hidden className="text-white/25">
                  /
                </span>
              </span>
            ))}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {event.heroDescription}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <RegisterButton size="lg" className="w-full sm:w-auto" />
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              VIEW DETAILS
              <ChevronRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-12">
            <StatTiles items={stats} />
          </motion.div>
        </motion.div>

        {/* Right â€” countdown */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="flex flex-col items-center lg:items-end"
        >
          <div className="relative w-full max-w-md lg:max-w-none">
            {/* rotating emblem ornaments */}
            <span
              aria-hidden
              className="spin-slow pointer-events-none absolute -inset-6 hidden rounded-[2.5rem] border border-dashed border-white/10 sm:block"
            />
            <span
              aria-hidden
              className="spin-rev pointer-events-none absolute -inset-12 hidden rounded-full border border-dotted border-violet/20 sm:block"
            />
            <span
              aria-hidden
              className="absolute -left-5 -top-5 hidden h-10 w-10 rounded-full border border-violet/30 bg-ink-900/70 md:block"
            >
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-bright shadow-[0_0_10px_rgba(154,139,255,0.9)]" />
            </span>

            <div className="glass-strong relative rounded-3xl p-7 sm:p-9">
              {/* corner brackets */}
              <span aria-hidden className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-violet-bright/60 rounded-tl" />
              <span aria-hidden className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-violet-bright/60 rounded-tr" />
              <span aria-hidden className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-leaf-light/60 rounded-bl" />
              <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-leaf-light/60 rounded-br" />

              <Countdown />
              <div className="mt-7 border-t border-white/5 pt-6">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/60">
                  {scheduleDates.dateLabel} Â· {scheduleDates.startTime} â€“ {scheduleDates.endTime} {scheduleDates.timeZone}
                </p>
                <p className="mt-2 text-sm text-white/60">{venue.name}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-white/60">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-leaf-light shadow-[0_0_8px_rgba(98,201,135,0.9)]" />
                  {scheduleDates.format} Â· {registration.fee} {registration.feePer}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to details"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/55 transition-colors hover:text-violet-bright sm:block"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  );
}