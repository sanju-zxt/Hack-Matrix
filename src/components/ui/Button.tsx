import type { MouseEventHandler, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import { getRegistrationUrl } from "../../lib/registration";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex min-h-11 sm:min-h-0 max-w-full items-center justify-center gap-2 whitespace-normal break-words text-center font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-bright select-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-violet to-violet-deep shadow-[0_8px_30px_-6px_rgba(124,108,255,0.55)] hover:shadow-[0_10px_40px_-6px_rgba(124,108,255,0.75)] hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "text-white border border-white/15 bg-white/[0.02] hover:border-violet/60 hover:bg-violet/10 hover:text-violet-bright",
  ghost: "text-white/70 hover:text-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-3 text-sm sm:px-6",
  lg: "min-h-11 px-5 py-3 text-base sm:px-8 sm:py-4",
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

export function RegisterButton({
  size = "lg",
  className,
  label = "REGISTER NOW",
}: {
  size?: Size;
  className?: string;
  label?: string;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const url = getRegistrationUrl();

  if (url) {
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

  const handleFallback = () => {
    const scrollToRegister = () => {
      const target = document.getElementById("register");
      if (!target) return;
      const reducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    };

    if (location.pathname === "/") {
      scrollToRegister();
      if (!document.getElementById("register")) {
        navigate({ pathname: "/", hash: "#register" });
        window.setTimeout(scrollToRegister, 250);
      }
      return;
    }

    navigate("/register");
  };

  return (
    <Button
      size={size}
      className={className}
      onClick={handleFallback}
    >
      FORM LINK SOON
    </Button>
  );
}