import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /** extra vertical rhythm for the first section under a hero */
  bleed?: boolean;
}

/** Consistent horizontal container for every page section. */
export function Section({ id, className, children, bleed = false }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={cn(
        "relative scroll-target focus:outline-hidden",
        bleed ? "pt-16 sm:pt-24" : "py-20 sm:py-28",
        className
      )}
    >
      {children}
    </section>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("shell-x", className)}>{children}</div>
  );
}