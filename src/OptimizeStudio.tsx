import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  FileArchive,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  formatBytes,
  optimizeImage,
  savingsPercent,
  type OptimizedImage,
  type OptimizeFormat,
  type OptimizeSettings,
} from "./imageOptimizer";

type QueueStatus = "waiting" | "processing" | "done" | "error";

type QueueItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: QueueStatus;
  output?: OptimizedImage;
  error?: string;
};

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PARALLEL_JOBS = 3;

const widthOptions: { value: number | null; label: string; note: string }[] = [
  { value: 1080, label: "1080 px", note: "Instagram" },
  { value: 1920, label: "1920 px", note: "Full HD" },
  { value: 2560, label: "2560 px", note: "Alta resolução" },
  { value: null, label: "Original", note: "Sem redimensionar" },
];

const formatOptions: { value: OptimizeFormat; label: string; note: string }[] =
  [
    { value: "webp", label: "WebP", note: "Menor arquivo" },
    { value: "jpeg", label: "JPG", note: "Mais compatível" },
    { value: "png", label: "PNG", note: "Transparência" },
  ];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function OptimizeStudio() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [format, setFormat] = useState<OptimizeFormat>("webp");
  const [quality, setQuality] = useState(82);
  const [maxWidth, setMaxWidth] = useState<number | null>(1080);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(
    () => () => {
      itemsRef.current.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
    },
    [],
  );

  const completedItems = useMemo(
    () => items.filter((item) => item.status === "done" && item.output),
    [items],
  );
  const originalTotal = completedItems.reduce(
    (total, item) => total + item.file.size,
    0,
  );
  const outputTotal = completedItems.reduce(
    (total, item) => total + (item.output?.blob.size ?? 0),
    0,
  );
  const totalSaving = originalTotal
    ? savingsPercent(originalTotal, outputTotal)
    : 0;

  function invalidateResults() {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        status: "waiting",
        output: undefined,
        error: undefined,
      })),
    );
  }

  function selectFormat(value: OptimizeFormat) {
    setFormat(value);
    invalidateResults();
  }

  function selectWidth(value: number | null) {
    setMaxWidth(value);
    invalidateResults();
  }

  function selectQuality(value: number) {
    setQuality(value);
    invalidateResults();
  }

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) =>
      ACCEPTED_TYPES.has(file.type),
    );
    if (!files.length) return;

    setItems((current) => [
      ...current,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "waiting" as const,
      })),
    ]);
  }

  function removeItem(id: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function clearQueue() {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
    });
    setItems([]);
  }

  async function processQueue() {
    if (!items.length || isProcessing) return;
    setIsProcessing(true);

    const settings: OptimizeSettings = {
      format,
      quality: quality / 100,
      maxWidth,
    };
    const ids = items.map((item) => item.id);
    let nextIndex = 0;
    const availableCores = navigator.hardwareConcurrency || 2;
    const jobCount = Math.min(
      ids.length,
      MAX_PARALLEL_JOBS,
      Math.max(1, Math.floor(availableCores / 2)),
    );

    async function worker() {
      while (nextIndex < ids.length) {
        const id = ids[nextIndex++];
        const item = itemsRef.current.find((entry) => entry.id === id);
        if (!item) continue;

        setItems((current) =>
          current.map((entry) =>
            entry.id === id
              ? { ...entry, status: "processing", error: undefined }
              : entry,
          ),
        );

        try {
          const output = await optimizeImage(item.file, settings);
          setItems((current) =>
            current.map((entry) =>
              entry.id === id ? { ...entry, status: "done", output } : entry,
            ),
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Não foi possível converter a imagem.";
          setItems((current) =>
            current.map((entry) =>
              entry.id === id
                ? { ...entry, status: "error", error: message }
                : entry,
            ),
          );
        }

        await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      }
    }

    await Promise.all(Array.from({ length: jobCount }, () => worker()));
    setIsProcessing(false);
  }

  async function downloadAll() {
    if (!completedItems.length || isZipping) return;
    if (completedItems.length === 1) {
      const output = completedItems[0].output;
      if (!output) return;
      downloadBlob(output.blob, output.filename);
      return;
    }

    setIsZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const usedNames = new Map<string, number>();
      completedItems.forEach((item) => {
        if (!item.output) return;
        const seen = usedNames.get(item.output.filename) ?? 0;
        usedNames.set(item.output.filename, seen + 1);
        const filename =
          seen === 0
            ? item.output.filename
            : item.output.filename.replace(/(\.[^.]+)$/, `-${seen + 1}$1`);
        zip.file(filename, item.output.blob);
      });
      const blob = await zip.generateAsync({
        type: "blob",
        compression: "STORE",
      });
      downloadBlob(blob, `imagens-otimizadas-${completedItems.length}.zip`);
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

        <fieldset className="setting-group" disabled={isProcessing}>
          <legend>Formato</legend>
          <div className="format-toggle">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={format === option.value ? "selected" : ""}
                onClick={() => selectFormat(option.value)}
                aria-pressed={format === option.value}
              >
                <strong>{option.label}</strong>
                <small>{option.note}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="setting-group" disabled={isProcessing}>
          <legend>Largura máxima</legend>
          <div className="width-options">
            {widthOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className={maxWidth === option.value ? "selected" : ""}
                onClick={() => selectWidth(option.value)}
                aria-pressed={maxWidth === option.value}
              >
                <span>{option.label}</span>
                <small>{option.note}</small>
              </button>
            ))}
          </div>
          <p className="setting-help">Imagens menores nunca serão ampliadas.</p>
        </fieldset>

        <fieldset
          className="setting-group quality-setting"
          disabled={format === "png" || isProcessing}
        >
          <legend>Qualidade</legend>
          <div className="quality-row">
            <input
              type="range"
              min="55"
              max="100"
              value={quality}
              onChange={(event) => selectQuality(Number(event.target.value))}
              aria-label="Qualidade da compressão"
            />
            <output>{format === "png" ? "Sem perdas" : `${quality}%`}</output>
          </div>
          <p className="setting-help">
            82% equilibra nitidez e tamanho para a maioria das fotos.
          </p>
        </fieldset>

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
              {items.length
                ? `${items.length} ${items.length === 1 ? "arquivo" : "arquivos"}`
                : "Adicione suas fotos"}
            </strong>
          </div>
          {items.length ? (
            <button
              className="clear-button"
              type="button"
              onClick={clearQueue}
              disabled={isProcessing}
            >
              <Trash2 size={16} /> Limpar lista
            </button>
          ) : null}
        </div>

        <label
          className={
            isDragging ? "optimize-dropzone dragging" : "optimize-dropzone"
          }
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <span className="dropzone-icon">
            <UploadCloud size={26} />
          </span>
          <span>
            <strong>Arraste imagens aqui</strong>
            <small>ou clique para selecionar várias de uma vez</small>
          </span>
          <span className="dropzone-types">JPG · PNG · WEBP</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>

        {items.length ? (
          <div className="optimize-queue" aria-live="polite">
            {items.map((item) => {
              const saving = item.output
                ? savingsPercent(item.file.size, item.output.blob.size)
                : null;
              return (
                <article className={`queue-item ${item.status}`} key={item.id}>
                  <img src={item.previewUrl} alt="" />
                  <div className="queue-copy">
                    <strong title={item.file.name}>{item.file.name}</strong>
                    <span>
                      {formatBytes(item.file.size)}
                      {item.output
                        ? ` → ${formatBytes(item.output.blob.size)} · ${item.output.width} × ${item.output.height}`
                        : ""}
                    </span>
                    {item.error ? <small>{item.error}</small> : null}
                  </div>
                  <div className="queue-result">
                    {item.status === "processing" ? (
                      <>
                        <LoaderCircle className="spin" size={18} />
                        <span>Otimizando</span>
                      </>
                    ) : null}
                    {item.status === "done" && item.output ? (
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
                            item.output &&
                            downloadBlob(item.output.blob, item.output.filename)
                          }
                          aria-label={`Baixar ${item.file.name}`}
                        >
                          <Download size={17} />
                        </button>
                      </>
                    ) : null}
                    {item.status === "waiting" ? (
                      <span className="waiting-label">Na fila</span>
                    ) : null}
                    {item.status === "error" ? <RefreshCw size={17} /> : null}
                  </div>
                  <button
                    className="remove-file"
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={isProcessing}
                    aria-label={`Remover ${item.file.name}`}
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
            <span>Seu lote aparecerá aqui</span>
          </div>
        )}

        <div className="optimize-summary">
          <div className="summary-copy">
            {completedItems.length ? (
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
                    {completedItems.length} concluídos
                  </small>
                </span>
              </>
            ) : (
              <span>
                <strong>Tudo pronto para começar</strong>
                <small>
                  A conversão usa até {MAX_PARALLEL_JOBS} tarefas em paralelo.
                </small>
              </span>
            )}
          </div>
          <div className="summary-actions">
            {completedItems.length ? (
              <button
                className="secondary-download"
                type="button"
                onClick={downloadAll}
                disabled={isZipping || isProcessing}
              >
                <FileArchive size={18} />{" "}
                {isZipping
                  ? "Criando ZIP…"
                  : completedItems.length === 1
                    ? "Baixar imagem"
                    : "Baixar ZIP"}
              </button>
            ) : null}
            <button
              className="download-button"
              type="button"
              onClick={processQueue}
              disabled={!items.length || isProcessing}
            >
              {isProcessing ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <UploadCloud size={18} />
              )}
              {isProcessing
                ? "Otimizando…"
                : completedItems.length
                  ? "Otimizar novamente"
                  : "Otimizar lote"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
