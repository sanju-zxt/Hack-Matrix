import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Button, RegisterButton } from "../components/ui/Button";

export default function NotFound() {
  usePageMeta({
    title: "Page not found",
    description:
      "This route fell out of the matrix — but your seat at HACK-MATRIX 2026 hasn't been taken yet.",
  });

  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden pt-28 pb-28 lg:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
        <div className="bg-noise absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-0 bg-ink-950/60" />
      </div>

      <Container>
        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-violet-bright">
            OUT OF BOUNDS
          </p>

          <p className="mt-6 font-display text-[6rem] leading-none font-black tracking-tight text-gradient drop-shadow-[0_0_45px_rgba(124,108,255,0.35)] sm:text-[9rem] lg:text-[12rem]">
            404
          </p>

          <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            This page fell out of the MATRIX.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            But your seat at HACK-MATRIX 2026 hasn&apos;t been taken yet.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <RegisterButton size="lg" label="REGISTER YOUR TEAM" />
            <Button to="/" variant="outline" size="lg">
              BACK TO HOME
              <ChevronRight size={18} />
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}