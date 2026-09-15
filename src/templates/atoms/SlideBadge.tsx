import type { ReactNode } from "react";
import type { SlideBadgeVariant } from "../types";

type SlideBadgeProps = {
  children: ReactNode;
  variant?: SlideBadgeVariant;
  className?: string;
};

const VARIANT_CLASS_MAP: Record<SlideBadgeVariant, string> = {
  "green-accent": "post-badge-green-accent",
  "green-light": "post-badge-green-light",
  gold: "post-badge-gold",
  "gold-filled": "post-badge-gold-filled",
  "outline-dark": "post-badge-outline-dark",
  "outline-white": "post-badge-outline-white",
  dark: "post-badge-dark",
};

export function SlideBadge({
  children,
  variant = "green-light",
  className = "",
}: SlideBadgeProps) {
  const variantClass = VARIANT_CLASS_MAP[variant] ?? "post-badge-green-light";

  return (
    <span className={`post-badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
