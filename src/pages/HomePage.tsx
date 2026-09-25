import {
  Fragment,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/sections/Hero";
import { Ticker } from "../components/sections/Ticker";
import { cn } from "../lib/cn";
import { usePageMeta } from "../lib/seo";

const EventInformation = lazy(() =>
  import("../components/sections/EventInformation").then((m) => ({
    default: m.EventInformation,
  }))
);
const About = lazy(() =>
  import("../components/sections/About").then((m) => ({ default: m.About }))
);
const HowItWorks = lazy(() =>
  import("../components/sections/HowItWorks").then((m) => ({
    default: m.HowItWorks,
  }))
);
const Themes = lazy(() =>
  import("../components/sections/Themes").then((m) => ({ default: m.Themes }))
);
const Eligibility = lazy(() =>
  import("../components/sections/Eligibility").then((m) => ({
    default: m.Eligibility,
  }))
);
const Register = lazy(() =>
  import("../components/sections/Register").then((m) => ({
    default: m.Register,
  }))
);
const Sponsors = lazy(() =>
  import("../components/sections/Sponsors").then((m) => ({
    default: m.Sponsors,
  }))
);
const Prizes = lazy(() =>
  import("../components/sections/Prizes").then((m) => ({ default: m.Prizes }))
);
const Schedule = lazy(() =>
  import("../components/sections/Schedule").then((m) => ({
    default: m.Schedule,
  }))
);
const RulesPreview = lazy(() =>
  import("../components/sections/RulesPreview").then((m) => ({
    default: m.RulesPreview,
  }))
);
const FAQSection = lazy(() =>
  import("../components/sections/FAQSection").then((m) => ({
    default: m.FAQSection,
  }))
);
const Contact = lazy(() =>
  import("../components/sections/Contact").then((m) => ({
    default: m.Contact,
  }))
);

/** Below-the-fold sections in document order; `id` matches the anchor each one owns. */
const BELOW_FOLD_SECTIONS = [
  { id: "event-info", label: "Loading event information", Component: EventInformation },
  { id: "about", label: "Loading about the event", Component: About },
  { id: "how-it-works", label: "Loading how it works", Component: HowItWorks },
  { id: "themes", label: "Loading themes", Component: Themes },
  { id: "eligibility", label: "Loading eligibility", Component: Eligibility },
  { id: "register", label: "Loading registration", Component: Register },
  { id: "sponsors", label: "Loading sponsors", Component: Sponsors },
  { id: "prizes", label: "Loading prizes", Component: Prizes },
  { id: "timeline", label: "Loading schedule", Component: Schedule },
  { id: "rules-preview", label: "Loading rules", Component: RulesPreview },
  { id: "faq", label: "Loading frequently asked questions", Component: FAQSection },
  { id: "contact", label: "Loading contact information", Component: Contact },
] as const;

/** How far ahead of the viewport a sentinel starts pulling in its own section. */
const SENTINEL_ROOT_MARGIN = "1000px 0px";
/** Sections queued per idle slice, so a burst never opens 12 requests at once. */
const IDLE_BATCH_SIZE = 4;
/** Hard ceiling per idle slice, so the page still fills in on a busy main thread. */
const IDLE_SLICE_TIMEOUT_MS = 350;

function SectionSkeleton({ label, pulse = true }: { label: string; pulse?: boolean }) {
  const bar = (className: string) => cn(className, pulse && "motion-safe:animate-pulse");

  return (
    <section
      aria-busy="true"
      aria-label={label}
      className={cn(
        "relative min-h-[22rem] overflow-hidden py-20 sm:min-h-[26rem] sm:py-28",
        !pulse && "opacity-60"
      )}
    >
      <div
        aria-hidden="true"
        className="shell-x flex w-full flex-col items-center gap-4"
      >
        <div className={bar("h-3 w-24 rounded-full bg-white/10")} />
        <div className={bar("h-9 w-4/5 max-w-xl rounded-2xl bg-white/[0.07]")} />
        <div className={bar("h-4 w-3/4 max-w-lg rounded-full bg-white/[0.05]")} />
        <div className="mt-5 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={bar("h-24 rounded-2xl bg-white/[0.05]")} />
          <div className={bar("h-24 rounded-2xl bg-white/[0.05]")} />
        </div>
      </div>
    </section>
  );
}

function LazySection({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return <Suspense fallback={<SectionSkeleton label={label} />}>{children}</Suspense>;
}

/**
 * Reveals below-fold sections as their sentinel approaches the viewport, so the
 * first paint only starts the chunks for what is about to be on screen. Sections
 * mount as a prefix of the document, which keeps order, ids and scroll height
 * stable while the rest is still loading. `eager` reveals everything right away,
 * which is what a deep link such as /#contact needs.
 */
function useSectionReveal(count: number, eager: boolean) {
  const observable = typeof IntersectionObserver !== "undefined";
  const [deferredCount, setDeferredCount] = useState(() =>
    eager || !observable ? count : 0
  );
  const sentinelNodes = useRef(new Set<Element>());
  const revealedCount = eager ? count : deferredCount;

  const registerSentinel = useCallback((node: Element | null) => {
    if (node) sentinelNodes.current.add(node);
  }, []);

  const revealThrough = useCallback((index: number) => {
    setDeferredCount((current) => (index + 1 > current ? index + 1 : current));
  }, []);

  const revealMore = useCallback(
    (batch: number) => {
      setDeferredCount((current) => Math.min(current + batch, count));
    },
    [count]
  );

  useEffect(() => {
    if (!observable) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealThrough(Number((entry.target as HTMLElement).dataset.sectionIndex));
        }
      },
      { rootMargin: SENTINEL_ROOT_MARGIN }
    );

    for (const node of sentinelNodes.current) observer.observe(node);

    return () => observer.disconnect();
  }, [observable, revealThrough]);

  // Below-fold content is never gated behind a scroll gesture: from the first
  // frame on, the page keeps filling itself in small idle slices so deep links,
  // in-page search and crawlers all find the whole document.
  useEffect(() => {
    if (revealedCount >= count) return;

    let idleHandle: number | undefined;
    let timerHandle: number | undefined;
    const runSlice = () => revealMore(IDLE_BATCH_SIZE);
    const frame = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(runSlice, { timeout: IDLE_SLICE_TIMEOUT_MS });
      } else {
        timerHandle = window.setTimeout(runSlice, IDLE_SLICE_TIMEOUT_MS);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
      if (timerHandle !== undefined) window.clearTimeout(timerHandle);
    };
  }, [count, revealedCount, revealMore]);

  return { revealedCount, registerSentinel };
}

export default function HomePage() {
  usePageMeta();
  // A deep link such as /#contact must resolve without a scroll gesture, so the
  // anchor exists before ScrollToTop retries it.
  const { hash } = useLocation();
  const { revealedCount, registerSentinel } = useSectionReveal(
    BELOW_FOLD_SECTIONS.length,
    Boolean(hash)
  );

  return (
    <div>
      <Hero />
      <Ticker />
      {BELOW_FOLD_SECTIONS.map((section, index) => (
        <Fragment key={section.id}>
          <LazySection label={section.label}>
            {index < revealedCount ? (
              <section.Component />
            ) : (
              <SectionSkeleton label={section.label} pulse={false} />
            )}
          </LazySection>
          <div
            ref={registerSentinel}
            data-section-index={index}
            aria-hidden="true"
            className="h-px w-full"
          />
        </Fragment>
      ))}
    </div>
  );
}
