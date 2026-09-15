import { Crop, Images, Sparkles, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StepDefinition } from "./components/Stepper";
import { AppShell } from "./layout/AppShell";
import { downloadBlob, downloadZip } from "./lib/download";
import {
  createPipelineImage,
  isCropComplete,
  isOptimizeComplete,
  MIN_IMAGES,
  type PipelineImage,
  revokePipelineImage,
} from "./lib/pipeline";
import type { SlideConfig } from "./lib/slides";
import { CreateStep } from "./pages/CreateStep";
import { CropStep } from "./pages/CropStep";
import { OptimizeStep } from "./pages/OptimizeStep";
import { UploadStep } from "./pages/UploadStep";

const steps: StepDefinition[] = [
  { id: "upload", label: "Enviar fotos", icon: UploadCloud },
  { id: "optimize", label: "Otimizar", icon: Sparkles },
  { id: "crop", label: "Recortar", icon: Crop },
  { id: "create", label: "Criar posts", icon: Images },
];

function App() {
  const [images, setImages] = useState<PipelineImage[]>([]);
  const [slideConfigs, setSlideConfigs] = useState<Record<string, SlideConfig>>(
    {},
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
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

  const croppedImages = useMemo(
    () => images.filter((image) => !!image.cropped),
    [images],
  );

  const optimizedImages = useMemo(
    () =>
      images.filter(
        (image) => image.optimizeStatus === "done" && image.optimized,
      ),
    [images],
  );

  // Prefer the cropped output once it exists; optimized images remain
  // downloadable in the meantime so the ZIP button is useful right after step 2.
  const zipSource = croppedImages.length ? croppedImages : optimizedImages;
  const zipVariant = croppedImages.length ? "recorte" : "otimizada";

  function zipBlobFor(image: PipelineImage) {
    return zipVariant === "recorte"
      ? image.cropped?.blob
      : image.optimized?.blob;
  }

  async function downloadZipBundle() {
    if (!zipSource.length || isZipping) return;
    if (zipSource.length === 1) {
      const blob = zipBlobFor(zipSource[0]);
      if (!blob) return;
      downloadBlob(
        blob,
        `${zipSource[0].file.name.replace(/\.[^/.]+$/, "")}-${zipVariant}.jpg`,
      );
      return;
    }

    setIsZipping(true);
    try {
      await downloadZip(
        zipSource.map((image) => ({
          filename: `${image.file.name.replace(/\.[^/.]+$/, "")}-${zipVariant}.jpg`,
          blob: zipBlobFor(image) as Blob,
        })),
        `imagens-${zipVariant === "recorte" ? "recortadas" : "otimizadas"}-${zipSource.length}.zip`,
      );
    } finally {
      setIsZipping(false);
    }
  }

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
    setSlideConfigs((current) => {
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
    <AppShell
      steps={steps}
      stepIndex={stepIndex}
      completed={completed}
      maxStepReached={maxStepReached}
      onSelectStep={goToStep}
      showZipButton={stepIndex >= 1 && zipSource.length > 0}
      zipLabel={
        isZipping
          ? "Criando ZIP…"
          : zipSource.length === 1
            ? "Baixar imagem"
            : "Baixar ZIP"
      }
      isZipping={isZipping}
      onDownloadZip={downloadZipBundle}
    >
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
          slideConfigs={slideConfigs}
          setSlideConfigs={setSlideConfigs}
        />
      )}
    </AppShell>
  );
}

export default App;
