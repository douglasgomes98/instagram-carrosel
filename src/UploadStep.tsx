import { useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { MAX_IMAGES, MIN_IMAGES, type PipelineImage } from "./pipeline";
import { formatBytes } from "./imageOptimizer";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadStepProps = {
  images: PipelineImage[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
};

export function UploadStep({
  images,
  onAddFiles,
  onRemove,
  onContinue,
}: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const atCapacity = images.length >= MAX_IMAGES;
  const canContinue = images.length >= MIN_IMAGES;

  function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) =>
      ACCEPTED_TYPES.has(file.type),
    );
    if (files.length) onAddFiles(files);
  }

  return (
    <section className="upload-step">
      <div className="upload-heading">
        <div>
          <p className="eyebrow">NOVO CARROSSEL</p>
          <strong>Envie as fotos do carrossel</strong>
        </div>
        <span className="image-count-pill">
          {images.length} / {MAX_IMAGES} imagens
        </span>
      </div>

      <label
        className={
          isDragging || atCapacity
            ? `dropzone dragging${atCapacity ? " disabled" : ""}`
            : "dropzone"
        }
        onDragEnter={(event) => {
          event.preventDefault();
          if (!atCapacity) setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!atCapacity) handleFiles(event.dataTransfer.files);
        }}
      >
        <span className="dropzone-icon">
          <UploadCloud size={26} />
        </span>
        <span>
          <strong>
            {atCapacity ? "Limite de imagens atingido" : "Arraste imagens aqui"}
          </strong>
          <small>
            {atCapacity
              ? `Remova alguma para adicionar outra (máx. ${MAX_IMAGES})`
              : "ou clique para selecionar várias de uma vez"}
          </small>
        </span>
        <span className="dropzone-types">JPG · PNG · WEBP</span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={atCapacity}
          onChange={(event) => {
            if (event.target.files) handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {images.length ? (
        <div className="upload-grid" aria-live="polite">
          {images.map((image) => (
            <article className="upload-item" key={image.id}>
              <img src={image.previewUrl} alt="" />
              <div className="queue-copy">
                <strong title={image.file.name}>{image.file.name}</strong>
                <span>{formatBytes(image.file.size)}</span>
              </div>
              <button
                className="remove-file"
                type="button"
                onClick={() => onRemove(image.id)}
                aria-label={`Remover ${image.file.name}`}
              >
                <X size={16} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-queue" aria-hidden="true">
          <ImagePlus size={28} />
          <span>As fotos que você enviar aparecerão aqui</span>
        </div>
      )}

      <div className="optimize-summary">
        <div className="summary-copy">
          <span>
            <strong>
              {images.length
                ? `${images.length} ${images.length === 1 ? "imagem selecionada" : "imagens selecionadas"}`
                : "Envie pelo menos 1 imagem"}
            </strong>
            <small>
              Um carrossel do Instagram aceita até {MAX_IMAGES} fotos.
            </small>
          </span>
        </div>
        <div className="summary-actions">
          <button
            className="download-button"
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
          >
            Continuar
          </button>
        </div>
      </div>
    </section>
  );
}
