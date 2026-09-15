export type Slide =
  | {
      id: number;
      type: "cover";
      kicker: string;
      title: string;
      footer: string;
      image?: string;
    }
  | {
      id: number;
      type: "statement";
      number: string;
      title: string;
      body: string;
    }
  | {
      id: number;
      type: "checklist";
      kicker: string;
      title: string;
      items: string[];
      footer: string;
    };

export const carousel = {
  slug: "guia-do-iogurte",
  title: "Guia rápido do iogurte",
  format: "1080 × 1350",
  slides: [
    {
      id: 1,
      type: "cover",
      kicker: "GUIA DE MERCADO · 01",
      title: "Nem todo iogurte é igual.",
      footer: "3 detalhes para olhar antes de escolher",
    },
    {
      id: 2,
      type: "statement",
      number: "01",
      title: "Comece pela lista de ingredientes.",
      body: "Uma lista curta costuma tornar a comparação mais simples. Observe a ordem dos ingredientes e compare produtos da mesma categoria.",
    },
    {
      id: 3,
      type: "checklist",
      kicker: "ANTES DE LEVAR",
      title: "Compare lado a lado.",
      items: ["Ingredientes", "Porção indicada", "Açúcares adicionados"],
      footer: "Salve para consultar no mercado.",
    },
  ] satisfies Slide[],
};
