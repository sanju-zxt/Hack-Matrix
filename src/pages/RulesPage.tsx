import { ShieldCheck } from "lucide-react";
import { rules } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { SectionHeading } from "../components/ui/SectionHeading";
import { RegisterButton } from "../components/ui/Button";
import { Reveal } from "../components/ui/Reveal";

export default function RulesPage() {
  usePageMeta({
    title: "Rules",
    description:
      "Rules & code of conduct for HACK-MATRIX 2026 — eligibility, team size, originality, judging and more.",
    canonicalPath: "/rules",
  });

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <SectionHeading
          eyebrow="Rules"
          title="Rules & Code of Conduct"
          description="Everything you need to know to compete fairly — finalized by the organizing team."
        />

        <ul className="mx-auto max-w-3xl space-y-4">
          {rules.map((rule, i) => (
            <li key={rule.title}>
              <Reveal delay={(i % 4) * 0.05}>
                <div className="glass flex gap-4 rounded-2xl p-5 sm:p-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet/25 bg-violet/10 text-violet-bright">
                    <ShieldCheck size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white">
                      {rule.title}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {rule.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="glass rounded-2xl border-dashed border-white/15 px-6 py-5 text-center">
              <p className="text-sm text-white/55">
                These rules are configurable and finalized by the organizing
                team.
              </p>
            </div>
            <div className="mt-8 text-center">
              <RegisterButton size="lg" label="REGISTER FOR HACK-MATRIX" />
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}