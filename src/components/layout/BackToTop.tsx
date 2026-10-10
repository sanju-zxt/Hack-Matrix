import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../../lib/cn";

const SHOW_AFTER = 640;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Floating "back to top" control — appears after scrolling, sits above the mobile sticky bar. */
export function BackToTop({ hidden = false }: { hidden?: boolean }) {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.scrollY > SHOW_AFTER
  );

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const shown = visible && !hidden;

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      className={cn(
        "fixed right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-violet/40 bg-ink-850/90 text-violet-bright shadow-[0_8px_30px_-6px_rgba(124,108,255,0.5)] backdrop-blur-xl transition-opacity duration-300 hover:border-violet hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-bright motion-reduce:transition-none",
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      style={{ bottom: "calc(var(--sticky-cta-h, 0px) + 1rem)" }}
    >
      <ArrowUp size={18} strokeWidth={2.25} aria-hidden />
    </button>
  );
}