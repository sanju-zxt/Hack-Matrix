import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Brain,
  Cloud,
  Database,
  Globe,
  HeartHandshake,
  Info,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { themes, themesNote } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  chart: BarChart3,
  database: Database,
  globe: Globe,
  zap: Zap,
  shield: ShieldCheck,
  cloud: Cloud,
  heart: HeartHandshake,
  sparkles: Sparkles,
};

export function Themes() {
  return (
    <Section id="themes">
      <Container>
        <SectionHeading
          eyebrow="Themes"
          title="Choose your battlefield"
          description={`Problem statements fall across these domains. ${themesNote}`}
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {themes.map((theme, i) => {
            const Icon = iconMap[theme.icon] ?? Sparkles;
            return (
              <li key={theme.title} className="min-w-0">
                <Reveal className="h-full" delay={(i % 3) * 0.07} y={20}>
                  <div className="glass card-sheen group relative h-full min-w-0 overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:[&::after]:hidden sm:p-6">
                    <span
                      aria-hidden
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue/5 blur-2xl transition-all duration-500 group-hover:bg-violet/15 motion-reduce:transition-none"
                    />
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-violet-bright transition-colors duration-300 group-hover:bg-violet/15 motion-reduce:transition-none">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-4 break-words font-display text-lg font-semibold text-pretty text-white">
                      {theme.title}
                    </h3>
                    <p className="mt-1.5 break-words text-pretty text-sm leading-relaxed text-white/55">
                      {theme.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={0.15}>
          <div className="glass mt-8 flex min-w-0 items-start gap-3.5 rounded-2xl border-violet/20 bg-violet/[0.06] p-4 sm:items-center sm:p-5">
            <Info size={20} className="mt-0.5 shrink-0 text-violet-bright" />
            <p className="min-w-0 break-words text-pretty text-sm leading-relaxed text-white/75">
              <strong className="font-semibold text-white">Heads up:</strong>{" "}
              {themesNote} Themes shown here are categories to guide preparation —
              not the final specifications.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
