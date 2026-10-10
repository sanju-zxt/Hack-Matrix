import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Reveal } from "../components/ui/Reveal";
import { RegisterButton } from "../components/ui/Button";
import { About } from "../components/sections/About";
import { Sponsors } from "../components/sections/Sponsors";

export default function AboutPage() {
  usePageMeta({
    title: "About Us",
    description:
      "About IGNITE 2026 — a 4-week industry product prototyping sprint at Vijaya Vittala Institute of Technology, Bengaluru, in collaboration with SmartX Technologies and AptPath, supported by Samagra.",
    canonicalPath: "/about",
  });

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container>
        <Reveal className="mb-12 max-w-2xl sm:mb-16 mx-auto text-center">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-violet/50" />
            About Us
            <span aria-hidden className="h-px w-8 bg-violet/50" />
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Who is behind IGNITE
          </h1>
          <span
            aria-hidden
            className="mt-4 block h-0.5 w-16 rounded-full bg-gradient-to-r from-violet via-violet/60 to-leaf/60"
            style={{ marginInline: "auto" }}
          />
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            The story of the event and the institutions working together to run
            it.
          </p>
        </Reveal>
      </Container>

      <About />
      <Sponsors />

      <Container>
        <Reveal>
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="glass rounded-2xl px-5 py-6 text-center sm:px-8 sm:py-8">
              <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
                Ready to build something of your own?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
                IGNITE 2026 runs for four weeks, from the kickoff in October to
                the finale in November. Bring your team, your idea and a laptop
                — mentors help with the rest.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <RegisterButton
                  className="w-full sm:w-auto"
                  size="lg"
                  label="REGISTER FOR IGNITE"
                />
                <Link
                  to="/rules"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition-colors hover:border-violet/50 hover:text-violet-bright sm:w-auto"
                >
                  Read the rules
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}