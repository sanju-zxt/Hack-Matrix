import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HASH_RETRY_MS = 80;
const HASH_RETRY_LIMIT = 12;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** "auto" would resolve to the document-level smooth scrolling, so reduced motion asks for "instant". */
function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "instant" : "smooth";
}

/**
 * Moves focus to a scroll target without triggering a second scroll, so keyboard and
 * screen-reader users land on the section they navigated to. `preventScroll` keeps the
 * browser (and reduced-motion users) from fighting the scroll we already started.
 */
function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute("tabindex") && el.tabIndex < 0) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  focusTarget(el);
  return true;
}

/** `decodeURIComponent` throws on malformed hashes (e.g. "#%"), which would blank the app. */
function hashTargetId(hash: string): string {
  const raw = hash.replace(/^#/, "");
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Scrolls to top on route change (SPA navigation), preserving hash anchors. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = hashTargetId(hash);
    if (!id) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    if (scrollToTarget(id)) return;

    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (scrollToTarget(id) || tries >= HASH_RETRY_LIMIT) {
        window.clearInterval(timer);
      }
    }, HASH_RETRY_MS);

    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
}

/** Scrolls to a section id and moves focus to it (in-page CTAs, skip link). */
export function scrollToId(id: string) {
  scrollToTarget(id);
}
