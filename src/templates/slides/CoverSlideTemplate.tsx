import { SlideBadge } from "../atoms/SlideBadge";
import { SlideCard } from "../atoms/SlideCard";
import { SlideFooter } from "../atoms/SlideFooter";
import { SlideHeader } from "../atoms/SlideHeader";
import type { CoverSlideData } from "../types";

type CoverSlideTemplateProps = {
  data: CoverSlideData;
};

export function CoverSlideTemplate({ data }: CoverSlideTemplateProps) {
  const variant =
    data.variant ?? (data.imageUrl ? "hero-dark" : "editorial-cream");
  const theme =
    data.theme ?? (variant === "hero-dark" ? "house-green" : "cream");

  // Variant 1: Hero Dark (Cinematic image + House Green with scrim)
  if (variant === "hero-dark") {
    return (
      <article className="post-slide post-theme-house-green">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              zIndex: 0,
            }}
          />
        ) : null}

        {/* Cinematic Scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(30, 57, 50, 0.45) 0%, rgba(30, 57, 50, 0.15) 30%, rgba(30, 57, 50, 0.95) 85%, #1E3932 100%)",
            zIndex: 1,
          }}
        />

        <div className="post-safe-area">
          <SlideHeader
            config={
              data.header ?? {
                kicker: data.kicker ?? "GUIA EXCLUSIVO",
                symbol: "✣",
              }
            }
            theme="house-green"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: "auto",
              marginBottom: 44,
            }}
          >
            {data.badge ? (
              <SlideBadge variant={data.badgeVariant ?? "green-accent"}>
                {data.badge}
              </SlideBadge>
            ) : null}

            <h1
              className="post-display-headline post-display-mega"
              style={{ color: "#ffffff" }}
            >
              {data.title}
            </h1>

            {data.subtitle ? (
              <p
                className="post-body-text"
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  maxWidth: 820,
                  fontSize: 28,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {data.subtitle}
              </p>
            ) : null}
          </div>

          <SlideFooter
            config={
              data.footer ?? {
                handle: "@seuperfil",
                actionText: "Deslize para ler",
                showSwipeArrow: true,
              }
            }
            theme="house-green"
          />
        </div>
      </article>
    );
  }

  // Variant 2: Editorial Cream (Warm canvas with Starbucks Green & editorial elegance)
  if (variant === "editorial-cream") {
    return (
      <article className="post-slide post-theme-cream">
        <div className="post-safe-area">
          <SlideHeader
            config={
              data.header ?? {
                kicker: data.kicker ?? "EDIÇÃO ESPECIAL",
                symbol: "✦",
              }
            }
            theme="cream"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              marginTop: 32,
              marginBottom: 24,
            }}
          >
            {data.badge ? (
              <SlideBadge variant={data.badgeVariant ?? "green-light"}>
                {data.badge}
              </SlideBadge>
            ) : null}

            <h1
              className="post-display-headline post-display-mega"
              style={{ color: "var(--post-starbucks-green)" }}
            >
              {data.title}
            </h1>

            {data.subtitle ? (
              <p
                className="post-body-text"
                style={{
                  color: "var(--post-text-black)",
                  fontSize: 30,
                  lineHeight: 1.45,
                  margin: 0,
                  maxWidth: 860,
                }}
              >
                {data.subtitle}
              </p>
            ) : null}
          </div>

          {data.imageUrl ? (
            <div
              style={{
                flex: 1,
                minHeight: 400,
                borderRadius: "var(--post-radius-card)",
                overflow: "hidden",
                boxShadow: "var(--post-shadow-card-elevated)",
                marginBottom: 32,
              }}
            >
              <img
                src={data.imageUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <SlideCard
              theme="ceramic"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "28px 36px",
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  color: "var(--post-green-accent)",
                }}
              >
                ★
              </span>
              <span
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "var(--post-text-black)",
                }}
              >
                Conteúdo prático estruturado para transformar seus resultados.
              </span>
            </SlideCard>
          )}

          <SlideFooter
            config={
              data.footer ?? {
                handle: "@seuperfil",
                actionText: "Começar leitura",
                showSwipeArrow: true,
              }
            }
            theme="cream"
          />
        </div>
      </article>
    );
  }

  // Variant 3: Split Feature (40% photo / 60% House Green content card)
  return (
    <article className={`post-slide post-theme-${theme}`}>
      <div className="post-safe-area">
        <SlideHeader config={data.header} theme={theme} />

        <div
          style={{
            display: "grid",
            gridTemplateRows: "460px 1fr",
            gap: 24,
            marginTop: 24,
            marginBottom: 24,
            flex: 1,
          }}
        >
          {data.imageUrl ? (
            <div
              style={{
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
            theme="house-green"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 48px",
              gap: 20,
            }}
          >
            {data.badge ? (
              <SlideBadge variant={data.badgeVariant ?? "gold"}>
                {data.badge}
              </SlideBadge>
            ) : null}
            <h1
              className="post-display-headline post-display-xl"
              style={{ color: "#ffffff" }}
            >
              {data.title}
            </h1>
            {data.subtitle ? (
              <p
                style={{
                  fontFamily: "var(--post-font-body)",
                  fontSize: 24,
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.subtitle}
              </p>
            ) : null}
          </SlideCard>
        </div>

        <SlideFooter config={data.footer} theme={theme} />
      </div>
    </article>
  );
}
