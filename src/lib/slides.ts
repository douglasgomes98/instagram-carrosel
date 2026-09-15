import type { SlideTemplateData } from "../templates";
import { SAMPLE_TEMPLATE_SLIDES } from "../templates";

export type SlideTemplateType = SlideTemplateData["template"];

export const TEMPLATE_OPTIONS: { id: SlideTemplateType; label: string }[] = [
  { id: "cover", label: "Capa" },
  { id: "content", label: "Editorial" },
  { id: "list", label: "Lista" },
  { id: "comparison", label: "Comparação" },
  { id: "stats", label: "Métricas" },
  { id: "cta", label: "Chamada final" },
];

export const DEFAULT_TEMPLATE_ID: SlideTemplateType = "cover";

type EditableFieldKind = "text" | "textarea";

export type EditableField = {
  key: string;
  label: string;
  kind: EditableFieldKind;
  placeholder?: string;
};

export const EDITABLE_FIELDS: Record<SlideTemplateType, EditableField[]> = {
  cover: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Título", kind: "textarea" },
    { key: "subtitle", label: "Subtítulo", kind: "textarea" },
  ],
  content: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Título", kind: "textarea" },
    { key: "body", label: "Texto", kind: "textarea" },
  ],
  list: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Título", kind: "textarea" },
    { key: "subtitle", label: "Subtítulo", kind: "textarea" },
  ],
  comparison: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Título", kind: "textarea" },
    { key: "subtitle", label: "Subtítulo", kind: "textarea" },
  ],
  stats: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Título", kind: "textarea" },
    { key: "highlightMetric", label: "Métrica", kind: "text" },
    { key: "highlightLabel", label: "Legenda", kind: "text" },
  ],
  cta: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Título", kind: "textarea" },
    { key: "body", label: "Texto", kind: "textarea" },
  ],
};

const IMAGE_TEMPLATES = new Set<SlideTemplateType>(["cover", "content"]);

export function templateAcceptsImage(template: SlideTemplateType) {
  return IMAGE_TEMPLATES.has(template);
}

export type SlideConfig = {
  templateId: SlideTemplateType;
  overrides: Record<string, string>;
};

export function createSlideConfig(): SlideConfig {
  return { templateId: DEFAULT_TEMPLATE_ID, overrides: {} };
}

function getTemplateDefaults(template: SlideTemplateType): SlideTemplateData {
  const sample = SAMPLE_TEMPLATE_SLIDES.find((s) => s.template === template);
  if (!sample) {
    throw new Error(`Sem conteúdo de exemplo cadastrado para "${template}".`);
  }
  return sample;
}

export function readField(data: SlideTemplateData, key: string): string {
  const value = (data as unknown as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export function buildSlideData(
  config: SlideConfig,
  imageUrl?: string,
): SlideTemplateData {
  const defaults = getTemplateDefaults(config.templateId);
  const merged = {
    ...defaults,
    ...config.overrides,
  } as unknown as SlideTemplateData;

  if (templateAcceptsImage(config.templateId) && imageUrl) {
    (merged as unknown as Record<string, unknown>).imageUrl = imageUrl;
  }

  return merged;
}
