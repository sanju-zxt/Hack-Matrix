import { Handshake, Plus } from "lucide-react";
import { sponsors } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function Sponsors() {
  const hasPartners = sponsors.partners.length > 0;

  return (
    <Section id="sponsors" className="bg-ink-900/30">
      <Container>
        <SectionHeading
          eyebrow="Partners & Sponsors"
          title="Backed by great partners"
          description="We're partnering with organizations that believe in student innovation."
        />

        {!hasPartners && (
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <div className="glass flex flex-col items-center gap-4 rounded-3xl border-dashed border-white/15 px-8 py-12 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet/10 text-violet-bright">
                  <Handshake size={26} strokeWidth={1.6} />
                </span>
                <p className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {sponsors.notice}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-white/55">
                  Category slots are reserved below â€” official logos and details
                  will appear here as partnerships are finalized.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {!hasPartners && (
          <Reveal delay={0.1}>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {sponsors.categories.map((category) => (
                <li
                  key={category}
                  className="glass flex min-h-[7.5rem] flex-col items-center justify-center gap-2 rounded-2xl border-dashed border-white/10 p-4 text-center transition-colors duration-300 hover:border-violet/40"
                >
                  <Plus size={18} className="text-white/60" />
                  <span className="font-mono text-xs leading-snug text-white/55">
                    {category}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* Real partners render here when added to eventConfig.sponsors.partners */}
        {hasPartners && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.partners.map((partner) => (
              <Reveal key={partner.name}>
                <div className="glass flex items-center gap-4 rounded-2xl p-6">
                  {partner.logo && (
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-12 w-12 rounded-xl object-contain"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-display font-semibold text-white">
                      {partner.name}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-widest text-white/60">
                      {partner.category}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}