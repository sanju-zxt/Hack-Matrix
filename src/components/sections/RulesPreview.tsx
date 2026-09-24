import { ShieldCheck } from "lucide-react";
import { rules } from "../../data/eventConfig";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

const previewRules = rules.slice(0, 4);

export function RulesPreview() {
  return (
    <Section id="rules-preview" className="bg-transparent">
      <Container>
        <SectionHeading
          eyebrow="Rules"
          title="Built to be fair"
          description="Ground rules at a glance â€” the complete list is one click away."
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {previewRules.map((rule, i) => (
            <li key={rule.title}>
              <Reveal delay={(i % 2) * 0.07} y={20}>
                <div className="glass group flex h-full items-start gap-3.5 rounded-2xl p-5 transition-all duration-300 hover:border-violet/40">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet-bright transition-colors duration-300 group-hover:bg-violet/20">
                    <ShieldCheck size={17} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-white">
                      {rule.title}
                    </p>
                    <p className="mt-1 truncate text-sm text-white/55">
                      {rule.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-5">
            <Button variant="outline" size="lg" to="/rules">
              VIEW FULL RULES
            </Button>
            <p className="max-w-2xl text-center font-mono text-xs uppercase tracking-[0.2em] text-white/55">
              All rules are configurable â€” the organizing team finalizes them
              before registration closes.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}