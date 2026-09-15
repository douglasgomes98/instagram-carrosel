import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { SlideBadge } from "../atoms/SlideBadge";
import { SlideButton } from "../atoms/SlideButton";
import { SlideCard } from "../atoms/SlideCard";
import { SlideFooter } from "../atoms/SlideFooter";
import { SlideHeader } from "../atoms/SlideHeader";
import type { CtaSlideData } from "../types";

type CtaSlideTemplateProps = {
  data: CtaSlideData;
};

export function CtaSlideTemplate({ data }: CtaSlideTemplateProps) {
  const variant = data.variant ?? "profile-action";
  const theme =
    data.theme ?? (variant === "minimal-brand" ? "house-green" : "cream");
  const isDark = theme === "house-green";

  // Variant 1: Profile & Action
  if (variant === "profile-action") {
    return (
      <article className={`post-slide post-theme-${theme}`}>
        <div className="post-safe-area">
          <SlideHeader
            config={
              data.header ?? {
                kicker: data.kicker ?? "CONSIDERAÇÕES FINAIS",
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
            }}
          >
            {data.badge ? (
              <SlideBadge variant="green-light">{data.badge}</SlideBadge>
            ) : null}

            <h2
              className="post-display-headline post-display-xl"
              style={{ color: "var(--post-starbucks-green)" }}
            >
              {data.title}
            </h2>

            {data.body ? (
              <p
                className="post-body-text"
                style={{
                  fontSize: 26,
                  lineHeight: 1.5,
                  margin: 0,
                  color: "var(--post-text-black)",
                }}
              >
                {data.body}
              </p>
            ) : null}

            {/* Profile Highlight Card */}
            <SlideCard
              theme="white"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "28px 32px",
                marginTop: 8,
              }}
            >
              {data.profileAvatar ? (
                <img
                  src={data.profileAvatar}
                  alt=""
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    backgroundColor: "var(--post-green-light)",
                    color: "var(--post-starbucks-green)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: 28,
                  }}
                >
                  ✦
                </div>
              )}

              <div style={{ flex: 1 }}>
                <strong
                  style={{
                    display: "block",
                    fontFamily: "var(--post-font-body)",
                    fontSize: 24,
                    color: "var(--post-text-black)",
                  }}
                >
                  {data.profileName ?? "Seu Nome / Marca"}
                </strong>
                <span
                  style={{
                    fontSize: 18,
                    color: "var(--post-text-black-soft)",
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  {data.profileRole ?? "Especialista & Criador de Conteúdo"}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    color: "var(--post-green-accent)",
                    fontWeight: 600,
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  {data.profileHandle ?? "@seuperfil"}
                </span>
              </div>
            </SlideCard>

            <div style={{ marginTop: 12 }}>
              <SlideButton
                variant={data.ctaButtonVariant ?? "primary"}
                style={{ width: "100%", padding: "20px 36px", fontSize: 24 }}
              >
                {data.ctaButtonText ?? "Siga para mais conteúdos"}
              </SlideButton>
            </div>
          </div>

          <SlideFooter
            config={
              data.footer ?? {
                handle: data.profileHandle ?? "@seuperfil",
                actionText: "Salve este post",
              }
            }
            theme={theme}
          />
        </div>
      </article>
    );
  }

  // Variant 2: Save and Share Focus
  if (variant === "save-and-share") {
    return (
      <article className={`post-slide post-theme-${theme}`}>
        <div className="post-safe-area">
          <SlideHeader config={data.header} theme={theme} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              marginTop: "auto",
              marginBottom: "auto",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.12)"
                  : "var(--post-green-light)",
                color: isDark
                  ? "var(--post-gold)"
                  : "var(--post-starbucks-green)",
                display: "grid",
                placeItems: "center",
                fontSize: 42,
              }}
            >
              ★
            </div>

            <h2
              className="post-display-headline post-display-xl"
              style={{
                color: isDark ? "#ffffff" : "var(--post-starbucks-green)",
                maxWidth: 820,
              }}
            >
              {data.title}
            </h2>

            {data.body ? (
              <p
                className="post-body-text"
                style={{
                  fontSize: 24,
                  maxWidth: 760,
                  color: isDark
                    ? "rgba(255,255,255,0.8)"
                    : "var(--post-text-black-soft)",
                  margin: 0,
                }}
              >
                {data.body}
              </p>
            ) : null}

            {/* 4 Instagram Actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                width: "100%",
                marginTop: 16,
              }}
            >
              {[
                { icon: <Heart size={28} />, label: "Curta" },
                { icon: <MessageCircle size={28} />, label: "Comente" },
                { icon: <Send size={28} />, label: "Compartilhe" },
                { icon: <Bookmark size={28} />, label: "Salve" },
              ].map((action) => (
                <SlideCard
                  key={action.label}
                  theme={isDark ? "house-green" : "white"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    padding: "24px 16px",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.12)"
                      : undefined,
                  }}
                >
                  <div
                    style={{
                      color: isDark
                        ? "var(--post-gold)"
                        : "var(--post-green-accent)",
                    }}
                  >
                    {action.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--post-font-body)",
                      fontSize: 18,
                      fontWeight: 600,
                      color: isDark ? "#ffffff" : "var(--post-text-black)",
                    }}
                  >
                    {action.label}
                  </span>
                </SlideCard>
              ))}
            </div>

            <div style={{ marginTop: 20, width: "100%" }}>
              <SlideButton
                variant={isDark ? "inverted" : "primary"}
                style={{ width: "100%", padding: "20px 36px", fontSize: 24 }}
              >
                {data.ctaButtonText ?? "Acompanhe novas edições"}
              </SlideButton>
            </div>
          </div>

          <SlideFooter config={data.footer} theme={theme} />
        </div>
      </article>
    );
  }

  // Variant 3: Minimal Brand (House Green or Cream)
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
          {data.badge ? (
            <SlideBadge variant={isDark ? "gold" : "green-light"}>
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

          {data.body ? (
            <p
              className="post-body-text"
              style={{
                fontSize: 26,
                color: isDark
                  ? "rgba(255,255,255,0.85)"
                  : "var(--post-text-black)",
                margin: 0,
              }}
            >
              {data.body}
            </p>
          ) : null}

          <div style={{ marginTop: 16 }}>
            <SlideButton
              variant={isDark ? "inverted" : "primary"}
              style={{ padding: "20px 48px", fontSize: 24 }}
            >
              {data.ctaButtonText ?? "Saiba mais"}
            </SlideButton>
          </div>
        </div>

        <SlideFooter config={data.footer} theme={theme} />
      </div>
    </article>
  );
}
