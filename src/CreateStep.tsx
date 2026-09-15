import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Check, Download } from "lucide-react";
import { carousel, type Slide } from "./carousel";
import type { PipelineImage, PostText } from "./pipeline";
import { ScaledSlide } from "./ScaledSlide";
import { SlideCanvas } from "./SlideCanvas";

const EMPTY_TEXT: PostText = { kicker: "", title: "", footer: "" };

type CreateStepProps = {
  images: PipelineImage[];
  postTexts: Record<string, PostText>;
  setPostTexts: React.Dispatch<React.SetStateAction<Record<string, PostText>>>;
};

export function CreateStep({
  images,
  postTexts,
  setPostTexts,
}: CreateStepProps) {
  const visibleImages = useMemo(
    () => images.filter((image) => !!image.cropped),
    [images],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadState, setDownloadState] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const canvasRef = useRef<HTMLElement>(null);

  const activeIndex = Math.min(
    selectedIndex,
    Math.max(visibleImages.length - 1, 0),
  );
  const activeImage = visibleImages[activeIndex];
  const activeText = activeImage
    ? (postTexts[activeImage.id] ?? EMPTY_TEXT)
    : EMPTY_TEXT;

  const slides: Slide[] = useMemo(
    () =>
      visibleImages.map((image, index) => {
        const text = postTexts[image.id] ?? EMPTY_TEXT;
        return {
          id: index + 1,
          type: "cover",
          kicker: text.kicker,
          title: text.title,
          footer: text.footer,
          image: image.cropped?.url,
        };
      }),
    [visibleImages, postTexts],
  );

  const selectedSlide = slides[activeIndex];

  function updateActiveText(field: keyof PostText, value: string) {
    if (!activeImage) return;
    const id = activeImage.id;
    setPostTexts((current) => ({
      ...current,
      [id]: { ...(current[id] ?? EMPTY_TEXT), [field]: value },
    }));
  }

  async function downloadSlide() {
    if (!canvasRef.current || downloadState === "saving") return;

    setDownloadState("saving");
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(canvasRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
      });
      const link = document.createElement("a");
      link.download = `${carousel.slug}-${String(activeIndex + 1).padStart(2, "0")}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadState("saved");
      window.setTimeout(() => setDownloadState("idle"), 1800);
    } catch (error) {
      console.error("Não foi possível exportar o slide.", error);
      setDownloadState("idle");
    }
  }

  if (!selectedSlide) {
    return (
      <section className="future-tool">
        <p className="eyebrow">CRIAR POSTS</p>
        <h1>Nenhuma imagem recortada</h1>
        <p>Volte à etapa de recorte e confirme pelo menos uma imagem.</p>
      </section>
    );
  }

  return (
    <section className="studio">
      <aside className="project-panel">
        <div>
          <p className="eyebrow">CARROSSEL ATUAL</p>
          <h1>{carousel.title}</h1>
          <p className="project-path">carousels/{carousel.slug}</p>
        </div>

        <dl className="project-meta">
          <div>
            <dt>Formato</dt>
            <dd>Retrato · 4:5</dd>
          </div>
          <div>
            <dt>Slides</dt>
            <dd>{slides.length} peças</dd>
          </div>
          <div>
            <dt>Saída</dt>
            <dd>PNG · alta qualidade</dd>
          </div>
        </dl>

        <div className="text-form">
          <p className="eyebrow">TEXTO DO SLIDE {activeIndex + 1}</p>
          <label className="field">
            <span>Kicker</span>
            <input
              type="text"
              value={activeText.kicker}
              onChange={(event) =>
                updateActiveText("kicker", event.target.value)
              }
              placeholder="Ex.: GUIA DE MERCADO · 01"
            />
          </label>
          <label className="field">
            <span>Título</span>
            <textarea
              rows={3}
              value={activeText.title}
              onChange={(event) =>
                updateActiveText("title", event.target.value)
              }
              placeholder="Título do slide"
            />
          </label>
          <label className="field">
            <span>Rodapé</span>
            <input
              type="text"
              value={activeText.footer}
              onChange={(event) =>
                updateActiveText("footer", event.target.value)
              }
              placeholder="Texto de rodapé"
            />
          </label>
        </div>
      </aside>

      <section
        className="preview-area"
        aria-label="Prévia do slide selecionado"
      >
        <div className="preview-heading">
          <div>
            <span className="eyebrow">PRÉVIA</span>
            <strong>
              Slide {activeIndex + 1} de {slides.length}
            </strong>
          </div>
          <button
            className="download-button"
            type="button"
            onClick={downloadSlide}
            disabled={downloadState === "saving"}
          >
            {downloadState === "saved" ? (
              <Check size={18} />
            ) : (
              <Download size={18} />
            )}
            {downloadState === "saving"
              ? "Preparando…"
              : downloadState === "saved"
                ? "Baixado"
                : "Baixar PNG"}
          </button>
        </div>

        <div className="canvas-stage">
          <ScaledSlide className="canvas-preview" slide={selectedSlide} />
          <div className="export-canvas" aria-hidden="true">
            <div
              ref={(node) => {
                canvasRef.current =
                  node?.firstElementChild as HTMLElement | null;
              }}
            >
              <SlideCanvas slide={selectedSlide} />
            </div>
          </div>
        </div>
      </section>

      <aside className="slides-panel">
        <div className="slides-heading">
          <span className="eyebrow">SEQUÊNCIA</span>
          <span>{slides.length}</span>
        </div>
        <div className="slide-list">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={
                activeIndex === index ? "thumbnail selected" : "thumbnail"
              }
              onClick={() => setSelectedIndex(index)}
              key={visibleImages[index]?.id ?? slide.id}
              aria-label={`Selecionar slide ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <span className="thumbnail-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ScaledSlide className="thumbnail-canvas" slide={slide} />
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
