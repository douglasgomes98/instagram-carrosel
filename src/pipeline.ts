import { instagramFormats } from "./instagramFormats";

export const MIN_IMAGES = 1;
export const MAX_IMAGES = 10;

export const CAROUSEL_FORMAT =
  instagramFormats.find((format) => format.id === "feed-portrait") ??
  instagramFormats[0];

export const OPTIMIZE_SETTINGS = {
  format: "jpeg" as const,
  quality: 0.82,
  maxWidth: 1080,
};

export const STEP_ORDER = ["upload", "optimize", "crop", "create"] as const;
export type StepId = (typeof STEP_ORDER)[number];

export type PipelineImageStatus = "waiting" | "processing" | "done" | "error";

export type PipelineImage = {
  id: string;
  file: File;
  previewUrl: string;
  optimizeStatus: PipelineImageStatus;
  optimizeError?: string;
  optimized?: { blob: Blob; url: string; width: number; height: number };
  cropped?: { blob: Blob; url: string };
};

export type PostText = {
  kicker: string;
  title: string;
  footer: string;
};

export function createPipelineImage(file: File): PipelineImage {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    optimizeStatus: "waiting",
  };
}

export function revokePipelineImage(image: PipelineImage) {
  URL.revokeObjectURL(image.previewUrl);
  if (image.optimized) URL.revokeObjectURL(image.optimized.url);
  if (image.cropped) URL.revokeObjectURL(image.cropped.url);
}

export function isOptimizeComplete(images: PipelineImage[]) {
  return (
    images.length > 0 &&
    images.every((image) => image.optimizeStatus === "done")
  );
}

export function isCropComplete(images: PipelineImage[]) {
  return images.length > 0 && images.every((image) => !!image.cropped);
}
