import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { flags } from "../../data/eventConfig";
import { RegisterButton } from "../ui/Button";

/** Sticky bottom "REGISTER NOW" bar — mobile only (hidden at lg+). */
export function StickyMobileCTA() {
  useEffect(() => {
    if (!flags.stickyMobileCta) return;
    document.body.classList.add("has-sticky-cta");
    return () => document.body.classList.remove("has-sticky-cta");
  }, []);

  if (!flags.stickyMobileCta) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="glass-strong border-x-0 border-b-0">
        <div className="safe-bottom mx-auto flex max-w-6xl items-center gap-3 px-5 pt-3">
          <p className="hidden shrink-0 items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50 min-[400px]:inline-flex">
            <Sparkles size={12} className="text-violet-bright" />
            Seats limited
          </p>
          <RegisterButton size="md" label="REGISTER NOW" className="flex-1" />
        </div>
      </div>
    </div>
  );
}