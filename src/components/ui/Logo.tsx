import { event, flags } from "../../data/eventConfig";
import { cn } from "../../lib/cn";

/** VVIT logo presented in a white circular chip (the emblem's native ground). */
export function Logo({
  size = 40,
  ring = false,
  className,
  imgClassName,
}: {
  size?: number;
  ring?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  if (!flags.showLogo) {
    return (
      <span className={cn("font-display font-bold tracking-wide text-white", imgClassName)}>
        {event.name}
      </span>
    );
  }
  return (
    <span
      aria-label="Vijaya Vittala Institute of Technology logo"
      role="img"
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_20px_-4px_rgba(0,0,0,0.6)]",
        ring && "logo-ring",
        className
      )}
      style={{ width: size, height: size }}
    >
      <img
        src="/vvitlogo.jpg"
        alt=""
        loading="eager"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </span>
  );
}

/** Wordmark + optional logo chip â€” used in navbar & footer. */
export function Brand({
  withLogo = true,
  logoSize = 38,
  className,
}: {
  withLogo?: boolean;
  logoSize?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {withLogo && <Logo size={logoSize} />}
      <span className="flex flex-col">
        <span className="font-display text-lg font-bold leading-none tracking-wide text-white">
          HACK<span className="text-violet-bright">-MATRIX</span>
        </span>
        <span className="mt-1 hidden font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 sm:block">
          {event.edition} Â· {event.subtitle.replace(/-/g, " ")}
        </span>
      </span>
    </span>
  );
}