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

        <ol className="mx-auto grid max-w-3xl grid-cols-1">
          {schedule.map((item, i) => (
            <li key={item.key} className="relative min-w-0 pb-3 last:pb-0">
              <Reveal delay={i * 0.03} y={14}>
                <div
                  className={`flex min-w-0 items-start gap-3 rounded-2xl p-3.5 transition-colors duration-300 sm:items-center sm:gap-4 sm:p-4 ${
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
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                    <p className="min-w-0 flex-1 break-words text-pretty text-sm font-medium leading-relaxed text-white/80 sm:text-base">
                      {item.label}
                    </p>
                    <p
                      className={`min-w-0 break-words text-left font-mono text-sm leading-relaxed sm:max-w-[60%] sm:text-right ${
                        item.highlight ? "text-violet-bright" : "text-white/60"
                      }`}
                    >
                      {item.value}
                    </p>
                    {isPending(item.value) && (
                      <span className="w-fit shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-mono text-xs uppercase leading-none tracking-wider text-amber-300">
                        TBA
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 px-2 text-center font-mono text-xs leading-relaxed tracking-[0.12em] text-pretty text-white/55 sm:items-center sm:px-0 sm:tracking-[0.2em]">
            <CalendarDays
              size={14}
              className="mt-0.5 shrink-0 text-violet-bright"
            />
            <span className="min-w-0">
              All times in {scheduleDates.timeZone} · [TBA] slots are confirmed
              by the organizing team
            </span>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
