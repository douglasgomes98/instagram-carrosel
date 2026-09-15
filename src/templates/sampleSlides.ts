import type { SlideTemplateData } from "./types";

export const SAMPLE_TEMPLATE_SLIDES: SlideTemplateData[] = [
  // 1. Cover - Hero Dark
  {
    template: "cover",
    variant: "hero-dark",
    theme: "house-green",
    badge: "EDIÇÃO #12",
    badgeVariant: "green-accent",
    kicker: "DESIGN SYSTEM & MARCA",
    title: "Como Criar Identidade Visual Marcante",
    subtitle:
      "Princípios práticos de hierarquia, cores e tipografia para postagens consistentes.",
    header: {
      kicker: "ESTÚDIO DE CRIAÇÃO",
      symbol: "✣",
      slideNumber: 1,
      totalSlides: 6,
    },
    footer: {
      handle: "@designstudio",
      actionText: "Deslize para ver",
      showSwipeArrow: true,
    },
  },

  // 2. Cover - Editorial Cream
  {
    template: "cover",
    variant: "editorial-cream",
    theme: "cream",
    badge: "GUIA ESSENCIAL",
    badgeVariant: "green-light",
    kicker: "ARQUITETURA DE MARCA",
    title: "A Harmonia do Verde e Tons Quentes",
    subtitle:
      "Descubra como o contraste entre o Neutral Warm e House Green eleva a percepção de valor.",
    header: {
      kicker: "IDENTIDADE POST",
      symbol: "✦",
      slideNumber: 1,
      totalSlides: 6,
    },
    footer: {
      handle: "@postidentity",
      actionText: "Começar",
      showSwipeArrow: true,
    },
  },

  // 3. Content - Headline & Body Text
  {
    template: "content",
    variant: "headline-text",
    theme: "cream",
    badge: "FUNDAMENTOS",
    kicker: "01 · HIERARQUIA",
    title: "O Peso Certo na Hora Certa",
    body: [
      "No sistema de post-identity, a tipografia display (Waldenburg Light) é aplicada com peso 300 e tracking negativo (-0.32px a -1.92px), trazendo sofisticação editorial.",
      "O corpo do texto utiliza Inter com tracking ligeiramente solto (+0.16px), garantindo leitura agradável mesmo em telas menores.",
    ],
    header: {
      kicker: "TIPOGRAFIA ELEVENLABS",
      symbol: "✣",
      slideNumber: 2,
      totalSlides: 6,
    },
    footer: {
      handle: "@designstudio",
      showSwipeArrow: true,
    },
  },

  // 4. Content - Quote Spotlight
  {
    template: "content",
    variant: "quote-spotlight",
    theme: "cream",
    title:
      "O bom design não chama atenção pelo excesso, mas pela disciplina e clareza com que respira no espaço.",
    quoteAuthor: "Diretoria Criativa",
    quoteRole: "Starbucks Design System Insights",
    header: {
      kicker: "MANIFESTO",
      symbol: "✦",
      slideNumber: 3,
      totalSlides: 6,
    },
    footer: {
      handle: "@designstudio",
      showSwipeArrow: true,
    },
  },

  // 5. List - Numbered Steps
  {
    template: "list",
    variant: "numbered-steps",
    theme: "cream",
    badge: "METODOLOGIA",
    title: "3 Regras de Aplicação de Cores",
    subtitle: "Mantenha o ritmo visual sem dispersar a atenção do leitor.",
    items: [
      {
        number: 1,
        title: "Neutral Warm como Canvas",
        description:
          "Utilize #f2f0eb em vez de branco puro para criar conforto ótico acolhedor.",
        tag: "Canvas",
      },
      {
        number: 2,
        title: "House Green para Ênfase",
        description:
          "Empregue #1E3932 nas capas e blocos de alto impacto com tipografia clara.",
        tag: "Destaque",
      },
      {
        number: 3,
        title: "Green Accent para Ações",
        description:
          "Reserve #00754A para botões em formato full-pill de 50px de raio.",
        tag: "CTA",
      },
    ],
    header: {
      kicker: "SISTEMA DE CORES",
      symbol: "✣",
      slideNumber: 4,
      totalSlides: 6,
    },
    footer: {
      handle: "@designstudio",
      showSwipeArrow: true,
    },
  },

  // 6. Comparison - Versus (Do vs Don't)
  {
    template: "comparison",
    theme: "cream",
    title: "O Que Fazer vs. O Que Evitar",
    subtitle: "Comparações diretas para manter a coesão da identidade.",
    left: {
      tag: "Recomendado",
      isPositive: true,
      title: "Boas Práticas",
      points: [
        "Usar raios full-pill (50px) em botões",
        "Micro-interação scale(0.95)",
        "Sombra suave multicamadas",
        "Respeitar o canvas Neutral Warm",
      ],
      verdict: "Consistência e elegância garantidas",
    },
    right: {
      tag: "Evitar",
      isPositive: false,
      title: "Desvios Comuns",
      points: [
        "Usar cantos retos em botões",
        "Gradientes pesados e chamativos",
        "Preto puro #000000 no corpo de texto",
        "Usar ouro fora do contexto de status",
      ],
      verdict: "Quebra a proposta estética",
    },
    header: {
      kicker: "DIRETRIZES",
      symbol: "⚖",
      slideNumber: 5,
      totalSlides: 6,
    },
    footer: {
      handle: "@designstudio",
      showSwipeArrow: true,
    },
  },

  // 7. Stats - Impact Metric
  {
    template: "stats",
    theme: "cream",
    badge: "RESULTADOS",
    title: "Métricas de Retenção",
    highlightMetric: "+84%",
    highlightLabel: "Aumento no Tempo de Leitura",
    highlightDescription:
      "Posts estruturados com o ritmo editorial e tipografia equilibrada retêm mais atenção por carrossel.",
    secondaryStats: [
      {
        metric: "3.2x",
        label: "Salvamentos",
        description: "Mais pessoas guardando",
      },
      {
        metric: "98%",
        label: "Legibilidade",
        description: "Contraste verificado",
      },
    ],
    header: {
      kicker: "PERFORMANCE",
      symbol: "✦",
      slideNumber: 6,
      totalSlides: 7,
    },
    footer: {
      handle: "@designstudio",
      showSwipeArrow: true,
    },
  },

  // 8. CTA - Final Action Slide
  {
    template: "cta",
    variant: "profile-action",
    theme: "cream",
    badge: "PASSO SEGUINTE",
    title: "Gostou deste formato?",
    body: "Salve este carrossel para consultar quando for planejar a identidade visual das suas próximas postagens.",
    profileName: "Studio de Conteúdo",
    profileRole: "Design & Estratégia Visual",
    profileHandle: "@designstudio",
    ctaButtonText: "Siga o perfil para mais guias",
    header: {
      kicker: "FECHAMENTO",
      symbol: "✣",
      slideNumber: 7,
      totalSlides: 7,
    },
    footer: {
      handle: "@designstudio",
      actionText: "Salve para depois",
    },
  },
];
