import { SlideBadge } from "../atoms/SlideBadge";
import { SlideCard } from "../atoms/SlideCard";
import { SlideFooter } from "../atoms/SlideFooter";
import { SlideHeader } from "../atoms/SlideHeader";
import type { StatsSlideData } from "../types";

type StatsSlideTemplateProps = {
  data: StatsSlideData;
};

export function StatsSlideTemplate({ data }: StatsSlideTemplateProps) {
  const theme = data.theme ?? "cream";
  const isDark = theme === "house-green";

  return (
    <article className={`post-slide post-theme-${theme}`}>
      <div className="post-safe-area">
        <SlideHeader
          config={
            data.header ?? {
              kicker: data.kicker ?? "MÉTRICA & IMPACTO",
              symbol: "✦",
            }
          }
          theme={theme}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {data.badge ? (
            <SlideBadge
              variant={data.badgeVariant ?? (isDark ? "gold" : "green-light")}
            >
              {data.badge}
            </SlideBadge>
          ) : null}

          <h2
            className="post-display-headline post-display-lg"
            style={{
              color: isDark ? "#ffffff" : "var(--post-starbucks-green)",
            }}
          >
            {data.title}
          </h2>

          {/* Big Featured Metric Card */}
          <SlideCard
            theme={isDark ? "house-green" : "white"}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "44px 40px",
              border: isDark ? "1px solid rgba(255,255,255,0.15)" : undefined,
              boxShadow: "var(--post-shadow-card-elevated)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--post-font-display)",
                fontSize: 104,
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: isDark ? "var(--post-gold)" : "var(--post-green-accent)",
              }}
            >
              {data.highlightMetric}
            </div>

            <div
              style={{
                fontFamily: "var(--post-font-body)",
                fontSize: 26,
                fontWeight: 600,
                color: isDark ? "#ffffff" : "var(--post-text-black)",
              }}
            >
              {data.highlightLabel}
            </div>

            {data.highlightDescription ? (
              <p
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 20,
                  lineHeight: 1.5,
                  color: isDark
                    ? "rgba(255, 255, 255, 0.75)"
                    : "var(--post-text-black-soft)",
                  margin: 0,
                }}
              >
                {data.highlightDescription}
              </p>
            ) : null}
          </SlideCard>

          {/* Secondary Stats Grid */}
          {data.secondaryStats && data.secondaryStats.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${data.secondaryStats.length}, 1fr)`,
                gap: 18,
              }}
            >
              {data.secondaryStats.map((stat) => (
                <SlideCard
                  key={stat.label}
                  theme={isDark ? "house-green" : "ceramic"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "22px 24px",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : undefined,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--post-font-display)",
                      fontSize: 42,
                      fontWeight: 300,
                      color: isDark
                        ? "var(--post-gold)"
                        : "var(--post-starbucks-green)",
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.metric}
                  </span>
                  <strong
                    style={{
                      fontFamily: "var(--post-font-body)",
                      fontSize: 18,
                      color: isDark ? "#ffffff" : "var(--post-text-black)",
                    }}
                  >
                    {stat.label}
                  </strong>
                  {stat.description ? (
                    <span
                      style={{
                        fontSize: 15,
                        color: isDark
                          ? "rgba(255,255,255,0.65)"
                          : "var(--post-text-black-soft)",
                      }}
                    >
                      {stat.description}
                    </span>
                  ) : null}
                </SlideCard>
              ))}
            </div>
          ) : null}
        </div>

        <SlideFooter config={data.footer} theme={theme} />
      </div>
    </article>
  );
}
