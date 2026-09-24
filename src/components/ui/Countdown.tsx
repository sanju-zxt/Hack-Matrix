import { useEffect, useMemo, useState } from "react";
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

function calc(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    over: false,
  };
}

function Cell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="glass relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl sm:h-24 sm:w-24 sm:rounded-2xl">
        <span className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-4xl">
          {padded}
        </span>
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
      </div>
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/50 sm:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}

function LivePulse({ label }: { label: string }) {
  return (
    <div className="glass inline-flex items-center gap-3 rounded-full px-6 py-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-bright opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-bright" />
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-violet-bright">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ className, size = "lg" }: { className?: string; size?: "sm" | "lg" }) {
  const target = useMemo(
    () => (countdown.enabled ? Date.parse(countdown.targetISO) : NaN),
    []
  );
  const [left, setLeft] = useState<TimeLeft>(() => calc(target));

  useEffect(() => {
    if (!countdown.enabled || Number.isNaN(target)) return;
    const id = setInterval(() => setLeft(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!countdown.enabled || Number.isNaN(target)) {
    return (
      <div className={className}>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          {countdown.label}
        </p>
        <div className="mt-4">
          <LivePulse label="Date to be confirmed" />
        </div>
        {countdown.note && (
          <p className="mt-4 text-sm text-white/40">{countdown.note}</p>
        )}
      </div>
    );
  }

  if (left.over) {
    return (
      <div className={className}>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          {countdown.label}
        </p>
        <div className="mt-4">
          <LivePulse label="Event is live" />
        </div>
        {countdown.note && (
          <p className="mt-4 text-sm text-white/40">{countdown.note}</p>
        )}
      </div>
    );
  }

  const small = size === "sm";

  return (
    <div className={className}>
      <p
        className={cn(
          "font-mono uppercase tracking-[0.3em] text-white/50",
          small ? "text-[0.65rem]" : "text-xs"
        )}
      >
        {countdown.label}
      </p>

      {small ? (
        <div className="mt-4 flex items-center gap-3">
          {(
            [
              [left.days, "days"],
              [left.hours, "hrs"],
              [left.minutes, "min"],
              [left.seconds, "sec"],
            ] as const
          ).map(([v, l]) => (
            <div
              key={l}
              className="glass flex min-w-[3.5rem] flex-col items-center rounded-xl px-3 py-2"
            >
              <span className="font-mono text-xl font-semibold tabular-nums text-white">
                {String(v).padStart(2, "0")}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-white/50">
                {l}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <Reveal delay={0.3} y={16}>
          <div className="mt-6 flex items-center gap-3 sm:gap-5">
            <Cell value={left.days} label="days" />
            <span aria-hidden className="font-mono text-2xl text-white/25 sm:text-3xl">
              :
            </span>
            <Cell value={left.hours} label="hours" />
            <span aria-hidden className="font-mono text-2xl text-white/25 sm:text-3xl">
              :
            </span>
            <Cell value={left.minutes} label="minutes" />
            <span aria-hidden className="font-mono text-2xl text-white/25 sm:text-3xl">
              :
            </span>
            <Cell value={left.seconds} label="seconds" />
          </div>
        </Reveal>
      )}

      {countdown.note && (
        <p className={cn("mt-5 max-w-lg text-white/40", small ? "text-xs" : "text-sm")}>
          {countdown.note}
        </p>
      )}
    </div>
  );
}