import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Check,
  Download,
  FlipHorizontal2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { cropImage } from "./cropImage";
import { CAROUSEL_FORMAT, type PipelineImage } from "./pipeline";

const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;

type CropStepProps = {
  images: PipelineImage[];
  setImages: React.Dispatch<React.SetStateAction<PipelineImage[]>>;
  onContinue: () => void;
  canContinue: boolean;
};

export function CropStep({
  images,
  setImages,
  onContinue,
  canContinue,
}: CropStepProps) {
  const [activeId, setActiveId] = useState<string | null>(
    images.find((image) => !image.cropped)?.id ?? images[0]?.id ?? null,
  );
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const activeImage = images.find((image) => image.id === activeId) ?? null;
  const croppedImages = images.filter((image) => !!image.cropped);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !activeId) return;
    rail
      .querySelector(`[data-image-id="${activeId}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeId intentionally re-triggers this reset.
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipHorizontal(false);
    setCroppedArea(null);
  }, [activeId]);

  async function confirmCrop() {
    if (!activeImage?.optimized || !croppedArea || isSaving) return;
    setIsSaving(true);

    try {
      const blob = await cropImage(
        activeImage.optimized.url,
        croppedArea,
        { width: CAROUSEL_FORMAT.width, height: CAROUSEL_FORMAT.height },
        rotation,
        { horizontal: flipHorizontal, vertical: false },
      );
      const url = URL.createObjectURL(blob);
      const currentId = activeImage.id;

      setImages((current) =>
        current.map((entry) =>
          entry.id === currentId ? { ...entry, cropped: { blob, url } } : entry,
        ),
      );

      const nextPending = images.find(
        (image) => image.id !== currentId && !image.cropped,
      );
      setActiveId(nextPending ? nextPending.id : currentId);
    } catch (error) {
      console.error("Não foi possível recortar a imagem.", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="crop-studio">
      <aside className="crop-formats" aria-label="Imagens do carrossel">
        <div>
          <p className="eyebrow">FORMATO DE SAÍDA</p>
          <h1>Recortar imagens</h1>
          <p className="crop-intro">
            Todas as fotos saem no mesmo formato do carrossel:{" "}
            <strong>
              {CAROUSEL_FORMAT.label} · {CAROUSEL_FORMAT.width} ×{" "}
              {CAROUSEL_FORMAT.height}
            </strong>
            .
          </p>
        </div>

        <div className="slide-list crop-rail" ref={railRef}>
          {images.map((image, index) => (
            <button
              type="button"
              className={`thumbnail${activeId === image.id ? " selected" : ""}${image.cropped ? " done" : ""}`}
              onClick={() => setActiveId(image.id)}
              key={image.id}
              data-image-id={image.id}
              aria-label={`Selecionar imagem ${index + 1}`}
              aria-pressed={activeId === image.id}
            >
              <span className="thumbnail-number">
                {image.cropped ? <Check size={13} /> : index + 1}
              </span>
              <div className="thumbnail-canvas">
                <img
                  src={
                    image.cropped?.url ??
                    image.optimized?.url ??
                    image.previewUrl
                  }
                  alt=""
                />
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="crop-workspace">
        <div className="crop-heading">
          <div>
            <p className="eyebrow">ENQUADRAMENTO</p>
            <strong>{activeImage?.file.name ?? "Selecione uma imagem"}</strong>
          </div>
          <div
            className="crop-progress"
            role="progressbar"
            aria-label="Progresso do recorte"
            aria-valuemin={0}
            aria-valuemax={images.length}
            aria-valuenow={croppedImages.length}
          >
            <div className="crop-progress-track">
              <div
                className="crop-progress-fill"
                style={{
                  width: images.length
                    ? `${(croppedImages.length / images.length) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <span className="crop-progress-count">
              {croppedImages.length} / {images.length}
            </span>
          </div>
        </div>

        <div
          className="crop-frame"
          style={{
            aspectRatio: `${CAROUSEL_FORMAT.width} / ${CAROUSEL_FORMAT.height}`,
          }}
        >
          {activeImage?.optimized ? (
            <Cropper
              image={activeImage.optimized.url}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={CAROUSEL_FORMAT.width / CAROUSEL_FORMAT.height}
              minZoom={1}
              maxZoom={MAX_ZOOM}
              zoomSpeed={0.12}
              showGrid
              cropShape="rect"
              objectFit="contain"
              restrictPosition
              transform={`translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${flipHorizontal ? -1 : 1})`}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={(_, pixels) => setCroppedArea(pixels)}
            />
          ) : (
            <div className="crop-empty">
              <span>Nenhuma imagem selecionada</span>
            </div>
          )}
        </div>

        <div className="crop-controls">
          <div className="zoom-control">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-label="Zoom da imagem"
            />
            <output>{Math.round(zoom * 100)}%</output>
          </div>
          <div className="crop-actions">
            <button
              type="button"
              onClick={() => setRotation((value) => value - 90)}
              aria-label="Girar à esquerda"
            >
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              onClick={() => setRotation((value) => value + 90)}
              aria-label="Girar à direita"
            >
              <RotateCw size={18} />
            </button>
            <button
              type="button"
              className={flipHorizontal ? "active" : ""}
              onClick={() => setFlipHorizontal((value) => !value)}
              aria-label="Espelhar horizontalmente"
              aria-pressed={flipHorizontal}
            >
              <FlipHorizontal2 size={18} />
            </button>
          </div>
        </div>

        <div className="crop-summary">
          <div>
            <strong>
              {CAROUSEL_FORMAT.width} × {CAROUSEL_FORMAT.height} px
            </strong>
            <span>
              {canContinue
                ? "Todas as fotos recortadas"
                : activeImage?.cropped
                  ? "Recorte confirmado"
                  : "Ajuste e confirme"}
            </span>
          </div>
          {canContinue ? (
            <button
              className="download-button"
              type="button"
              onClick={onContinue}
            >
              Continuar
            </button>
          ) : (
            <button
              className="download-button"
              type="button"
              onClick={confirmCrop}
              disabled={!activeImage?.optimized || !croppedArea || isSaving}
            >
              <Download size={18} />
              {isSaving ? "Salvando…" : "Confirmar recorte"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
