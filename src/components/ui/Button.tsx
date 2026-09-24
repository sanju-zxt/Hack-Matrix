import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { getRegistrationUrl } from "../../lib/registration";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright select-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-violet to-violet-deep shadow-[0_8px_30px_-6px_rgba(124,108,255,0.55)] hover:shadow-[0_10px_40px_-6px_rgba(124,108,255,0.75)] hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "text-white border border-white/15 bg-white/[0.02] hover:border-violet/60 hover:bg-violet/10 hover:text-violet-bright",
  ghost: "text-white/70 hover:text-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type Props = Common &
  (
    | { to: string; href?: never; onClick?: never }
    | { to?: never; href: string; target?: string; rel?: string }
    | {
        to?: never;
        href?: never;
        onClick?: MouseEventHandler<HTMLButtonElement>;
        type?: "button" | "submit";
        disabled?: boolean;
        "aria-label"?: string;
      }
  );

export function Button({ variant = "primary", size = "md", className, children, ...rest }: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("to" in rest && rest.to) {
    return (
      <Link to={rest.to} className={classes}>
        {children}
      </Link>
    );
  }

  if ("href" in rest && rest.href) {
    const { href, target, rel } = rest;
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Registration CTA resolved against the central config — never a dead link. */
export function RegisterButton({
  size = "lg",
  className,
  label = "REGISTER NOW",
}: {
  size?: Size;
  className?: string;
  label?: string;
}) {
  const url = getRegistrationUrl();

  if (!url) {
    return (
      <Button
        size={size}
        className={className}
        onClick={() =>
          document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        FORM LINK SOON
      </Button>
    );
  }

  return (
    <Button
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}