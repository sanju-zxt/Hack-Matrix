import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import { scrollToId } from "../../lib/scroll";
import { Navbar, SiteBackground } from "./Navbar";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const handleSkipLink = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = mainRef.current;
    if (!main) return;
    scrollToId(main.id);
  }, []);

  return (
    <div className="app-shell relative overflow-x-clip">
      <SiteBackground />
      <a
        href="#main"
        onClick={handleSkipLink}
        className="sr-only focus:not-sr-only focus:absolute focus:left-[max(0.5rem,var(--safe-left))] focus:top-[calc(var(--safe-top)_+_0.5rem)] focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-violet focus:px-4 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar onOpenChange={setMenuOpen} />
      <main
        ref={mainRef}
        id="main"
        tabIndex={-1}
        className={cn("scroll-target focus:outline-hidden", pathname !== "/" && "page-top")}
      >
        {children}
      </main>
      <Footer />
      <StickyMobileCTA hidden={menuOpen} />
    </div>
  );
}
