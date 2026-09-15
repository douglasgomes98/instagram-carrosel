import type { Area } from "react-easy-crop";

type Flip = {
  horizontal: boolean;
  vertical: boolean;
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.crossOrigin = "anonymous";
    image.src = source;
  });
}

function rotatedBounds(width: number, height: number, rotation: number) {
  const radians = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(radians) * width) +
      Math.abs(Math.sin(radians) * height),
    height:
      Math.abs(Math.sin(radians) * width) +
      Math.abs(Math.cos(radians) * height),
  };
}

export async function cropImage(
  source: string,
  crop: Area,
  output: { width: number; height: number },
  rotation = 0,
  flip: Flip = { horizontal: false, vertical: false },
) {
  const image = await loadImage(source);
  const bounds = rotatedBounds(
    image.naturalWidth,
    image.naturalHeight,
    rotation,
  );
  const sourceCanvas = document.createElement("canvas");
  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext)
    throw new Error("Canvas não está disponível neste navegador.");

  sourceCanvas.width = Math.round(bounds.width);
  sourceCanvas.height = Math.round(bounds.height);
  sourceContext.translate(sourceCanvas.width / 2, sourceCanvas.height / 2);
  sourceContext.rotate((rotation * Math.PI) / 180);
  sourceContext.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  sourceContext.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
  sourceContext.drawImage(image, 0, 0);

  const outputCanvas = document.createElement("canvas");
  const outputContext = outputCanvas.getContext("2d");

  if (!outputContext)
    throw new Error("Canvas não está disponível neste navegador.");

  outputCanvas.width = output.width;
  outputCanvas.height = output.height;
  outputContext.imageSmoothingEnabled = true;
  outputContext.imageSmoothingQuality = "high";
  outputContext.drawImage(
    sourceCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    output.width,
    output.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Não foi possível gerar a imagem.")),
      "image/jpeg",
      0.94,
    );
  });
}
