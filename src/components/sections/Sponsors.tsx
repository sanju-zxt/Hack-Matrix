import { useState } from "react";
import { Handshake, Plus } from "lucide-react";
import { sponsors } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

function PartnerLogo({ logo, name }: { logo?: string; name: string }) {
  const [hasImageError, setHasImageError] = useState(false);
  const showLogo = logo && !hasImageError;

  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2">
      {showLogo ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <Handshake size={22} className="text-white/45" aria-hidden />
      )}
    </span>
  );
}

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
              <div className="glass flex min-w-0 flex-col items-center gap-4 rounded-3xl border-dashed border-white/15 px-5 py-8 text-center sm:px-8 sm:py-12">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet/10 text-violet-bright">
                  <Handshake size={26} strokeWidth={1.6} />
                </span>
                <p className="break-words font-display text-xl font-semibold text-pretty text-white sm:text-2xl">
                  {sponsors.notice}
                </p>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-white/55">
                  Category slots are reserved below — official logos and details
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
                  className="glass flex min-h-[7.5rem] min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-dashed border-white/10 p-3 text-center transition-colors duration-300 hover:border-violet/40 sm:p-4"
                >
                  <Plus size={18} className="shrink-0 text-white/60" />
                  <span className="min-w-0 break-words font-mono text-xs leading-relaxed text-pretty text-white/55">
                    {category}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {hasPartners && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.partners.map((partner) => (
              <li key={partner.name} className="min-w-0">
                <Reveal className="h-full">
                  <div className="glass flex h-full min-w-0 items-center gap-3 rounded-2xl p-4 sm:gap-4 sm:p-6">
                    <PartnerLogo logo={partner.logo} name={partner.name} />
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-display font-semibold text-pretty text-white">
                        {partner.name}
                      </p>
                      <p className="mt-1 break-words font-mono text-xs uppercase leading-relaxed tracking-wider text-pretty text-white/60">
                        {partner.category}
                      </p>
                    </div>
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
