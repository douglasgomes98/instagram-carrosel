import { toPng } from "html-to-image";
import { Check, Download } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ScaledSlide } from "../components/ScaledSlide";
import { carousel } from "../lib/carousel";
import type { PipelineImage } from "../lib/pipeline";
import {
  buildSlideData,
  createSlideConfig,
  EDITABLE_FIELDS,
  readField,
  type SlideConfig,
  type SlideTemplateType,
  TEMPLATE_OPTIONS,
  templateAcceptsImage,
} from "../lib/slides";
import { SlideTemplateRenderer } from "../templates";

type CreateStepProps = {
  images: PipelineImage[];
  slideConfigs: Record<string, SlideConfig>;
  setSlideConfigs: React.Dispatch<
    React.SetStateAction<Record<string, SlideConfig>>
  >;
};

export function CreateStep({
  images,
  slideConfigs,
  setSlideConfigs,
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
  const activeConfig = activeImage
    ? (slideConfigs[activeImage.id] ?? createSlideConfig())
    : createSlideConfig();

  const slidesData = useMemo(
    () =>
      visibleImages.map((image) => {
        const config = slideConfigs[image.id] ?? createSlideConfig();
        return buildSlideData(config, image.cropped?.url);
      }),
    [visibleImages, slideConfigs],
  );

  const selectedSlide = slidesData[activeIndex];
  const editableFields = EDITABLE_FIELDS[activeConfig.templateId];

  function updateActiveConfig(next: Partial<SlideConfig>) {
    if (!activeImage) return;
    const id = activeImage.id;
    setSlideConfigs((current) => ({
      ...current,
      [id]: { ...(current[id] ?? createSlideConfig()), ...next },
    }));
  }

  function setActiveTemplate(templateId: SlideTemplateType) {
    updateActiveConfig({ templateId, overrides: {} });
  }

  function updateActiveField(key: string, value: string) {
    updateActiveConfig({
      overrides: { ...activeConfig.overrides, [key]: value },
    });
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
            <dd>{slidesData.length} peças</dd>
          </div>
          <div>
            <dt>Saída</dt>
            <dd>PNG · alta qualidade</dd>
          </div>
        </dl>

        <div className="text-form">
          <p className="eyebrow">TEMPLATE DO SLIDE {activeIndex + 1}</p>
          <label className="field" htmlFor="slide-template-select">
            <span>Template</span>
            <select
              id="slide-template-select"
              value={activeConfig.templateId}
              onChange={(event) =>
                setActiveTemplate(event.target.value as SlideTemplateType)
              }
            >
              {TEMPLATE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {!templateAcceptsImage(activeConfig.templateId) ? (
            <p className="field-hint">
              Este template não usa a foto recortada.
            </p>
          ) : null}

          <p className="eyebrow">TEXTO DO SLIDE {activeIndex + 1}</p>
          {editableFields.map((field) => {
            const fieldId = `slide-field-${field.key}`;
            return (
              <label className="field" key={field.key} htmlFor={fieldId}>
                <span>{field.label}</span>
                {field.kind === "textarea" ? (
                  <textarea
                    id={fieldId}
                    rows={3}
                    value={readField(selectedSlide, field.key)}
                    onChange={(event) =>
                      updateActiveField(field.key, event.target.value)
                    }
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    id={fieldId}
                    type="text"
                    value={readField(selectedSlide, field.key)}
                    onChange={(event) =>
                      updateActiveField(field.key, event.target.value)
                    }
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            );
          })}
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
              Slide {activeIndex + 1} de {slidesData.length}
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
          <ScaledSlide className="canvas-preview">
            <SlideTemplateRenderer data={selectedSlide} />
          </ScaledSlide>
          <div className="export-canvas" aria-hidden="true">
            <div
              ref={(node) => {
                canvasRef.current =
                  node?.firstElementChild as HTMLElement | null;
              }}
            >
              <SlideTemplateRenderer data={selectedSlide} />
            </div>
          </div>
        </div>
      </section>

      <aside className="slides-panel">
        <div className="slides-heading">
          <span className="eyebrow">SEQUÊNCIA</span>
          <span>{slidesData.length}</span>
        </div>
        <div className="slide-list">
          {slidesData.map((slide, index) => (
            <button
              type="button"
              className={
                activeIndex === index ? "thumbnail selected" : "thumbnail"
              }
              onClick={() => setSelectedIndex(index)}
              key={visibleImages[index]?.id ?? index}
              aria-label={`Selecionar slide ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <span className="thumbnail-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ScaledSlide className="thumbnail-canvas">
                <SlideTemplateRenderer data={slide} />
              </ScaledSlide>
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
