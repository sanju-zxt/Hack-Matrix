import { ArrowRight } from "lucide-react";
import { faqs } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { SectionHeading } from "../components/ui/SectionHeading";
import { FAQAccordion } from "../components/ui/FAQAccordion";
import { Button } from "../components/ui/Button";
import { Reveal } from "../components/ui/Reveal";

export default function FAQPage() {
  usePageMeta({
    title: "FAQ",
    description:
      "Frequently asked questions about HACK-MATRIX 2026 â€” eligibility, teams, judging, submissions and more.",
    canonicalPath: "/faq",
  });

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Straight answers to the questions we hear most. Missed something? Reach out to the organizing team."
        />

        <FAQAccordion items={faqs} />

        <Reveal delay={0.1}>
          <div className="glass-strong relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl p-8 text-center sm:p-10">
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
            />
            <div className="relative">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/55">
                Still unsure?
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                Don't miss the build window
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/55 sm:text-base">
                Registration is open. Secure your team's slot before the window
                closes.
              </p>
              <div className="mt-6">
                <Button to="/register" size="lg">
                  REGISTER FOR HACK-MATRIX
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}