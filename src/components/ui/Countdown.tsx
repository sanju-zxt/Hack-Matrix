import { useEffect, useState } from "react";
import { countdown } from "../../data/eventConfig";
import { cn } from "../../lib/cn";
import { Reveal } from "./Reveal";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  over: boolean;
}

function emptyTime(): TimeLeft {
  return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
}

function calc(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) {
    return emptyTime();
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
    over: false,
  };
}

function Cell({
  value,
  label,
  compact = false,
  separator = false,
}: {
  value: number;
  label: string;
  compact?: boolean;
  separator?: boolean;
}) {
  const padded = String(value).padStart(2, "0");

  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative mx-auto w-full",
          compact ? "max-w-[4.5rem]" : "max-w-24"
        )}
      >
        <div
          className={cn(
            "glass relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl",
            compact ? "" : "sm:rounded-2xl"
          )}
        >
          <span
            className={cn(
              "relative z-10 font-mono font-semibold tabular-nums leading-none text-white",
              compact
                ? "text-[clamp(0.75rem,4vw,1.125rem)]"
                : "text-[clamp(0.75rem,5vw,2.25rem)]"
            )}
          >
            {padded}
          </span>
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        </div>
        {separator && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-full top-1/2 hidden -translate-x-1/2 -translate-y-1/2 font-mono text-2xl leading-none text-white/25 sm:block sm:text-3xl"
          >
            :
          </span>
        )}
      </div>
      <span
        className={cn(
          "max-w-full break-words text-center font-mono uppercase leading-tight tracking-[0.12em] text-white/70 [overflow-wrap:anywhere]",
          compact
            ? "text-[0.58rem]"
            : "text-[0.58rem] sm:text-[0.65rem] sm:tracking-[0.18em]"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function LivePulse({ label }: { label: string }) {
  return (
    <div className="glass inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center sm:gap-3 sm:px-6 sm:py-3">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-bright opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-bright" />
      </span>
      <span className="min-w-0 break-words font-mono text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-violet-bright [overflow-wrap:anywhere] sm:text-sm sm:tracking-[0.25em]">
        {label}
      </span>
    </div>
  );
}

function TimeGrid({ left, compact = false }: { left: TimeLeft; compact?: boolean }) {
  const units = [
    { value: left.days, label: "days" },
    { value: left.hours, label: "hours" },
    { value: left.minutes, label: "minutes" },
    { value: left.seconds, label: "seconds" },
  ];

  return (
    <div
      className={cn(
        "grid w-full grid-cols-4 items-start",
        compact ? "mt-4 gap-1.5" : "mt-5 gap-2 sm:mt-6 sm:gap-5"
      )}
    >
      {units.map((unit, index) => (
        <div key={unit.label} className="min-w-0">
          <Cell
            {...unit}
            compact={compact}
            separator={!compact && index < units.length - 1}
          />
        </div>
      ))}
    </div>
  );
}

function useCountdown(target: number) {
  const [left, setLeft] = useState<TimeLeft>(() =>
    Number.isNaN(target) ? emptyTime() : calc(target)
  );

  useEffect(() => {
    if (Number.isNaN(target)) return;

    let interval: number | undefined;
    const stop = () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };
    const update = () => {
      const next = calc(target);
      setLeft(next);
      if (next.over) stop();
    };
    const start = () => {
      stop();
      if (document.visibilityState === "hidden") {
        setLeft(calc(target));
        return;
      }
      const next = calc(target);
      setLeft(next);
      if (!next.over) {
        interval = window.setInterval(update, 1_000);
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stop();
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [target]);

  return left;
}

export function Countdown({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  const target = countdown.enabled ? Date.parse(countdown.targetISO) : NaN;
  const left = useCountdown(target);
  const compact = size === "sm";

  if (!countdown.enabled || Number.isNaN(target)) {
    return (
      <div className={className}>
        <p className="font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.2em] text-white/75 sm:text-xs sm:tracking-[0.3em]">
          {countdown.label}
        </p>
        <div className="mt-4">
          <LivePulse label="Date to be confirmed" />
        </div>
        {countdown.note && (
          <p className="mt-4 break-words text-sm leading-relaxed text-white/65">
            {countdown.note}
          </p>
        )}
      </div>
    );
  }

  if (left.over) {
    return (
      <div className={className}>
        <p className="font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.2em] text-white/75 sm:text-xs sm:tracking-[0.3em]">
          {countdown.label}
        </p>
        <div className="mt-4">
          <LivePulse label="Event is live" />
        </div>
        {countdown.note && (
          <p className="mt-4 break-words text-sm leading-relaxed text-white/65">
            {countdown.note}
          </p>
        )}
      </div>
    );
  }

  const timerLabel = `${left.days} days, ${left.hours} hours, ${left.minutes} minutes, ${left.seconds} seconds`;

  return (
    <div className={className}>
      <p
        className={cn(
          "font-mono uppercase leading-relaxed text-white/75",
          compact
            ? "text-[0.6rem] tracking-[0.18em]"
            : "text-[0.65rem] tracking-[0.2em] sm:text-xs sm:tracking-[0.3em]"
        )}
      >
        {countdown.label}
      </p>

      <div role="timer" aria-label={timerLabel} aria-atomic="true">
        {compact ? (
          <TimeGrid left={left} compact />
        ) : (
          <Reveal delay={0.3} y={16} className="w-full">
            <TimeGrid left={left} />
          </Reveal>
        )}
      </div>

      {countdown.note && (
        <p
          className={cn(
            "max-w-lg break-words leading-relaxed text-white/65",
            compact ? "mt-4 text-xs" : "mt-5 text-sm"
          )}
        >
          {countdown.note}
        </p>
      )}
    </div>
  );
}
