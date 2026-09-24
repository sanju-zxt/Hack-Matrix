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
        />

        <div className="relative mx-auto max-w-3xl">
          {/* vertical line */}
          <span
            aria-hidden
            className="absolute bottom-4 left-[1.0625rem] top-4 w-px bg-gradient-to-b from-violet/60 via-white/15 to-transparent sm:left-[calc(50%-0.5px)]"
          />

          <ol>
            {howItWorks.map((step, i) => {
              const even = i % 2 === 0;
              return (
                <li key={step.step} className="relative pb-10 last:pb-2">
                  <span
                    aria-hidden
                    className="absolute left-0 top-1 z-10 flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full border border-violet/40 bg-ink-900 font-mono text-[0.7rem] font-semibold text-violet-bright shadow-[0_0_20px_-4px_rgba(124,108,255,0.5)] sm:left-1/2 sm:-translate-x-1/2"
                  >
                    {step.step}
                  </span>

                  <Reveal
                    delay={0.05}
                    y={18}
                    className={`pl-14 sm:w-[calc(50%-3rem)] sm:pl-0 ${
                      even ? "sm:mr-auto sm:text-right" : "sm:ml-auto"
                    }`}
                  >
                    <div className="glass rounded-2xl p-5 transition-all duration-300 hover:border-violet/40">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
                        Step {step.step}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">
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