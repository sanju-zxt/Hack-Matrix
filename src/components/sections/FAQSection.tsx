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
          <div className="glass mx-auto mt-12 flex max-w-3xl flex-col items-center justify-between gap-3 rounded-full px-7 py-4 text-sm sm:flex-row sm:gap-6">
            <p className="text-center text-white/65 sm:text-left">
              Still have questions? Email the organizing team —{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-violet-bright underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
            </p>
            <Link
              to="/faq"
              className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-white/80 transition-colors hover:text-violet-bright"
            >
              Open the full FAQ page
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}