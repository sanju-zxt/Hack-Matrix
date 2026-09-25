import { Gift, Trophy } from "lucide-react";
import { prizes } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function Prizes() {
  const finalized = prizes.status === "FINAL";
  const lastCategoryLayout = [
    prizes.categories.length % 2 !== 0 ? "sm:col-span-2" : "",
    prizes.categories.length % 3 === 1 ? "lg:col-span-1 lg:col-start-2" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const ghostSlotLayout = [
    prizes.categories.length % 2 !== 0 ? "col-span-2" : "",
    prizes.categories.length % 3 !== 0 ? "sm:col-span-2" : "",
    "lg:col-span-1 lg:col-start-auto",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Section id="prizes">
      <Container>
        <SectionHeading
          eyebrow="Prizes"
          title="What's worth building for"
          description="Rewards for the best builds across the day."
        />

        {!finalized && (
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <div className="glass flex min-w-0 flex-col items-center gap-4 rounded-3xl border-dashed border-white/15 px-5 py-8 text-center sm:px-8 sm:py-12">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet/10 text-violet-bright">
                  <Trophy size={26} strokeWidth={1.6} />
                </span>
                <p className="break-words font-display text-xl font-semibold text-pretty text-white sm:text-2xl">
                  {prizes.notice}
                </p>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-white/55">
                  Prize tiers are being finalized. When announced, categories
                  like the ones below will light up — keep an eye on our social
                  channels.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {!finalized && (
          <Reveal delay={0.1}>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {prizes.categories.map((category, i) => (
                <li
                  key={category}
                  className={`glass flex h-full min-w-0 items-center gap-2.5 rounded-2xl p-3.5 transition-colors duration-300 hover:border-violet/40 sm:p-4 ${
                    i === prizes.categories.length - 1 ? ghostSlotLayout : ""
                  }`}
                >
                  <Gift size={16} className="shrink-0 text-white/55" />
                  <span className="min-w-0 break-words text-pretty text-sm text-white/60">
                    {category}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {finalized && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prizes.categories.map((category, i) => (
              <li
                key={category}
                className={`min-w-0 ${
                  i === prizes.categories.length - 1 ? lastCategoryLayout : ""
                }`}
              >
                <Reveal className="h-full" delay={(i % 3) * 0.07}>
                  <div className="glass h-full min-w-0 rounded-2xl p-4 sm:p-6">
                    <Trophy
                      size={20}
                      className="shrink-0 text-violet-bright"
                      strokeWidth={1.75}
                    />
                    <p className="mt-4 break-words font-display text-lg font-semibold text-pretty text-white">
                      {category}
                    </p>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-white/60">
                      Details announced by the organizing team.
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
