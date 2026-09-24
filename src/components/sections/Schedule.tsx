import { CalendarDays } from "lucide-react";
import { schedule, scheduleDates } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const isPending = (value: string) =>
  /to be announced|announced at the event/i.test(value);

export function Schedule() {
  return (
    <Section id="timeline" className="bg-ink-900/30">
      <Container>
        <SectionHeading
          eyebrow="Event Timeline"
          title="The day, hour by hour"
          description="Key milestones planned around the event. Fine-tuned timing is published closer to the day."
        />

        <ol className="mx-auto grid max-w-3xl">
          {schedule.map((item, i) => (
            <li key={item.key} className="relative pb-3 last:pb-0">
              <Reveal delay={i * 0.03} y={14}>
                <div
                  className={`flex items-start gap-4 rounded-2xl p-4 transition-colors duration-300 sm:items-center ${
                    item.highlight
                      ? "glass border-violet/30 bg-violet/[0.07]"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0 ${
                      item.highlight
                        ? "bg-violet-bright shadow-[0_0_12px_rgba(154,139,255,0.9)]"
                        : "bg-white/20"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/80 sm:text-base">
                      {item.label}
                    </p>
                  </div>
                  <p
                    className={`text-right font-mono text-xs sm:text-sm ${
                      item.highlight ? "text-violet-bright" : "text-white/50"
                    }`}
                  >
                    {item.value}
                  </p>
                  {isPending(item.value) && (
                    <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-amber-300">
                      TBA
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            <CalendarDays size={14} className="text-violet-bright" />
            All times in {scheduleDates.timeZone} · [TBA] slots are confirmed by the
            organizing team
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}