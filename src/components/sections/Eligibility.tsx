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

        <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
          {eligibility.groups.map((group, i) => (
            <li key={group.label} className="min-w-0">
              <Reveal className="h-full" delay={(i % 2) * 0.07} y={16}>
                <div className="glass group flex h-full items-start gap-3.5 rounded-2xl p-4 transition-all duration-300 hover:border-violet/40 sm:p-5">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet-bright">
                    <Check size={15} strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-display font-semibold text-pretty text-white">
                      {group.label}
                    </p>
                    {group.note && (
                      <p className="mt-1 break-words text-pretty text-sm leading-relaxed text-white/55">
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
          <p className="mx-auto mt-8 max-w-2xl px-2 text-center font-mono text-xs leading-relaxed tracking-[0.14em] text-pretty text-white/55 sm:px-0 sm:tracking-[0.2em]">
            {eligibility.note}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
