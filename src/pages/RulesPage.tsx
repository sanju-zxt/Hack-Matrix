import { ShieldCheck } from "lucide-react";
import { rules } from "../data/eventConfig";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
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
        <Reveal className="mb-12 max-w-2xl sm:mb-16 mx-auto text-center">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-violet/50" />
            Rules
            <span aria-hidden className="h-px w-8 bg-violet/50" />
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Rules &amp; Code of Conduct
          </h1>
          <span
            aria-hidden
            className="mt-4 block h-0.5 w-16 rounded-full bg-gradient-to-r from-violet via-violet/60 to-leaf/60"
            style={{ marginInline: "auto" }}
          />
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Everything you need to know to compete fairly — finalized by the organizing team.
          </p>
        </Reveal>

        <ul className="mx-auto max-w-3xl space-y-4">
          {rules.map((rule, i) => (
            <li key={rule.title} className="min-w-0">
              <Reveal className="h-full" delay={(i % 4) * 0.05}>
                <div className="glass flex h-full min-w-0 gap-3 rounded-2xl p-4 sm:gap-4 sm:p-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet/25 bg-violet/10 text-violet-bright">
                    <ShieldCheck size={18} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words font-display text-lg font-semibold text-pretty text-white">
                      {rule.title}
                    </h2>
                    <p className="mt-1 break-words text-pretty text-sm leading-relaxed text-white/60">
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
            <div className="glass rounded-2xl border-dashed border-white/15 px-4 py-4 text-center sm:px-6 sm:py-5">
              <p className="text-pretty text-sm leading-relaxed text-white/55">
                These rules are configurable and finalized by the organizing
                team.
              </p>
            </div>
            <div className="mt-8 text-center">
              <RegisterButton
                className="w-full sm:w-auto"
                size="lg"
                label="REGISTER FOR HACK-MATRIX"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
