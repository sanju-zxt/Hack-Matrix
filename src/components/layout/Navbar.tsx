import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { nav } from "../../data/eventConfig";
import { Brand } from "../ui/Logo";
import { RegisterButton } from "../ui/Button";

/** Persistent site-wide background: grid + noise + soft vignette. Pure CSS, GPU-friendly. */
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black_30%,transparent_75%)]" />
      <div className="bg-noise absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-violet/[0.09] to-transparent" />
      <div className="glow-orb animate-float-a -top-32 left-[12%] h-96 w-96 bg-violet/15" />
      <div className="glow-orb animate-float-b right-[8%] top-24 h-[28rem] w-[28rem] bg-blue/10" />
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {nav.map((item) => (
        <NavLink
          key={item.to + item.label}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "relative py-2 text-sm font-medium transition-colors duration-200",
              isActive && item.to.startsWith("/#") === false
                ? "text-violet-bright"
                : "text-white/70 hover:text-white",
              item.label === "Register" && "lg:hidden"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-ink-950/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link to="/" aria-label="HACK-MATRIX home" className="shrink-0">
          <Brand logoSize={34} />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <NavLinks />
          <RegisterButton size="sm" label="REGISTER" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.08] lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-white/5 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              <NavLinks onNavigate={() => setOpen(false)} />
              <div className="mt-4 border-t border-white/5 pt-4">
                <RegisterButton className="w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}