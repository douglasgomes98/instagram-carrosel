import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  FileArchive,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  X,
} from "lucide-react";
import { downloadBlob, downloadZip } from "./download";
import { formatBytes, optimizeImage, savingsPercent } from "./imageOptimizer";
import { OPTIMIZE_SETTINGS, type PipelineImage } from "./pipeline";

const MAX_PARALLEL_JOBS = 3;

type OptimizeStepProps = {
  images: PipelineImage[];
  setImages: React.Dispatch<React.SetStateAction<PipelineImage[]>>;
  onRemove: (id: string) => void;
  onContinue: () => void;
  canContinue: boolean;
};

export function OptimizeStep({
  images,
  setImages,
  onRemove,
  onContinue,
  canContinue,
}: OptimizeStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const imagesRef = useRef(images);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const completedImages = useMemo(
    () =>
      images.filter(
        (image) => image.optimizeStatus === "done" && image.optimized,
      ),
    [images],
  );
  const originalTotal = completedImages.reduce(
    (total, image) => total + image.file.size,
    0,
  );
  const outputTotal = completedImages.reduce(
    (total, image) => total + (image.optimized?.blob.size ?? 0),
    0,
  );
  const totalSaving = originalTotal
    ? savingsPercent(originalTotal, outputTotal)
    : 0;

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current) return;
    const pendingIds = imagesRef.current
      .filter(
        (image) =>
          image.optimizeStatus === "waiting" ||
          image.optimizeStatus === "error",
      )
      .map((image) => image.id);
    if (!pendingIds.length) return;
    isProcessingRef.current = true;
    setIsProcessing(true);

    let nextIndex = 0;
    const availableCores = navigator.hardwareConcurrency || 2;
    const jobCount = Math.min(
      pendingIds.length,
      MAX_PARALLEL_JOBS,
      Math.max(1, Math.floor(availableCores / 2)),
    );

    async function worker() {
      while (nextIndex < pendingIds.length) {
        const id = pendingIds[nextIndex++];
        const image = imagesRef.current.find((entry) => entry.id === id);
        if (!image) continue;

        setImages((current) =>
          current.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  optimizeStatus: "processing",
                  optimizeError: undefined,
                }
              : entry,
          ),
        );

        try {
          const output = await optimizeImage(image.file, OPTIMIZE_SETTINGS);
          setImages((current) =>
            current.map((entry) =>
              entry.id === id
                ? {
                    ...entry,
                    optimizeStatus: "done",
                    optimized: {
                      blob: output.blob,
                      url: URL.createObjectURL(output.blob),
                      width: output.width,
                      height: output.height,
                    },
                  }
                : entry,
            ),
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível otimizar a imagem.";
          setImages((current) =>
            current.map((entry) =>
              entry.id === id
                ? { ...entry, optimizeStatus: "error", optimizeError: message }
                : entry,
            ),
          );
        }

        await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      }
    }

    await Promise.all(Array.from({ length: jobCount }, () => worker()));
    isProcessingRef.current = false;
    setIsProcessing(false);
  }, [setImages]);

  useEffect(() => {
    if (images.some((image) => image.optimizeStatus === "waiting")) {
      processQueue();
    }
  }, [images, processQueue]);

  async function downloadAll() {
    if (!completedImages.length || isZipping) return;
    if (completedImages.length === 1) {
      const output = completedImages[0].optimized;
      if (!output) return;
      downloadBlob(
        output.blob,
        `${completedImages[0].file.name.replace(/\.[^/.]+$/, "")}-otimizada.jpg`,
      );
      return;
    }

    setIsZipping(true);
    try {
      await downloadZip(
        completedImages.map((image) => ({
          filename: `${image.file.name.replace(/\.[^/.]+$/, "")}-otimizada.jpg`,
          blob: image.optimized?.blob as Blob,
        })),
        `imagens-otimizadas-${completedImages.length}.zip`,
      );
    } finally {
      setIsZipping(false);
    }
  }

  return (
    <section className="optimize-studio">
      <aside className="optimize-settings">
        <div>
          <p className="eyebrow">SAÍDA</p>
          <h1>Otimizar imagens</h1>
          <p className="optimize-intro">
            Arquivos mais leves para publicar, enviar e armazenar — sem perda
            visual perceptível.
          </p>
        </div>

        <div className="fixed-settings">
          <span className="fixed-settings-badge">JPG</span>
          <span className="fixed-settings-badge">Qualidade 82%</span>
          <span className="fixed-settings-badge">Máx. 1080px</span>
        </div>

        <div className="local-note">
          <LockKeyhole size={17} />
          <div>
            <strong>Processamento local</strong>
            <span>Suas imagens não saem deste dispositivo.</span>
          </div>
        </div>
      </aside>

      <div className="optimize-workspace">
        <div className="optimize-heading">
          <div>
            <p className="eyebrow">LOTE DE IMAGENS</p>
            <strong>
              {images.length} {images.length === 1 ? "arquivo" : "arquivos"}
            </strong>
          </div>
        </div>

        {images.length ? (
          <div className="optimize-queue" aria-live="polite">
            {images.map((image) => {
              const saving = image.optimized
                ? savingsPercent(image.file.size, image.optimized.blob.size)
                : null;
              return (
                <article
                  className={`queue-item ${image.optimizeStatus}`}
                  key={image.id}
                >
                  <img src={image.previewUrl} alt="" />
                  <div className="queue-copy">
                    <strong title={image.file.name}>{image.file.name}</strong>
                    <span>
                      {formatBytes(image.file.size)}
                      {image.optimized
                        ? ` → ${formatBytes(image.optimized.blob.size)} · ${image.optimized.width} × ${image.optimized.height}`
                        : ""}
                    </span>
                    {image.optimizeError ? (
                      <small>{image.optimizeError}</small>
                    ) : null}
                  </div>
                  <div className="queue-result">
                    {image.optimizeStatus === "processing" ? (
                      <>
                        <LoaderCircle className="spin" size={18} />
                        <span>Otimizando</span>
                      </>
                    ) : null}
                    {image.optimizeStatus === "done" && image.optimized ? (
                      <>
                        <span
                          className={
                            saving !== null && saving >= 0
                              ? "saving-badge"
                              : "saving-badge negative"
                          }
                        >
                          {saving !== null && saving >= 0
                            ? `${saving}% menor`
                            : `${Math.abs(saving ?? 0)}% maior`}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            image.optimized &&
                            downloadBlob(
                              image.optimized.blob,
                              `${image.file.name.replace(/\.[^/.]+$/, "")}-otimizada.jpg`,
                            )
                          }
                          aria-label={`Baixar ${image.file.name}`}
                        >
                          <Download size={17} />
                        </button>
                      </>
                    ) : null}
                    {image.optimizeStatus === "waiting" ? (
                      <span className="waiting-label">Na fila</span>
                    ) : null}
                    {image.optimizeStatus === "error" ? (
                      <button
                        type="button"
                        onClick={processQueue}
                        aria-label={`Tentar novamente ${image.file.name}`}
                      >
                        <RefreshCw size={17} />
                      </button>
                    ) : null}
                  </div>
                  <button
                    className="remove-file"
                    type="button"
                    onClick={() => onRemove(image.id)}
                    disabled={isProcessing}
                    aria-label={`Remover ${image.file.name}`}
                  >
                    <X size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-queue" aria-hidden="true">
            <ImagePlus size={28} />
            <span>Volte à etapa anterior para enviar fotos</span>
          </div>
        )}

        <div className="optimize-summary">
          <div className="summary-copy">
            {completedImages.length ? (
              <>
                <span className="summary-check">
                  <Check size={15} />
                </span>
                <span>
                  <strong>
                    {outputTotal <= originalTotal
                      ? `${formatBytes(originalTotal - outputTotal)} economizados`
                      : `${formatBytes(outputTotal - originalTotal)} a mais`}
                  </strong>
                  <small>
                    {Math.abs(totalSaving)}%{" "}
                    {totalSaving >= 0 ? "menor" : "maior"} no total ·{" "}
                    {completedImages.length} concluídos
                  </small>
                </span>
              </>
            ) : (
              <span>
                <strong>
                  {isProcessing ? "Otimizando…" : "Preparando para otimizar"}
                </strong>
                <small>Isso acontece automaticamente, sem configuração.</small>
              </span>
            )}
          </div>
          <div className="summary-actions">
            {completedImages.length ? (
              <button
                className="secondary-download"
                type="button"
                onClick={downloadAll}
                disabled={isZipping}
              >
                <FileArchive size={18} />{" "}
                {isZipping
                  ? "Criando ZIP…"
                  : completedImages.length === 1
                    ? "Baixar imagem"
                    : "Baixar ZIP"}
              </button>
            ) : null}
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
      </div>
    </section>
  );
}
