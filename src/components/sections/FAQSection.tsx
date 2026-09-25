import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { contact, faqs } from "../../data/eventConfig";
import { FAQAccordion } from "../ui/FAQAccordion";
import { Reveal } from "../ui/Reveal";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function FAQSection() {
  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything teams usually ask — answered before you need to ask."
        />

        <Reveal>
          <FAQAccordion items={faqs} />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass mx-auto mt-12 flex w-full max-w-3xl min-w-0 flex-col items-center justify-between gap-3 rounded-3xl px-4 py-5 text-sm sm:flex-row sm:gap-6 sm:rounded-full sm:px-7 sm:py-4">
            <p className="w-full min-w-0 text-center text-pretty text-white/65 sm:w-auto sm:flex-1 sm:text-left">
              Still have questions? Email the organizing team —{" "}
              <a
                href={`mailto:${contact.email}`}
                className="break-all font-medium text-violet-bright underline-offset-4 hover:underline sm:break-normal"
              >
                {contact.email}
              </a>
            </p>
            <Link
              to="/faq"
              className="group inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-lg py-2 font-semibold text-white/80 transition-colors hover:text-violet-bright motion-reduce:transition-none sm:w-auto sm:shrink-0 sm:justify-start sm:rounded-none"
            >
              <span className="min-w-0 text-pretty">
                Open the full FAQ page
              </span>
              <ArrowRight
                size={15}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              />
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
