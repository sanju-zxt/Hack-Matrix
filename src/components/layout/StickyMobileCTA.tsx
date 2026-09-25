import { useLayoutEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { flags } from "../../data/eventConfig";
import { RegisterButton } from "../ui/Button";

/** Sticky bottom "REGISTER NOW" bar — mobile only (hidden at lg+). */
export function StickyMobileCTA({ hidden = false }: { hidden?: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!flags.stickyMobileCta) return;
    document.body.classList.add("has-sticky-cta");
    return () => document.body.classList.remove("has-sticky-cta");
  }, []);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const publish = () =>
      root.style.setProperty("--sticky-cta-h", `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    publish();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--sticky-cta-h");
    };
  }, []);

  if (!flags.stickyMobileCta) return null;

  return (
    <div
      ref={barRef}
      inert={hidden}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 motion-reduce:transition-none lg:hidden",
        hidden && "pointer-events-none translate-y-full"
      )}
    >
      <div className="border-x-0 border-b-0 border-t border-white/10 bg-ink-950/95">
        <div className="safe-bottom shell-x flex items-center gap-3 pt-3">
          <p className="hidden shrink-0 items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/60 min-[400px]:inline-flex">
            <Sparkles size={12} className="text-violet-bright" />
            Seats limited
          </p>
          <RegisterButton size="md" label="REGISTER NOW" className="flex-1" />
        </div>
      </div>
    </div>
  );
}
