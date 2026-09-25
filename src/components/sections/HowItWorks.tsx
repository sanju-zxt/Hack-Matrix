import { howItWorks } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-ink-900/30">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Seven steps from registration to results"
          description="A sharp, predictable journey — so your team can focus entirely on building."
          className="mb-8 break-words sm:mb-12"
        />

        <div className="relative mx-auto max-w-3xl">
          <span
            aria-hidden
            className="absolute bottom-4 left-[1.0625rem] top-4 w-px bg-gradient-to-b from-violet/60 via-white/15 to-transparent md:left-1/2"
          />

          <ol className="min-w-0">
            {howItWorks.map((step, i) => {
              const even = i % 2 === 0;
              return (
                <li key={step.step} className="relative min-w-0 pb-8 last:pb-1 sm:pb-10">
                  <span
                    aria-hidden
                    className="absolute left-0 top-1 z-10 flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full border border-violet/40 bg-ink-900 font-mono text-[0.7rem] font-semibold text-violet-bright shadow-[0_0_20px_-4px_rgba(124,108,255,0.5)] md:left-1/2 md:-translate-x-1/2"
                  >
                    {step.step}
                  </span>

                  <Reveal
                    delay={0.05}
                    y={18}
                    className={`h-full min-w-0 pl-14 md:w-[calc(50%_-_3rem)] md:pl-0 ${
                      even ? "md:mr-auto md:text-right" : "md:ml-auto"
                    }`}
                  >
                    <div className="glass card-sheen relative h-full min-w-0 overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:border-violet/40 sm:p-5">
                      <p className="font-mono text-[0.6rem] uppercase leading-tight tracking-[0.2em] text-white/70 sm:text-[0.65rem] sm:tracking-[0.3em]">
                        Step {step.step}
                      </p>
                      <h3 className="mt-1.5 break-words font-display text-base font-semibold text-white sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="mt-1 break-words text-xs leading-relaxed text-white/65 sm:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
