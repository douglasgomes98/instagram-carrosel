import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Download,
  FlipHorizontal2,
  ImagePlus,
  RotateCcw,
  RotateCw,
  Upload,
} from "lucide-react";
import { cropImage } from "./cropImage";
import {
  defaultInstagramFormat,
  instagramFormats,
  type InstagramFormat,
} from "./instagramFormats";

const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function CropStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("imagem-instagram");
  const [format, setFormat] = useState<InstagramFormat>(defaultInstagramFormat);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [exportState, setExportState] = useState<"idle" | "saving" | "error">(
    "idle",
  );
  const objectUrlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const resetPosition = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipHorizontal(false);
    setCroppedArea(null);
  }, []);

  function selectFormat(nextFormat: InstagramFormat) {
    setFormat(nextFormat);
    resetPosition();
  }

  function selectImage(file: File | undefined) {
    if (!file || !ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setExportState("error");
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setImage(objectUrl);
    setImageName(file.name.replace(/\.[^/.]+$/, ""));
    setExportState("idle");
    resetPosition();
  }

  async function downloadCrop() {
    if (!image || !croppedArea || exportState === "saving") return;
    setExportState("saving");

    try {
      const blob = await cropImage(
        image,
        croppedArea,
        { width: format.width, height: format.height },
        rotation,
        { horizontal: flipHorizontal, vertical: false },
      );
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${imageName}-${format.id}-${format.width}x${format.height}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setExportState("idle");
    } catch (error) {
      console.error("Não foi possível exportar o recorte.", error);
      setExportState("error");
    }
  }

  return (
    <section className="crop-studio">
      <aside className="crop-formats" aria-label="Formatos do Instagram">
        <div>
          <p className="eyebrow">FORMATO DE SAÍDA</p>
          <h1>Crop para Instagram</h1>
          <p className="crop-intro">
            Escolha o destino antes de enquadrar. O arquivo será exportado no
            tamanho exato.
          </p>
        </div>

        <div className="format-list">
          {instagramFormats.map((option) => (
            <button
              key={option.id}
              type="button"
              className={
                format.id === option.id
                  ? "format-option selected"
                  : "format-option"
              }
              onClick={() => selectFormat(option)}
              aria-pressed={format.id === option.id}
            >
              <span
                className="format-shape"
                style={{ aspectRatio: `${option.width} / ${option.height}` }}
              />
              <span className="format-copy">
                <strong>{option.label}</strong>
                <small>{option.placement}</small>
              </span>
              <span className="format-size">
                {option.width} × {option.height}
              </span>
              {option.recommended ? (
                <span className="recommended-tag">RECOMENDADO</span>
              ) : null}
            </button>
          ))}
        </div>
      </aside>

      <div className="crop-workspace">
        <div className="crop-heading">
          <div>
            <p className="eyebrow">ENQUADRAMENTO</p>
            <strong>{format.label}</strong>
          </div>
          <label className="upload-button">
            <Upload size={17} /> {image ? "Trocar imagem" : "Enviar imagem"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => selectImage(event.target.files?.[0])}
            />
          </label>
        </div>

        <div
          className="crop-frame"
          style={{ aspectRatio: `${format.width} / ${format.height}` }}
        >
          {image ? (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={format.width / format.height}
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
            <label className="crop-empty">
              <ImagePlus size={28} />
              <span>Envie uma imagem para começar</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => selectImage(event.target.files?.[0])}
              />
            </label>
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
            <button
              type="button"
              onClick={resetPosition}
              aria-label="Restaurar ajustes"
            >
              <ImagePlus size={18} />
            </button>
          </div>
        </div>

        <div className="crop-summary">
          <div>
            <strong>
              {format.width} × {format.height} px
            </strong>
            <span>{format.note}</span>
          </div>
          <button
            className="download-button"
            type="button"
            onClick={downloadCrop}
            disabled={!croppedArea || exportState === "saving"}
          >
            <Download size={18} />
            {exportState === "saving"
              ? "Exportando…"
              : exportState === "error"
                ? "Tentar novamente"
                : "Baixar JPG"}
          </button>
        </div>
      </div>
    </section>
  );
}
