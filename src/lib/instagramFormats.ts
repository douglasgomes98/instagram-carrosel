export type InstagramFormatId =
  | "feed-portrait"
  | "feed-native"
  | "feed-square"
  | "feed-landscape"
  | "stories-reels";

export type InstagramFormat = {
  id: InstagramFormatId;
  label: string;
  placement: string;
  width: number;
  height: number;
  note: string;
  recommended?: boolean;
};

export const instagramFormats: InstagramFormat[] = [
  {
    id: "feed-portrait",
    label: "Retrato 4:5",
    placement: "Feed e carrossel",
    width: 1080,
    height: 1350,
    note: "Compatível e com ótima ocupação vertical no feed.",
    recommended: true,
  },
  {
    id: "feed-native",
    label: "Retrato 3:4",
    placement: "Feed e carrossel",
    width: 1080,
    height: 1440,
    note: "Formato nativo de muitas câmeras, aceito pelo Instagram desde 2025.",
  },
  {
    id: "feed-square",
    label: "Quadrado 1:1",
    placement: "Feed e carrossel",
    width: 1080,
    height: 1080,
    note: "Formato clássico, previsível em todas as superfícies.",
  },
  {
    id: "feed-landscape",
    label: "Paisagem 1,91:1",
    placement: "Feed e carrossel",
    width: 1080,
    height: 566,
    note: "Limite horizontal do feed, ideal para cenas amplas.",
  },
  {
    id: "stories-reels",
    label: "Tela cheia 9:16",
    placement: "Stories e Reels",
    width: 1080,
    height: 1920,
    note: "Formato vertical de tela cheia; mantenha textos na área segura.",
  },
];

export const defaultInstagramFormat = instagramFormats[0];
