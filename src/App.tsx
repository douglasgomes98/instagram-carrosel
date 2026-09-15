import { useEffect, useMemo, useRef, useState } from "react";
import { Crop, Images, ScanLine, Sparkles, UploadCloud } from "lucide-react";
import { CreateStep } from "./CreateStep";
import { CropStep } from "./CropStep";
import { OptimizeStep } from "./OptimizeStep";
import {
  createPipelineImage,
  isCropComplete,
  isOptimizeComplete,
  MIN_IMAGES,
  type PipelineImage,
  type PostText,
  revokePipelineImage,
} from "./pipeline";
import { Stepper, type StepDefinition } from "./Stepper";
import { UploadStep } from "./UploadStep";

const steps: StepDefinition[] = [
  { id: "upload", label: "Enviar fotos", icon: UploadCloud },
  { id: "optimize", label: "Otimizar", icon: Sparkles },
  { id: "crop", label: "Recortar", icon: Crop },
  { id: "create", label: "Criar posts", icon: Images },
];

function App() {
  const [images, setImages] = useState<PipelineImage[]>([]);
  const [postTexts, setPostTexts] = useState<Record<string, PostText>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(
    () => () => {
      imagesRef.current.forEach(revokePipelineImage);
    },
    [],
  );

  const completed = useMemo(
    () => [
      images.length >= MIN_IMAGES,
      isOptimizeComplete(images),
      isCropComplete(images),
      false,
    ],
    [images],
  );

  function addFiles(files: FileList | File[]) {
    const newImages = Array.from(files).map(createPipelineImage);
    setImages((current) => [...current, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find((entry) => entry.id === id);
      if (image) revokePipelineImage(image);
      return current.filter((entry) => entry.id !== id);
    });
    setPostTexts((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function goToStep(index: number) {
    if (index <= maxStepReached) setStepIndex(index);
  }

  function advanceTo(index: number) {
    setMaxStepReached((current) => Math.max(current, index));
    setStepIndex(index);
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

        <Stepper
          steps={steps}
          currentIndex={stepIndex}
          completed={completed}
          maxReachedIndex={maxStepReached}
          onSelect={goToStep}
        />

        <div className="format-pill">
          <ScanLine size={15} />{" "}
          {images.length ? `${images.length} imagens` : "Nenhuma imagem"}
        </div>
      </header>

      {stepIndex === 0 ? (
        <UploadStep
          images={images}
          onAddFiles={addFiles}
          onRemove={removeImage}
          onContinue={() => advanceTo(1)}
        />
      ) : stepIndex === 1 ? (
        <OptimizeStep
          images={images}
          setImages={setImages}
          onRemove={removeImage}
          onContinue={() => advanceTo(2)}
          canContinue={completed[1]}
        />
      ) : stepIndex === 2 ? (
        <CropStep
          images={images}
          setImages={setImages}
          onContinue={() => advanceTo(3)}
          canContinue={completed[2]}
        />
      ) : (
        <CreateStep
          images={images}
          postTexts={postTexts}
          setPostTexts={setPostTexts}
        />
      )}
    </main>
  );
}

export default App;
