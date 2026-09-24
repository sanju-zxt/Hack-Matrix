import { cn } from "../../lib/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl sm:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 font-mono text-xs font-medium uppercase tracking-[0.35em] text-violet-bright sm:text-sm",
            align === "center" && "flex items-center justify-center gap-3"
          )}
        >
          {align === "center" && <span aria-hidden className="h-px w-8 bg-violet/50" />}
          {eyebrow}
          {align === "center" && <span aria-hidden className="h-px w-8 bg-violet/50" />}
        </p>
      )}
      <h2
        id={id}
        className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}