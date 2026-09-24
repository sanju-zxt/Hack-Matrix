import { Check } from "lucide-react";
import { eligibility } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function Eligibility() {
  return (
    <Section id="eligibility" className="bg-ink-900/30">
      <Container>
        <SectionHeading
          eyebrow="Eligibility"
          title={eligibility.title}
          description="If you study tech — or just love building — you belong here."
        />

        <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {eligibility.groups.map((group, i) => (
            <li key={group.label}>
              <Reveal delay={(i % 2) * 0.07} y={16}>
                <div className="glass group flex h-full items-start gap-3.5 rounded-2xl p-5 transition-all duration-300 hover:border-violet/40">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet-bright">
                    <Check size={15} strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-white">
                      {group.label}
                    </p>
                    {group.note && (
                      <p className="mt-0.5 text-sm text-white/55">
                        {group.note}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            {eligibility.note}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}