import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface Item {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: readonly Item[];
  /** Home nests questions under a section h2 (3); /faq puts them straight under the h1 (2). */
  headingLevel?: 2 | 3;
}

export function FAQAccordion({ items, headingLevel = 3 }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const Heading = `h${headingLevel}` as "h2" | "h3";

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "glass overflow-hidden rounded-2xl transition-colors duration-300",
              isOpen ? "border-violet/40 bg-white/[0.045]" : "hover:border-violet/30"
            )}
          >
            <Heading>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
              >
                <span
                  className={cn(
                    "min-w-0 break-words font-display text-sm font-semibold leading-snug transition-colors duration-200 sm:text-base lg:text-lg",
                    isOpen ? "text-white" : "text-white/80"
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition-transform duration-300",
                    isOpen && "rotate-180 border-violet/50 text-violet-bright"
                  )}
                >
                  <ChevronDown size={16} />
                </span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="overflow-hidden"
                >
                  <p className="break-words px-4 pb-4 pr-12 text-sm leading-relaxed text-white/60 sm:px-6 sm:pb-5 sm:pr-14 sm:text-base">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}