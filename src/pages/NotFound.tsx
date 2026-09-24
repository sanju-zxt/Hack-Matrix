import { ChevronRight } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { Container } from "../components/ui/Section";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  usePageMeta({ title: "Page not found" });

  return (
    <div className="flex min-h-[70vh] items-center justify-center pt-28 pb-20 sm:pt-32">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <p className="font-mono text-6xl font-bold tracking-tight text-gradient sm:text-7xl">
            404
          </p>
          <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
            This node doesn't exist
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            The route you hit isn't part of the matrix. Head back home —
            everything you need is one page away.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/" size="lg">
              BACK TO HOMEPAGE
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}