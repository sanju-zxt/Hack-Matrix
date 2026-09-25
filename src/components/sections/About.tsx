import {
  Blocks,
  BrainCircuit,
  Briefcase,
  CloudUpload,
  Presentation,
  Rocket,
  Target,
  type LucideIcon,
} from "lucide-react";
import { about, flags } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const pillarIcons: LucideIcon[] = [
  Blocks,
  Target,
  Rocket,
  BrainCircuit,
  CloudUpload,
  Presentation,
  Briefcase,
];

export function About() {
  return (
    <Section id="about">
      <Container>
        <div className="grid min-w-0 grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10 lg:gap-16">
          <div className="min-w-0 md:sticky md:top-28 md:self-start lg:top-32">
            <SectionHeading
              align="left"
              eyebrow="About the Event"
              title="An 8-hour sprint from zero to shipped"
              className="mb-6 break-words sm:mb-8"
            />
            {about.paragraphs.map((p, index) => (
              <Reveal key={`${index}-${p.slice(0, 24)}`} delay={0.1} className="min-w-0">
                <p className="mb-4 break-words text-base leading-relaxed text-white/70">
                  {p}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
                <span
                  aria-hidden
                  className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20"
                >
                  <span className="spin-slow absolute inset-0 rounded-full border border-dashed border-violet/30" />
                  <span className="spin-rev absolute inset-2 rounded-full border border-dotted border-leaf/40" />
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-violet/40 bg-ink-800 font-mono text-[0.7rem] font-semibold tracking-widest text-violet-bright">
                    HM
                  </span>
                  <span className="absolute -right-0.5 top-2 h-2 w-2 rounded-full bg-leaf-light shadow-[0_0_8px_rgba(98,201,135,0.9)]" />
                </span>
                <p className="max-w-xs break-words font-mono text-sm leading-relaxed text-white/65 sm:max-w-none">
                  {about.pillars.length} pillars guide the build
                  {flags.showLogo && (
                    <>
                      {" · "}
                      <span className="text-white/70">powered by VVIT Bengaluru</span>
                    </>
                  )}
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {about.pillars.map((pillar, i) => {
              const Icon = pillarIcons[i % pillarIcons.length];
              return (
                <Reveal
                  key={pillar.title}
                  delay={(i % 2) * 0.07}
                  y={20}
                  className="h-full min-w-0"
                >
                  <div className="glass card-sheen group h-full min-w-0 overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet-bright transition-colors duration-300 group-hover:bg-violet/20">
                        <Icon size={19} strokeWidth={1.75} />
                      </span>
                      <p className="font-mono text-xs text-white/65">0{i + 1}</p>
                    </div>
                    <h3 className="mt-4 break-words font-display text-base font-semibold text-white sm:text-lg">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 break-words text-sm leading-relaxed text-white/65">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
