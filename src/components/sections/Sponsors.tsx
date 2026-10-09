import { useState } from "react";
import { Handshake, Plus } from "lucide-react";
import { sponsors } from "../../data/eventConfig";
import { Container, Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

type Partner = { name: string; category: string; logo?: string };

function PartnerLogo({
  logo,
  name,
  variant = "default",
}: {
  logo?: string;
  name: string;
  variant?: "default" | "feature";
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const src = hasImageError ? undefined : logo;
  const feature = variant === "feature";

  return (
    <span
      className={
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/15 shadow-[0_10px_34px_-15px_rgba(0,0,0,0.85)] " +
        (feature ? "h-28 w-28 p-4 sm:h-32 sm:w-32" : "h-16 w-16 p-2.5")
      }
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          width={feature ? 128 : 64}
          height={feature ? 128 : 64}
          loading="lazy"
          decoding="async"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <Handshake
          size={feature ? 40 : 24}
          strokeWidth={1.6}
          className="text-violet/70"
          aria-hidden
        />
      )}
    </span>
  );
}

function PriorityBadge({ index, feature }: { index: number; feature?: boolean }) {
  return (
    <span
      aria-hidden
      className={
        "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono font-semibold text-violet-bright " +
        (feature
          ? "h-10 w-10 text-sm"
          : "absolute right-4 top-4 h-8 w-8 text-xs")
      }
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function FeaturedPartner({ partner }: { partner: Partner }) {
  return (
    <article className="glass-strong card-sheen group relative h-full min-w-0 overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:[&::after]:hidden sm:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet/10 blur-3xl transition-colors duration-500 group-hover:bg-violet/20 motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="hairline pointer-events-none absolute inset-x-0 top-0 h-px"
      />

      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <PartnerLogo logo={partner.logo} name={partner.name} variant="feature" />

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-mono text-[0.65rem] font-medium uppercase tracking-[0.3em] text-violet-bright sm:text-xs">
            <span aria-hidden className="h-px w-6 bg-violet/50" />
            {partner.category}
          </p>
          <h3 className="mt-3 break-words font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {partner.name}
          </h3>
          <p className="mt-2 max-w-prose break-words text-pretty text-sm leading-relaxed text-white/55 sm:text-base">
            Building the experience with us — powering the program from day one.
          </p>
        </div>

        <div className="hidden shrink-0 sm:block">
          <PriorityBadge index={0} feature />
        </div>
      </div>
    </article>
  );
}

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  return (
    <article className="glass card-sheen group relative h-full min-w-0 overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:[&::after]:hidden sm:p-6">
      <PriorityBadge index={index} />
      <div className="flex min-w-0 items-center gap-4">
        <PartnerLogo logo={partner.logo} name={partner.name} />
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-display text-lg font-semibold text-pretty text-white">
            {partner.name}
          </h3>
          <p className="mt-1 break-words font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.2em] text-pretty text-white/60">
            {partner.category}
          </p>
        </div>
      </div>
    </article>
  );
}

function PartnersShowcase({ partners }: { partners: Partner[] }) {
  const [featured, ...rest] = partners;
  if (!featured) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      <li className="min-w-0 sm:col-span-2">
        <Reveal className="h-full">
          <FeaturedPartner partner={featured} />
        </Reveal>
      </li>

      {rest.map((partner, i) => (
        <li key={partner.name} className="min-w-0">
          <Reveal className="h-full" delay={(i % 2) * 0.08}>
            <PartnerCard partner={partner} index={i + 1} />
          </Reveal>
        </li>
      ))}
    </ul>
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

        {hasPartners && (
          <div className="mb-8 flex flex-col items-center gap-6 sm:mb-12">
            <Reveal>
              <p className="flex items-center justify-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.35em] text-white/50 sm:text-xs">
                <span aria-hidden className="h-px w-8 bg-white/20" />
                {sponsors.notice}
                <span aria-hidden className="h-px w-8 bg-white/20" />
              </p>
            </Reveal>
            <PartnersShowcase partners={[...sponsors.partners]} />
          </div>
        )}

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
      </Container>
    </Section>
  );
}
