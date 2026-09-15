import type { SlideHeaderConfig, SlideTheme } from "../types";

type SlideHeaderProps = {
  config?: SlideHeaderConfig;
  theme?: SlideTheme;
  className?: string;
};

export function SlideHeader({
  config,
  theme = "cream",
  className = "",
}: SlideHeaderProps) {
  if (!config) return null;

  const symbolStyle =
    theme === "house-green"
      ? "post-header-symbol-dark"
      : theme === "cream"
        ? "post-header-symbol-green"
        : "post-header-symbol-cream";

  return (
    <header className={`post-header ${className}`}>
      <div className="post-header-left">
        <span
          className={`post-header-symbol ${symbolStyle}`}
          aria-hidden="true"
        >
          {config.symbol ?? "✣"}
        </span>
        {config.kicker ? (
          <span className="post-header-kicker">{config.kicker}</span>
        ) : config.brandName ? (
          <span className="post-header-kicker">{config.brandName}</span>
        ) : null}
      </div>

      {config.slideNumber !== undefined && config.totalSlides ? (
        <span className="post-header-counter">
          {String(config.slideNumber).padStart(2, "0")} /{" "}
          {String(config.totalSlides).padStart(2, "0")}
        </span>
      ) : null}
    </header>
  );
}
