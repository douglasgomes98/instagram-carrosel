import { Bookmark, Send } from "lucide-react";
import type { SlideFooterConfig, SlideTheme } from "../types";

type SlideFooterProps = {
  config?: SlideFooterConfig;
  theme?: SlideTheme;
  className?: string;
};

export function SlideFooter({ config, className = "" }: SlideFooterProps) {
  if (!config) return null;

  return (
    <footer className={`post-footer ${className}`}>
      <div className="post-footer-handle">
        {config.avatarUrl ? (
          <img
            src={config.avatarUrl}
            alt=""
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <span>{config.handle ?? config.brandName ?? ""}</span>
      </div>

      <div className="post-footer-action">
        {config.actionText ? <span>{config.actionText}</span> : null}
        {config.showSwipeArrow ? (
          <span className="post-swipe-arrow" aria-hidden="true">
            →
          </span>
        ) : null}
        {!config.showSwipeArrow && !config.actionText ? (
          <div style={{ display: "flex", gap: 14, opacity: 0.8 }}>
            <Bookmark size={24} />
            <Send size={24} />
          </div>
        ) : null}
      </div>
    </footer>
  );
}
