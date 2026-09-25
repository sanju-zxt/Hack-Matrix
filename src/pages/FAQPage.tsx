import { ArrowRight } from "lucide-react";
import { faqs } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { FAQAccordion } from "../components/ui/FAQAccordion";
import { Button } from "../components/ui/Button";
import { Reveal } from "../components/ui/Reveal";

export default function FAQPage() {
  usePageMeta({
    title: "FAQ",
    description:
      "Frequently asked questions about HACK-MATRIX 2026 — eligibility, teams, judging, submissions and more.",
    canonicalPath: "/faq",
  });

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <Reveal className="mb-12 max-w-2xl sm:mb-16 mx-auto text-center">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-violet/50" />
            FAQ
            <span aria-hidden className="h-px w-8 bg-violet/50" />
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Frequently asked questions
          </h1>
          <span
            aria-hidden
            className="mt-4 block h-0.5 w-16 rounded-full bg-gradient-to-r from-violet via-violet/60 to-leaf/60"
            style={{ marginInline: "auto" }}
          />
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Straight answers to the questions we hear most. Missed something? Reach out to the organizing team.
          </p>
        </Reveal>

        <FAQAccordion items={faqs} headingLevel={2} />

        <Reveal delay={0.1}>
          <div className="glass-strong relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl p-5 text-center sm:p-10">
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
            />
            <div className="relative min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/55 sm:text-[0.65rem] sm:tracking-[0.25em]">
                Still unsure?
              </p>
              <h2 className="mt-3 break-words font-display text-2xl font-semibold text-pretty text-white sm:text-3xl">
                Don't miss the build window
              </h2>
              <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-white/55 sm:text-base">
                Registration is open. Secure your team's slot before the window
                closes.
              </p>
              <div className="mt-6">
                <Button className="w-full sm:w-auto" to="/register" size="lg">
                  <span className="min-w-0 text-center">
                    REGISTER FOR HACK-MATRIX
                  </span>
                  <ArrowRight size={18} className="shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
