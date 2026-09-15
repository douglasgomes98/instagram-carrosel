import type { CSSProperties, ReactNode } from "react";

type SlideCardProps = {
  children: ReactNode;
  theme?: "white" | "house-green" | "ceramic" | "gold";
  className?: string;
  style?: CSSProperties;
};

const THEME_CLASS_MAP: Record<string, string> = {
  white: "post-card-white",
  "house-green": "post-card-house-green",
  ceramic: "post-card-ceramic",
  gold: "post-card-gold",
};

export function SlideCard({
  children,
  theme = "white",
  className = "",
  style,
}: SlideCardProps) {
  const themeClass = THEME_CLASS_MAP[theme] ?? "post-card-white";

  return (
    <div className={`post-card ${themeClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
