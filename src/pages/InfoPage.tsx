import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Mail, Phone } from "lucide-react";
import { contact } from "../data/eventConfig";
import { getLegalPage, legalPages, legalPath } from "../data/policies";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Reveal } from "../components/ui/Reveal";

const anchorId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = getLegalPage(slug);

  usePageMeta({
    title: page?.title ?? "Page not found",
    description: page?.description,
    canonicalPath: slug ? `/legal/${slug}` : "/",
  });

  if (!page) {
    return (
      <div className="pt-28 pb-24 sm:pt-32">
        <Container>
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright">
              404
            </p>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              This page does not exist
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
              It may have moved, or the link may be incomplete.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition-colors hover:border-violet/50 hover:text-violet-bright"
              >
                <ArrowLeft size={16} />
                Back to home
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet/40 bg-violet/10 px-5 text-sm font-medium text-violet-bright transition-colors hover:bg-violet/20"
              >
                Contact us
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 flex items-center justify-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm">
            <span aria-hidden className="h-px w-8 bg-violet/50" />
            {page.eyebrow}
            <span aria-hidden className="h-px w-8 bg-violet/50" />
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {page.title}
          </h1>
          <span
            aria-hidden
            className="mt-4 block h-0.5 w-16 rounded-full bg-gradient-to-r from-violet via-violet/60 to-leaf/60"
            style={{ marginInline: "auto" }}
          />
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            {page.description}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/55">
            Last updated {page.lastUpdated}
          </p>
        </Reveal>

        <nav aria-label="On this page" className="mx-auto mt-8 max-w-3xl">
          <Reveal delay={0.08}>
            <div className="glass rounded-2xl px-4 py-4 sm:px-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/55">
                On this page
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {page.sections.map((section) => (
                  <li key={section.heading} className="min-w-0 max-w-full">
                    <a
                      href={`#${anchorId(section.heading)}`}
                      className="inline-flex min-h-9 max-w-full items-center rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs leading-tight text-white/70 transition-colors hover:border-violet/40 hover:text-violet-bright"
                    >
                      <span className="truncate">{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </nav>

        <ol className="mx-auto mt-10 max-w-3xl space-y-4 sm:space-y-5">
          {page.sections.map((section, i) => (
            <li
              key={section.heading}
              id={anchorId(section.heading)}
              className="scroll-target min-w-0"
            >
              <Reveal className="h-full min-w-0" delay={(i % 4) * 0.05} y={16}>
                <div className="glass h-full min-w-0 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-violet/25 bg-violet/10 px-2 font-mono text-[0.65rem] font-semibold text-violet-bright">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="min-w-0 break-words font-display text-lg font-semibold text-white sm:text-xl">
                      {section.heading}
                    </h2>
                  </div>

                  {section.body?.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 32)}
                      className="mt-3 break-words text-sm leading-relaxed text-white/70 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex min-w-0 gap-3 text-sm leading-relaxed text-white/65 sm:text-[0.95rem]"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-bright"
                          />
                          <span className="min-w-0 break-words">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div className="glass rounded-2xl border-violet/20 bg-violet/[0.06] p-5 sm:p-6">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-violet-bright">
              Need help?
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${contact.email}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-violet/40"
              >
                <Mail size={17} className="shrink-0 text-violet-bright" />
                <span className="min-w-0 break-words text-sm text-white/75 group-hover:text-white">
                  {contact.email}
                </span>
              </a>
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-violet/40"
              >
                <Phone size={17} className="shrink-0 text-violet-bright" />
                <span className="min-w-0 break-words text-sm text-white/75 group-hover:text-white">
                  {contact.phone}
                </span>
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 font-medium text-violet-bright transition-colors hover:text-white"
              >
                Open the contact page
                <ArrowUpRight size={14} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-3xl">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/55">
            More from {contact.email.split("@")[0]} · IGNITE 2026
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {legalPages
              .filter((other) => other.slug !== page.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    to={legalPath(other.slug)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs text-white/70 transition-colors hover:border-violet/40 hover:text-violet-bright"
                  >
                    {other.label}
                  </Link>
                </li>
              ))}
          </ul>
        </Reveal>
      </Container>
    </div>
  );
}
