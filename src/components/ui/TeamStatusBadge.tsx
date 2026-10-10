import { cn } from "../../lib/cn";
import { STATUS_STYLES, type Decision } from "../../lib/teamStatus";

export function TeamStatusBadge({ status, className }: { status: Decision; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-widest",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  );
}
