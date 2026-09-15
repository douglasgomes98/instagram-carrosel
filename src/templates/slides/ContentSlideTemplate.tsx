import { SlideBadge } from "../atoms/SlideBadge";
import { SlideCard } from "../atoms/SlideCard";
import { SlideFooter } from "../atoms/SlideFooter";
import { SlideHeader } from "../atoms/SlideHeader";
import type { ContentSlideData } from "../types";

type ContentSlideTemplateProps = {
  data: ContentSlideData;
};

export function ContentSlideTemplate({ data }: ContentSlideTemplateProps) {
  const variant = data.variant ?? "headline-text";
  const theme = data.theme ?? "cream";
  const isDark = theme === "house-green";

  const bodyParagraphs = Array.isArray(data.body)
    ? data.body
    : data.body
      ? [data.body]
      : [];

  // Variant 1: Headline & Text
  if (variant === "headline-text") {
    return (
      <article className={`post-slide post-theme-${theme}`}>
        <div className="post-safe-area">
          <SlideHeader
            config={
              data.header ?? {
                kicker: data.kicker ?? "CONCEITO CHAVE",
                symbol: "✣",
              }
            }
            theme={theme}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              marginTop: "auto",
              marginBottom: "auto",
              maxWidth: 880,
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
              className="post-display-headline post-display-xl"
              style={{
                color: isDark ? "#ffffff" : "var(--post-starbucks-green)",
              }}
            >
              {data.title}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {bodyParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="post-body-text"
                  style={{
                    fontSize: 26,
                    lineHeight: 1.55,
                    margin: 0,
                    color: isDark
                      ? "rgba(255, 255, 255, 0.85)"
                      : "var(--post-text-black)",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <SlideFooter
            config={
              data.footer ?? {
                handle: "@seuperfil",
                showSwipeArrow: true,
              }
            }
            theme={theme}
          />
        </div>
      </article>
    );
  }

  // Variant 2: Quote Spotlight
  if (variant === "quote-spotlight") {
    return (
      <article className={`post-slide post-theme-${theme}`}>
        <div className="post-safe-area">
          <SlideHeader config={data.header} theme={theme} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: "auto 0",
              gap: 32,
            }}
          >
            <div
              style={{
                fontFamily: "var(--post-font-display)",
                fontSize: 100,
                lineHeight: 0.8,
                color: "var(--post-green-accent)",
              }}
              aria-hidden="true"
            >
              “
            </div>

            <blockquote
              className="post-display-headline post-display-lg"
              style={{
                fontSize: 48,
                lineHeight: 1.3,
                color: isDark ? "#ffffff" : "var(--post-house-green)",
                margin: 0,
              }}
            >
              {data.title}
            </blockquote>

            {bodyParagraphs[0] ? (
              <p
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 24,
                  lineHeight: 1.5,
                  color: isDark
                    ? "rgba(255, 255, 255, 0.8)"
                    : "var(--post-text-black-soft)",
                  margin: 0,
                }}
              >
                {bodyParagraphs[0]}
              </p>
            ) : null}

            {data.quoteAuthor ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginTop: 16,
                  paddingTop: 24,
                  borderTop: isDark
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid var(--post-ceramic)",
                }}
              >
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt=""
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "var(--post-green-light)",
                      color: "var(--post-starbucks-green)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 22,
                    }}
                  >
                    ★
                  </div>
                )}
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 22,
                      fontFamily: "var(--post-font-body)",
                      color: isDark ? "#ffffff" : "var(--post-text-black)",
                    }}
                  >
                    {data.quoteAuthor}
                  </strong>
                  {data.quoteRole ? (
                    <span
                      style={{
                        fontSize: 18,
                        color: isDark
                          ? "rgba(255,255,255,0.65)"
                          : "var(--post-text-black-soft)",
                      }}
                    >
                      {data.quoteRole}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <SlideFooter config={data.footer} theme={theme} />
        </div>
      </article>
    );
  }

  // Variant 3: Photo Card & Text
  return (
    <article className={`post-slide post-theme-${theme}`}>
      <div className="post-safe-area">
        <SlideHeader config={data.header} theme={theme} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            margin: "auto 0",
          }}
        >
          {data.imageUrl ? (
            <div
              style={{
                width: "100%",
                height: 480,
                borderRadius: "var(--post-radius-card)",
                overflow: "hidden",
                boxShadow: "var(--post-shadow-card)",
              }}
            >
              <img
                src={data.imageUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : null}

          <SlideCard
            theme={isDark ? "white" : "white"}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {data.badge ? (
              <SlideBadge variant={data.badgeVariant ?? "green-accent"}>
                {data.badge}
              </SlideBadge>
            ) : null}

            <h2
              className="post-display-headline post-display-md"
              style={{ color: "var(--post-starbucks-green)" }}
            >
              {data.title}
            </h2>

            {bodyParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="post-body-text"
                style={{
                  fontSize: 22,
                  margin: 0,
                  color: "var(--post-text-black)",
                }}
              >
                {paragraph}
              </p>
            ))}
          </SlideCard>
        </div>

        <SlideFooter config={data.footer} theme={theme} />
      </div>
    </article>
  );
}
