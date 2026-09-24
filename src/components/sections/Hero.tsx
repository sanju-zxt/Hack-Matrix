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
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/45">
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
      {/* particles — lightweight CSS, GPU-friendly */}
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
        {/* Left — copy */}
        <motion.div
          variants={container}
          initial={reduce ? undefined : "hidden"}
          animate="show"
        >
          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            {flags.showLogo && (
              <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4">
                <Logo size={28} />
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

        {/* Right — countdown */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="flex flex-col items-center lg:items-end"
        >
          <div className="glass-strong w-full max-w-md rounded-3xl p-7 sm:p-9 lg:max-w-none">
            <Countdown />
            <div className="mt-7 border-t border-white/5 pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                {scheduleDates.dateLabel} · {scheduleDates.startTime} – {scheduleDates.endTime} {scheduleDates.timeZone}
              </p>
              <p className="mt-2 text-sm text-white/60">{venue.name}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/45">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {scheduleDates.format} · {registration.fee} {registration.feePer}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to details"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/35 transition-colors hover:text-violet-bright sm:block"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  );
}