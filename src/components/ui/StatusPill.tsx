import { useEffect, useState } from "react";
import { getEventStatus, type EventStatus } from "../../data/eventConfig";
import { cn } from "../../lib/cn";

const dotColor: Record<EventStatus["kind"], string> = {
  soon: "bg-white/70",
  open: "bg-leaf-light",
  live: "bg-violet-bright",
  ended: "bg-white/40",
};

const labelColor: Record<EventStatus["kind"], string> = {
  soon: "text-white/70",
  open: "text-leaf-light",
  live: "text-violet-bright",
  ended: "text-white/40",
};

export function StatusPill() {
  const [status, setStatus] = useState<EventStatus>(() => getEventStatus());

  useEffect(() => {
    const id = setInterval(() => setStatus(getEventStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dot = dotColor[status.kind];
  const label = labelColor[status.kind];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Event status: ${status.label}${status.detail ? ` — ${status.detail}` : ""}`}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 px-3 py-1 backdrop-blur"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-70", dot)} />
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dot)} />
      </span>
      <span className={cn("font-mono text-[0.65rem] uppercase tracking-[0.25em]", label)}>
        {status.label}
      </span>
    </div>
  );
}