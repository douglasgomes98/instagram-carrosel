import { Check } from "lucide-react";
import { SlideBadge } from "../atoms/SlideBadge";
import { SlideCard } from "../atoms/SlideCard";
import { SlideFooter } from "../atoms/SlideFooter";
import { SlideHeader } from "../atoms/SlideHeader";
import type { ListSlideData } from "../types";

type ListSlideTemplateProps = {
  data: ListSlideData;
};

export function ListSlideTemplate({ data }: ListSlideTemplateProps) {
  const variant = data.variant ?? "numbered-steps";
  const theme = data.theme ?? "cream";
  const isDark = theme === "house-green";

  // Variant 1: Numbered Steps (01, 02, 03...)
  if (variant === "numbered-steps") {
    return (
      <article className={`post-slide post-theme-${theme}`}>
        <div className="post-safe-area">
          <SlideHeader
            config={
              data.header ?? {
                kicker: data.kicker ?? "PASSO A PASSO",
                symbol: "✣",
              }
            }
            theme={theme}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            {data.badge ? (
              <SlideBadge
                variant={
                  data.badgeVariant ?? (isDark ? "green-accent" : "green-light")
                }
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

            {data.subtitle ? (
              <p
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 22,
                  color: isDark
                    ? "rgba(255,255,255,0.75)"
                    : "var(--post-text-black-soft)",
                  margin: "0 0 10px",
                }}
              >
                {data.subtitle}
              </p>
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {data.items.map((item, index) => {
                const stepNum = item.number ?? index + 1;
                const formattedNum = String(stepNum).padStart(2, "0");

                return (
                  <SlideCard
                    key={item.title}
                    theme={isDark ? "house-green" : "white"}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "68px 1fr",
                      gap: 20,
                      alignItems: "flex-start",
                      padding: "24px 28px",
                      border: isDark
                        ? "1px solid rgba(255, 255, 255, 0.12)"
                        : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.12)"
                          : "var(--post-green-light)",
                        color: isDark
                          ? "#ffffff"
                          : "var(--post-starbucks-green)",
                        fontFamily: "var(--post-font-body)",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {formattedNum}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <strong
                          style={{
                            fontFamily: "var(--post-font-body)",
                            fontSize: 24,
                            color: isDark
                              ? "#ffffff"
                              : "var(--post-text-black)",
                          }}
                        >
                          {item.title}
                        </strong>
                        {item.tag ? (
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              padding: "2px 10px",
                              borderRadius: "var(--post-radius-pill)",
                              backgroundColor: "var(--post-green-light)",
                              color: "var(--post-starbucks-green)",
                            }}
                          >
                            {item.tag}
                          </span>
                        ) : null}
                      </div>

                      <p
                        style={{
                          fontFamily: "var(--post-font-body)",
                          fontSize: 20,
                          lineHeight: 1.45,
                          color: isDark
                            ? "rgba(255, 255, 255, 0.8)"
                            : "var(--post-text-black-soft)",
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </SlideCard>
                );
              })}
            </div>
          </div>

          <SlideFooter config={data.footer} theme={theme} />
        </div>
      </article>
    );
  }

  // Variant 2: Card Grid (2x2 or pillars)
  if (variant === "card-grid") {
    return (
      <article className={`post-slide post-theme-${theme}`}>
        <div className="post-safe-area">
          <SlideHeader config={data.header} theme={theme} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: 20,
              marginBottom: 20,
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {data.items.map((item, index) => (
                <SlideCard
                  key={item.title}
                  theme={isDark ? "house-green" : "white"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: "32px 28px",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.12)"
                      : undefined,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "var(--post-green-light)",
                      color: "var(--post-starbucks-green)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {item.number ?? index + 1}
                  </div>
                  <strong
                    style={{
                      fontFamily: "var(--post-font-body)",
                      fontSize: 22,
                      color: isDark ? "#ffffff" : "var(--post-text-black)",
                    }}
                  >
                    {item.title}
                  </strong>
                  <p
                    style={{
                      fontFamily: "var(--post-font-body)",
                      fontSize: 18,
                      lineHeight: 1.45,
                      color: isDark
                        ? "rgba(255, 255, 255, 0.75)"
                        : "var(--post-text-black-soft)",
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </SlideCard>
              ))}
            </div>
          </div>

          <SlideFooter config={data.footer} theme={theme} />
        </div>
      </article>
    );
  }

  // Variant 3: Checklist
  return (
    <article className={`post-slide post-theme-${theme}`}>
      <div className="post-safe-area">
        <SlideHeader config={data.header} theme={theme} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginTop: "auto",
            marginBottom: "auto",
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

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.items.map((item) => (
              <SlideCard
                key={item.title}
                theme="white"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "24px 32px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "var(--post-green-accent)",
                    color: "#ffffff",
                    flex: "none",
                  }}
                >
                  <Check size={24} />
                </div>
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 22,
                      fontFamily: "var(--post-font-body)",
                    }}
                  >
                    {item.title}
                  </strong>
                  {item.description ? (
                    <span
                      style={{
                        fontSize: 18,
                        color: "var(--post-text-black-soft)",
                      }}
                    >
                      {item.description}
                    </span>
                  ) : null}
                </div>
              </SlideCard>
            ))}
          </div>
        </div>

        <SlideFooter config={data.footer} theme={theme} />
      </div>
    </article>
  );
}
