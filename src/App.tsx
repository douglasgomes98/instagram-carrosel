import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Check,
  Crop,
  Download,
  Images,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { carousel } from "./carousel";
import { CropStudio } from "./CropStudio";
import { OptimizeStudio } from "./OptimizeStudio";
import { ScaledSlide } from "./ScaledSlide";
import { SlideCanvas } from "./SlideCanvas";

type Tab = "create" | "crop" | "optimize";

const tabs: { id: Tab; label: string; icon: typeof Images }[] = [
  { id: "create", label: "Criar posts", icon: Images },
  { id: "crop", label: "Crop", icon: Crop },
  { id: "optimize", label: "Otimização", icon: Sparkles },
];

function App() {
  const [tab, setTab] = useState<Tab>("create");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadState, setDownloadState] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const canvasRef = useRef<HTMLElement>(null);
  const selectedSlide = carousel.slides[selectedIndex];

  async function downloadSlide() {
    if (!canvasRef.current || downloadState === "saving") return;

    setDownloadState("saving");
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(canvasRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        cacheBust: true,
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
      });
      const link = document.createElement("a");
      link.download = `${carousel.slug}-${String(selectedSlide.id).padStart(2, "0")}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadState("saved");
      window.setTimeout(() => setDownloadState("idle"), 1800);
    } catch (error) {
      console.error("Não foi possível exportar o slide.", error);
      setDownloadState("idle");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Frame, início">
          <span className="brand-symbol" aria-hidden="true">
            ✣
          </span>
          <span>FRAME</span>
        </a>

        <nav className="tabs" aria-label="Ferramentas">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              className={tab === id ? "tab active" : "tab"}
              key={id}
              onClick={() => setTab(id)}
              type="button"
              aria-current={tab === id ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </nav>

        <div className="format-pill">
          <ScanLine size={15} />{" "}
          {tab === "crop"
            ? "Formatos Instagram"
            : tab === "optimize"
              ? "100% no navegador"
              : carousel.format}
        </div>
      </header>

      {tab === "create" ? (
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
                <dd>{carousel.slides.length} peças</dd>
              </div>
              <div>
                <dt>Saída</dt>
                <dd>PNG · alta qualidade</dd>
              </div>
            </dl>

            <div className="code-note">
              <span className="code-note-icon">&lt;/&gt;</span>
              <div>
                <strong>Conteúdo em código</strong>
                <p>Textos, imagens e estilos vivem nos arquivos do projeto.</p>
              </div>
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
                  Slide {selectedIndex + 1} de {carousel.slides.length}
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
              <span>{carousel.slides.length}</span>
            </div>
            <div className="slide-list">
              {carousel.slides.map((slide, index) => (
                <button
                  type="button"
                  className={
                    selectedIndex === index ? "thumbnail selected" : "thumbnail"
                  }
                  onClick={() => setSelectedIndex(index)}
                  key={slide.id}
                  aria-label={`Selecionar slide ${index + 1}`}
                  aria-pressed={selectedIndex === index}
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
      ) : tab === "crop" ? (
        <CropStudio />
      ) : (
        <OptimizeStudio />
      )}
    </main>
  );
}

export default App;
