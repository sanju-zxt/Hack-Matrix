import { lazy, Suspense } from "react";
import { Hero } from "../components/sections/Hero";
import { Ticker } from "../components/sections/Ticker";
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

const loading = (
  <section className="py-24 text-center font-mono text-xs uppercase tracking-[0.3em] text-white/55">
    Loadingâ€¦
  </section>
);

export default function HomePage() {
  usePageMeta();

  return (
    <div>
      <Hero />
      <Ticker />
      <Suspense fallback={loading}>
        <EventInformation />
        <About />
        <HowItWorks />
        <Themes />
        <Eligibility />
        <Register />
        <Sponsors />
        <Prizes />
        <Schedule />
        <RulesPreview />
        <FAQSection />
        <Contact />
      </Suspense>
    </div>
  );
}