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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
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
              <div className="mt-8 flex items-center gap-5">
                <span
                  aria-hidden
                  className="relative inline-flex h-20 w-20 shrink-0 items-center justify-center"
                >
                  <span className="spin-slow absolute inset-0 rounded-full border border-dashed border-violet/30" />
                  <span className="spin-rev absolute inset-2 rounded-full border border-dotted border-leaf/40" />
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-violet/40 bg-ink-800 font-mono text-[0.7rem] font-semibold tracking-widest text-violet-bright">
                    HM
                  </span>
                  <span className="absolute -right-0.5 top-2 h-2 w-2 rounded-full bg-leaf-light shadow-[0_0_8px_rgba(98,201,135,0.9)]" />
                </span>
                <span className="font-mono text-sm text-white/55">
                  {about.pillars.length} pillars guide the build
                  {flags.showLogo && (
                    <>
                      {" Â· "}
                      <span className="text-white/60">powered by VVIT Bengaluru</span>
                    </>
                  )}
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
                  <div className="glass card-sheen group h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10 text-violet-bright transition-colors duration-300 group-hover:bg-violet/20">
                        <Icon size={19} strokeWidth={1.75} />
                      </span>
                      <p className="font-mono text-xs text-white/55">
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