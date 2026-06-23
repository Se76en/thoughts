import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
}

export function Button({ children, variant = "primary", href, className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.97]";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover",
    secondary:
      "border border-border text-foreground hover:border-accent/30 hover:bg-accent-muted",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
