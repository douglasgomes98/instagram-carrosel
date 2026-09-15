export type OptimizeFormat = "webp" | "jpeg" | "png";

export type OptimizeSettings = {
  format: OptimizeFormat;
  quality: number;
  maxWidth: number | null;
};

export type OptimizedImage = {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
};

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

const MIME_TYPES: Record<OptimizeFormat, string> = {
  webp: "image/webp",
  jpeg: "image/jpeg",
  png: "image/png",
};

const EXTENSIONS: Record<OptimizeFormat, string> = {
  webp: "webp",
  jpeg: "jpg",
  png: "png",
};

async function decodeImage(file: File): Promise<DecodedImage> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      dispose: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = objectUrl;
  await image.decode();

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    dispose: () => URL.revokeObjectURL(objectUrl),
  };
}

function outputDimensions(
  width: number,
  height: number,
  maxWidth: number | null,
) {
  if (!maxWidth || width <= maxWidth) return { width, height };

  const scale = maxWidth / width;
  return {
    width: maxWidth,
    height: Math.max(1, Math.round(height * scale)),
  };
}

function createFilename(filename: string, format: OptimizeFormat) {
  const base = filename.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-");
  return `${base}-otimizada.${EXTENSIONS[format]}`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("O navegador não conseguiu gerar o arquivo.")),
      type,
      quality,
    );
  });
}

export async function optimizeImage(
  file: File,
  settings: OptimizeSettings,
): Promise<OptimizedImage> {
  const image = await decodeImage(file);

  try {
    const dimensions = outputDimensions(
      image.width,
      image.height,
      settings.maxWidth,
    );
    const mimeType = MIME_TYPES[settings.format];
    let blob: Blob;

    if ("OffscreenCanvas" in window) {
      const canvas = new OffscreenCanvas(dimensions.width, dimensions.height);
      const context = canvas.getContext("2d", {
        alpha: settings.format !== "jpeg",
      });
      if (!context) throw new Error("Não foi possível preparar a imagem.");
      if (settings.format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, dimensions.width, dimensions.height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image.source,
        0,
        0,
        dimensions.width,
        dimensions.height,
      );
      blob = await canvas.convertToBlob({
        type: mimeType,
        quality: settings.quality,
      });
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext("2d", {
        alpha: settings.format !== "jpeg",
      });
      if (!context) throw new Error("Não foi possível preparar a imagem.");
      if (settings.format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, dimensions.width, dimensions.height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image.source,
        0,
        0,
        dimensions.width,
        dimensions.height,
      );
      blob = await canvasToBlob(canvas, mimeType, settings.quality);
    }

    if (blob.type !== mimeType) {
      throw new Error(
        `O formato ${settings.format.toUpperCase()} não é suportado neste navegador.`,
      );
    }

    return {
      blob,
      filename: createFilename(file.name, settings.format),
      width: dimensions.width,
      height: dimensions.height,
    };
  } finally {
    image.dispose();
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

export function savingsPercent(originalSize: number, optimizedSize: number) {
  return Math.round((1 - optimizedSize / originalSize) * 100);
}
