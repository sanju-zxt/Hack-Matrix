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
import { Logo } from "../ui/Logo";

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
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Sticky narrative column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="About the Event"
              title="An 8-hour sprint from zero to shipped"
              className="mb-6"
            />
            {about.paragraphs.map((p) => (
              <Reveal key={p.slice(0, 24)} delay={0.1}>
                <p className="mb-4 text-base leading-relaxed text-white/65">
                  {p}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="mt-6 flex items-center gap-4">
                {flags.showLogo && (
                  <span className="hidden shrink-0 sm:block">
                    <Logo size={52} />
                  </span>
                )}
                <span className="font-mono text-sm text-white/40">
                  {about.pillars.length} pillars guide the build · more below
                </span>
              </div>
            </Reveal>
          </div>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {about.pillars.map((pillar, i) => {
              const Icon = pillarIcons[i % pillarIcons.length];
              return (
                <Reveal key={pillar.title} delay={(i % 2) * 0.07} y={20}>
                  <div className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet-bright transition-colors duration-300 group-hover:bg-violet/20">
                        <Icon size={19} strokeWidth={1.75} />
                      </span>
                      <p className="font-mono text-xs text-white/35">
                        0{i + 1}
                      </p>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">
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