import { useLayoutEffect, useRef, useState } from "react";
import { event, flags } from "../../data/eventConfig";
import { cn } from "../../lib/cn";

const LOGO_SRC = "/vvitlogo.jpg";
/** Natural size of public/vvitlogo.jpg, so the box is reserved before decode. */
const LOGO_NATURAL_WIDTH = 675;
const LOGO_NATURAL_HEIGHT = 675;

export type LogoLoading = "eager" | "lazy";

/**
 * Defaults to lazy, then promotes instances that are already inside the
 * viewport (navbar, hero) to eager before paint. Instances that start
 * off-screen (footer) stay lazy and never enter the fetch queue.
 */
function useLogoLoading(override?: LogoLoading) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState<LogoLoading>(override ?? "lazy");

  useLayoutEffect(() => {
    if (override) {
      setLoading(override);
      return;
    }
    const img = imgRef.current;
    if (!img) return;
    if (img.getBoundingClientRect().top < window.innerHeight) setLoading("eager");
  }, [override]);

  return { imgRef, loading };
}

export function Logo({
  size = 40,
  ring = false,
  className,
  imgClassName,
  loading,
}: {
  size?: number;
  ring?: boolean;
  className?: string;
  imgClassName?: string;
  /** Defaults to "eager" above the fold and "lazy" everywhere else. */
  loading?: LogoLoading;
}) {
  const { imgRef, loading: resolvedLoading } = useLogoLoading(loading);

  if (!flags.showLogo) {
    return (
      <span
        className={cn(
          "min-w-0 break-words font-display font-bold tracking-wide text-white",
          className,
          imgClassName
        )}
      >
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
        ref={imgRef}
        src={LOGO_SRC}
        alt=""
        width={LOGO_NATURAL_WIDTH}
        height={LOGO_NATURAL_HEIGHT}
        loading={resolvedLoading}
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </span>
  );
}

export function Brand({
  withLogo = true,
  logoSize = 38,
  className,
  logoLoading,
}: {
  withLogo?: boolean;
  logoSize?: number;
  className?: string;
  logoLoading?: LogoLoading;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 sm:gap-3", className)}>
      {withLogo && <Logo size={logoSize} loading={logoLoading} />}
      <span className="flex min-w-0 flex-col">
        <span className="break-words font-display text-base font-bold leading-none tracking-wide text-white sm:text-lg">
          HACK<span className="text-violet-bright">-MATRIX</span>
        </span>
        <span className="mt-1 hidden font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/70 sm:block sm:text-[0.6rem] sm:tracking-[0.3em]">
          {event.edition} · {event.subtitle.replace(/-/g, " ")}
        </span>
      </span>
    </span>
  );
}
