import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { nav } from "../../data/eventConfig";
import { Brand } from "../ui/Logo";
import { RegisterButton } from "../ui/Button";

const DESKTOP_QUERY = "(min-width: 1024px)";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * When the menu closes because the user picked a destination, focus belongs to the new
 * content rather than to a hamburger that is being unmounted along with the panel.
 */
function focusContentAfterNavigation(header: HTMLElement | null) {
  const active = document.activeElement;
  if (active && active !== document.body && !header?.contains(active)) return;
  const main = document.getElementById("main");
  if (main instanceof HTMLElement) main.focus({ preventScroll: true });
}

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
      {nav
        .filter((item) => item.label !== "Register")
        .map((item) => (
          <NavLink
            key={item.to + item.label}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative inline-flex min-h-11 items-center py-2 text-sm font-medium transition-colors duration-200 lg:min-h-0",
                isActive && item.to.startsWith("/#") === false
                  ? "text-violet-bright"
                  : "text-white/70 hover:text-white"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
    </>
  );
}

export function Navbar({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const location = useLocation();
  const routeKey = `${location.pathname}${location.hash}`;

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const focusInPanel = useRef(false);
  const closedForNavigation = useRef(false);
  const prevCommit = useRef({ route: routeKey, open: false });
  const reduce = useReducedMotion();

  const dismiss = useCallback(() => setOpen(false), []);

  const closeForNavigation = useCallback(() => {
    closedForNavigation.current = true;
    setOpen(false);
  }, []);

  const [lastRoute, setLastRoute] = useState(routeKey);
  if (lastRoute !== routeKey) {
    setLastRoute(routeKey);
    if (open) setOpen(false);
  }

  useLayoutEffect(() => {
    if (prevCommit.current.open && prevCommit.current.route !== routeKey) {
      closedForNavigation.current = true;
    }
    prevCommit.current = { route: routeKey, open };
  }, [open, routeKey]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const header = headerRef.current;
    const toggle = toggleRef.current;
    root.classList.add("nav-open");
    focusInPanel.current = false;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !header) return;
      const focusables = Array.from(header.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !header.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktopChange);

    const frame = requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      if (!target) return;
      target.focus();
      focusInPanel.current = true;
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktopChange);
      root.classList.remove("nav-open");
      const navigated = closedForNavigation.current;
      closedForNavigation.current = false;
      if (navigated) {
        focusInPanel.current = false;
        focusContentAfterNavigation(header);
        return;
      }
      if (!focusInPanel.current) return;
      focusInPanel.current = false;
      if (toggle && toggle.offsetParent !== null) toggle.focus();
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "site-header fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-ink-950/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav aria-label="Main" className="shell-x site-nav">
        <Link to="/" aria-label="HACK-MATRIX home" className="shrink-0">
          <Brand logoSize={34} />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <NavLinks />
          <RegisterButton size="sm" label="REGISTER" />
        </div>

        <button
          ref={toggleRef}
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

      <AnimatePresence initial={false}>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden
              onClick={dismiss}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
              className="menu-scrim absolute inset-x-0 top-full bg-ink-950/70 lg:hidden"
            />
            <motion.div
              key="panel"
              id="mobile-nav"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
              className="menu-panel absolute inset-x-0 top-full border-b border-white/5 bg-ink-950/95 backdrop-blur-xl lg:hidden"
            >
              <nav aria-label="Mobile" className="shell-x menu-scroll flex flex-col gap-1 pt-4">
                <NavLinks onNavigate={closeForNavigation} />
                <div className="mt-3 border-t border-white/5 pt-4">
                  <RegisterButton className="w-full" />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
