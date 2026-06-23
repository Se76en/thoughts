import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-muted-foreground">{label}</label>
      )}
      <input
        className={`rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 ${className}`}
        {...props}
      />
    </div>
  );
}
