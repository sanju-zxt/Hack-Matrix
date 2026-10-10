import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Reveal } from "../components/ui/Reveal";
import { Contact } from "../components/sections/Contact";

export default function ContactPage() {
  usePageMeta({
    title: "Contact Us",
    description:
      "Contact the IGNITE 2026 organizing team — email, phone and the contact form, for registration, payment and event queries.",
    canonicalPath: "/contact",
  });

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <Reveal className="mb-12 max-w-2xl sm:mb-16 mx-auto text-center">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-violet/50" />
            Contact
            <span aria-hidden className="h-px w-8 bg-violet/50" />
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Contact the organizing team
          </h1>
          <span
            aria-hidden
            className="mt-4 block h-0.5 w-16 rounded-full bg-gradient-to-r from-violet via-violet/60 to-leaf/60"
            style={{ marginInline: "auto" }}
          />
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Questions about registration, payment, mentoring or the finale —
            send a message below and the team will get back to you.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mx-auto -mt-6 mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm text-white/55 sm:-mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-violet-bright"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
            <span aria-hidden className="text-white/20">
              ·
            </span>
            <span>
              Read the{" "}
              <Link
                to="/legal/privacy-policy"
                className="text-violet-bright transition-colors hover:text-white"
              >
                privacy policy
              </Link>{" "}
              for how your details are handled.
            </span>
            <ArrowUpRight size={12} className="hidden" />
          </p>
        </Reveal>
      </Container>

      <Contact />
    </div>
  );
}