import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { registration } from "../../data/eventConfig";
import { cn } from "../../lib/cn";

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): TimeParts {
  const d = target - Date.now();
  if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor((d / 3_600_000) % 24),
    minutes: Math.floor((d / 60_000) % 60),
    seconds: Math.floor((d / 1_000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown to the registration deadline. Renders nothing once it has passed (or is unset). */
export function DeadlineCountdown({
  className,
  label = "Registrations close in",
}: {
  className?: string;
  label?: string;
}) {
  const target = registration.closes ? Date.parse(registration.closes) : NaN;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const id = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(id);
  }, [target]);

  if (Number.isNaN(target) || target - now <= 0) return null;

  const { days, hours, minutes, seconds } = diff(target);

  return (
    <span
      className={cn(
        "glass inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-4 py-2.5",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-violet-bright">
        <CalendarClock size={14} className="shrink-0" />
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-white">
        {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    </span>
  );
}
