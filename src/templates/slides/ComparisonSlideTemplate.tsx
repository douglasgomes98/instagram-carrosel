import { Check, X } from "lucide-react";
import { SlideBadge } from "../atoms/SlideBadge";
import { SlideCard } from "../atoms/SlideCard";
import { SlideFooter } from "../atoms/SlideFooter";
import { SlideHeader } from "../atoms/SlideHeader";
import type { ComparisonSlideData } from "../types";

type ComparisonSlideTemplateProps = {
  data: ComparisonSlideData;
};

export function ComparisonSlideTemplate({
  data,
}: ComparisonSlideTemplateProps) {
  const theme = data.theme ?? "cream";
  const isDark = theme === "house-green";

  return (
    <article className={`post-slide post-theme-${theme}`}>
      <div className="post-safe-area">
        <SlideHeader
          config={
            data.header ?? {
              kicker: data.kicker ?? "COMPARAÇÃO",
              symbol: "⚖",
            }
          }
          theme={theme}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <h2
            className="post-display-headline post-display-lg"
            style={{
              color: isDark ? "#ffffff" : "var(--post-starbucks-green)",
            }}
          >
            {data.title}
          </h2>

          {data.subtitle ? (
            <p
              style={{
                fontFamily: "var(--post-font-body)",
                fontSize: 22,
                color: isDark
                  ? "rgba(255,255,255,0.75)"
                  : "var(--post-text-black-soft)",
                margin: 0,
              }}
            >
              {data.subtitle}
            </p>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 12,
            }}
          >
            {/* Left Side */}
            <SlideCard
              theme={data.left.isPositive ? "white" : "ceramic"}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                padding: "36px 30px",
                border: data.left.isPositive
                  ? "2px solid var(--post-green-accent)"
                  : "1px solid var(--post-ceramic)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <SlideBadge
                  variant={
                    data.left.tagVariant ??
                    (data.left.isPositive ? "green-accent" : "outline-dark")
                  }
                >
                  {data.left.tag}
                </SlideBadge>
                {data.left.isPositive ? (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--post-green-light)",
                      color: "var(--post-starbucks-green)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Check size={20} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--post-red-tint)",
                      color: "var(--post-red)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <X size={20} />
                  </div>
                )}
              </div>

              <h3
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--post-text-black)",
                  margin: 0,
                }}
              >
                {data.left.title}
              </h3>

              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: 0,
                  margin: 0,
                  listStyle: "none",
                }}
              >
                {data.left.points.map((point) => (
                  <li
                    key={point}
                    style={{
                      fontFamily: "var(--post-font-body)",
                      fontSize: 19,
                      lineHeight: 1.45,
                      color: "var(--post-text-black-soft)",
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        color: data.left.isPositive
                          ? "var(--post-green-accent)"
                          : "var(--post-red)",
                      }}
                    >
                      {data.left.isPositive ? "✓" : "×"}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {data.left.verdict ? (
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 16,
                    borderTop: "1px solid var(--post-ceramic)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--post-text-black)",
                  }}
                >
                  {data.left.verdict}
                </div>
              ) : null}
            </SlideCard>

            {/* Right Side */}
            <SlideCard
              theme={data.right.isPositive ? "white" : "ceramic"}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                padding: "36px 30px",
                border: data.right.isPositive
                  ? "2px solid var(--post-green-accent)"
                  : "1px solid var(--post-ceramic)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <SlideBadge
                  variant={
                    data.right.tagVariant ??
                    (data.right.isPositive ? "green-accent" : "outline-dark")
                  }
                >
                  {data.right.tag}
                </SlideBadge>
                {data.right.isPositive ? (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--post-green-light)",
                      color: "var(--post-starbucks-green)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Check size={20} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--post-red-tint)",
                      color: "var(--post-red)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <X size={20} />
                  </div>
                )}
              </div>

              <h3
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--post-text-black)",
                  margin: 0,
                }}
              >
                {data.right.title}
              </h3>

              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: 0,
                  margin: 0,
                  listStyle: "none",
                }}
              >
                {data.right.points.map((point) => (
                  <li
                    key={point}
                    style={{
                      fontFamily: "var(--post-font-body)",
                      fontSize: 19,
                      lineHeight: 1.45,
                      color: "var(--post-text-black-soft)",
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        color: data.right.isPositive
                          ? "var(--post-green-accent)"
                          : "var(--post-red)",
                      }}
                    >
                      {data.right.isPositive ? "✓" : "×"}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {data.right.verdict ? (
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 16,
                    borderTop: "1px solid var(--post-ceramic)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--post-text-black)",
                  }}
                >
                  {data.right.verdict}
                </div>
              ) : null}
            </SlideCard>
          </div>
        </div>

        <SlideFooter config={data.footer} theme={theme} />
      </div>
    </article>
  );
}
