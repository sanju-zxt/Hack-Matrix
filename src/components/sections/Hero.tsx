import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import {
  event,
  flags,
  registration,
  scheduleDates,
  venue,
} from "../../data/eventConfig";
import { cn } from "../../lib/cn";
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

function useShortLandscape() {
  const [shortLandscape, setShortLandscape] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia(
      "(max-height: 600px) and (min-width: 560px)"
    );
    const update = () => setShortLandscape(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return shortLandscape;
}

function getParticleCount() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return 0;
  }

  const short = window.matchMedia("(max-height: 600px)");
  const narrow = window.matchMedia("(max-width: 639px)");

  if (short.matches) return 3;
  if (narrow.matches) return 8;
  return 16;
}

function subscribeToViewport(onStoreChange: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => undefined;
  }

  const short = window.matchMedia("(max-height: 600px)");
  const narrow = window.matchMedia("(max-width: 639px)");
  short.addEventListener("change", onStoreChange);
  narrow.addEventListener("change", onStoreChange);

  return () => {
    short.removeEventListener("change", onStoreChange);
    narrow.removeEventListener("change", onStoreChange);
  };
}

function getServerParticleCount() {
  return 0;
}

function useParticleCount(reduce: boolean | null) {
  const count = useSyncExternalStore(
    subscribeToViewport,
    getParticleCount,
    getServerParticleCount
  );

  return reduce ? 0 : count;
}

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
    <ul className="grid w-full grid-cols-2 gap-2 min-[360px]:gap-3 lg:grid-cols-4">
      {items.map((s) => (
        <li
          key={s.value}
          className="glass flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center transition-colors duration-300 hover:border-violet/40 min-[360px]:px-4 min-[360px]:py-4 sm:px-4 sm:py-4"
        >
          <span className="min-w-0 font-mono text-xs font-semibold leading-tight tracking-wide text-violet-bright [overflow-wrap:anywhere] min-[360px]:text-sm sm:text-base">
            {s.value}
          </span>
          <span className="min-w-0 text-center font-mono text-[0.5rem] uppercase leading-tight tracking-[0.12em] text-white/70 [overflow-wrap:anywhere] min-[360px]:text-[0.6rem] min-[360px]:tracking-[0.2em] md:text-[0.65rem]">
            {s.caption}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const shortLandscape = useShortLandscape();
  const particleCount = useParticleCount(reduce);
  const particles = useParticles(particleCount);

  const tagline = event.tagline
    .split(".")
    .map((word) => word.trim())
    .filter(Boolean);
  const [durNum = "8", durUnit = "HOURS"] =
    scheduleDates.durationLabel.split(" ");

  const stats = [
    { value: `${durNum} ${durUnit.toUpperCase()}`, caption: "build from zero" },
    { value: "INTER-COLLEGIATE", caption: "open to all colleges" },
    { value: event.city.toUpperCase(), caption: "on-campus event" },
    { value: `TEAM ${registration.teamSize.max}`, caption: registration.teamSize.label },
  ];

  const scrollToDetails = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      className={cn(
        "relative flex min-h-screen min-h-svh supports-[height:100dvh]:min-h-[100dvh] items-center overflow-hidden pb-[max(1rem,calc(var(--sticky-cta-h,0px)_+_1rem))] pt-[max(5rem,calc(var(--nav-h-safe,4rem)_+_1rem))] sm:pt-32 lg:pb-24"
      )}
    >
      {!reduce && particleCount > 0 && (
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

      <div
        className="shell-x relative grid w-full grid-cols-1 items-center gap-10 sm:gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-8 lg:gap-10"
        style={
          shortLandscape
            ? { gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: "1.5rem" }
            : undefined
        }
      >
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="min-w-0"
        >
          <motion.div
            variants={item}
            className={shortLandscape ? "pb-2" : "pb-5"}
          >
            <StatusPill />
          </motion.div>

          <motion.div
            variants={item}
            className="flex min-w-0 max-w-full flex-wrap items-center gap-3 sm:gap-4"
          >
            {flags.showLogo && (
              <span className="glass inline-flex min-w-0 max-w-full items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 sm:pr-4">
                <span className="relative shrink-0">
                  <Logo size={28} ring />
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-olive shadow-[0_0_8px_rgba(198,201,95,0.9)]"
                  />
                </span>
                <span className="min-w-0 break-words font-mono text-[0.6rem] uppercase leading-tight tracking-[0.16em] text-white/80 sm:text-[0.7rem] sm:tracking-[0.25em]">
                  {event.institution}
                </span>
              </span>
            )}
          </motion.div>

          <motion.h1
            variants={item}
            className={cn(
              "max-w-full break-words font-display font-bold tracking-tight [overflow-wrap:anywhere]",
              shortLandscape
                ? "mt-3 text-[clamp(1.5rem,6vw,3rem)] leading-[0.92]"
                : "mt-5 text-[clamp(1.5rem,10vw,5.5rem)] leading-[0.95] sm:mt-7 sm:text-[clamp(2rem,8vw,5.5rem)]"
            )}
          >
            <span className="text-gradient drop-shadow-[0_0_40px_rgba(124,108,255,0.25)]">
              HACK-MATRIX
            </span>
            <span
              className={cn(
                "block text-white",
                shortLandscape ? "mt-0.5" : "mt-1 sm:mt-2"
              )}
            >
              {event.edition}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className={cn(
              "flex flex-wrap items-center gap-x-2 gap-y-1 break-words font-mono font-semibold uppercase leading-relaxed text-violet-bright",
              shortLandscape
                ? "mt-2 text-[0.6rem] tracking-[0.14em]"
                : "mt-4 text-xs tracking-[0.18em] sm:mt-6 sm:text-base sm:tracking-[0.3em]"
            )}
          >
            {tagline.map((word, index) => (
              <span key={word} className="inline-flex items-center gap-2 sm:gap-3">
                {word}
                {index < tagline.length - 1 && (
                  <span aria-hidden className="text-white/30">
                    /
                  </span>
                )}
              </span>
            ))}
          </motion.p>

          <motion.p
            variants={item}
            className={cn(
              "max-w-xl break-words text-white/75",
              shortLandscape
                ? "mt-2 text-xs leading-relaxed"
                : "mt-4 text-sm leading-relaxed sm:mt-6 sm:text-lg"
            )}
          >
            {event.heroDescription}
          </motion.p>

          <motion.div
            variants={item}
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
              shortLandscape ? "mt-3 gap-2" : "mt-6 sm:mt-9"
            )}
          >
            <RegisterButton
              size={shortLandscape ? "md" : "lg"}
              className="w-full sm:w-auto"
            />
            <Button
              size={shortLandscape ? "md" : "lg"}
              variant="outline"
              className="w-full sm:w-auto"
              onClick={scrollToDetails}
            >
              VIEW DETAILS
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
              />
            </Button>
          </motion.div>

          <motion.div variants={item} className={shortLandscape ? "mt-4" : "mt-8 sm:mt-12"}>
            <StatTiles items={stats} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className={cn(
            "flex w-full min-w-0 flex-col items-center",
            shortLandscape ? "items-start" : "lg:items-end"
          )}
        >
          <div className="relative w-full max-w-md min-w-0">
            {!shortLandscape && (
              <>
                <span
                  aria-hidden
                  className="spin-slow pointer-events-none absolute -inset-6 hidden rounded-[2.5rem] border border-dashed border-white/10 md:block"
                />
                <span
                  aria-hidden
                  className="spin-rev pointer-events-none absolute -inset-12 hidden rounded-full border border-dotted border-violet/20 md:block"
                />
                <span
                  aria-hidden
                  className="absolute -left-5 -top-5 hidden h-10 w-10 rounded-full border border-violet/30 bg-ink-900/70 md:block"
                >
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-bright shadow-[0_0_10px_rgba(154,139,255,0.9)]" />
                </span>
              </>
            )}

            <div className="glass-strong relative rounded-3xl p-4 backdrop-blur-md sm:p-7 sm:backdrop-blur-2xl md:p-8 lg:p-9">
              {!shortLandscape && (
                <>
                  <span
                    aria-hidden
                    className="absolute left-3 top-3 h-4 w-4 rounded-tl border-l-2 border-t-2 border-violet-bright/60"
                  />
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 h-4 w-4 rounded-tr border-r-2 border-t-2 border-violet-bright/60"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-3 left-3 h-4 w-4 rounded-bl border-b-2 border-l-2 border-leaf-light/60"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-3 right-3 h-4 w-4 rounded-br border-b-2 border-r-2 border-leaf-light/60"
                  />
                </>
              )}

              <Countdown size={shortLandscape ? "sm" : "lg"} />
              <div className="mt-5 border-t border-white/5 pt-4 sm:mt-7 sm:pt-6">
                <p className="break-words font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.14em] text-white/75 sm:text-xs sm:tracking-[0.25em]">
                  {scheduleDates.dateLabel} · {scheduleDates.startTime} – {scheduleDates.endTime} {scheduleDates.timeZone}
                </p>
                <p className="mt-2 break-words text-xs text-white/70 sm:text-sm">{venue.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70 sm:text-sm">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-light shadow-[0_0_8px_rgba(98,201,135,0.9)]" />
                  {scheduleDates.format} · {registration.fee} {registration.feePer}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {!shortLandscape && (
        <motion.a
          href="#about"
          aria-label="Scroll to details"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/60 transition-colors hover:text-violet-bright md:block"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <ArrowDown size={22} />
        </motion.a>
      )}
    </section>
  );
}
