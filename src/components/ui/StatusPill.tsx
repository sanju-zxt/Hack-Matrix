import { useEffect, useState } from "react";
import { getEventStatus, type EventStatus } from "../../data/eventConfig";
import { cn } from "../../lib/cn";

const dotColor: Record<EventStatus["kind"], string> = {
  soon: "bg-white/80",
  open: "bg-leaf-light",
  live: "bg-violet-bright",
  ended: "bg-white/60",
};

const labelColor: Record<EventStatus["kind"], string> = {
  soon: "text-white/85",
  open: "text-leaf-light",
  live: "text-violet-bright",
  ended: "text-white/75",
};

export function StatusPill() {
  const [status, setStatus] = useState<EventStatus>(() => getEventStatus());

  useEffect(() => {
    let interval: number | undefined;
    const stop = () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };
    const update = () => setStatus(getEventStatus());
    const start = () => {
      stop();
      if (document.visibilityState === "hidden") return;
      update();
      interval = window.setInterval(update, 60_000);
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
  }, []);

  const dot = dotColor[status.kind];
  const label = labelColor[status.kind];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Event status: ${status.label}${status.detail ? ` — ${status.detail}` : ""}`}
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-ink-900/80 px-3 py-1.5 backdrop-blur-sm sm:px-3.5 sm:py-1 sm:backdrop-blur"
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 motion-reduce:animate-none", dot)} />
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dot)} />
      </span>
      <span className={cn("min-w-0 break-words font-mono text-[0.6rem] font-medium uppercase leading-tight tracking-[0.16em] [overflow-wrap:anywhere] sm:text-[0.65rem] sm:tracking-[0.25em]", label)}>
        {status.label}
      </span>
    </div>
  );
}
