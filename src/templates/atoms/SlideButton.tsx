import type { CSSProperties, ReactNode } from "react";
import type { SlideButtonVariant } from "../types";

type SlideButtonProps = {
  children: ReactNode;
  variant?: SlideButtonVariant;
  className?: string;
  icon?: ReactNode;
  style?: CSSProperties;
};

const VARIANT_CLASS_MAP: Record<SlideButtonVariant, string> = {
  primary: "post-button-primary",
  outline: "post-button-outline",
  inverted: "post-button-inverted",
  "outline-white": "post-button-outline-white",
  black: "post-button-black",
};

export function SlideButton({
  children,
  variant = "primary",
  className = "",
  icon,
  style,
}: SlideButtonProps) {
  const variantClass = VARIANT_CLASS_MAP[variant] ?? "post-button-primary";

  return (
    <div className={`post-button ${variantClass} ${className}`} style={style}>
      {icon ? <span className="post-button-icon">{icon}</span> : null}
      <span>{children}</span>
    </div>
  );
}
