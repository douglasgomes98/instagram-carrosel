export type SlideTheme =
  | "cream"
  | "house-green"
  | "ceramic"
  | "white"
  | "gold-lightest";

export type SlideBadgeVariant =
  | "green-accent"
  | "green-light"
  | "gold"
  | "gold-filled"
  | "outline-dark"
  | "outline-white"
  | "dark";

export type SlideButtonVariant =
  | "primary"
  | "outline"
  | "inverted"
  | "outline-white"
  | "black";

export type SlideHeaderConfig = {
  kicker?: string;
  symbol?: string;
  slideNumber?: number;
  totalSlides?: number;
  brandName?: string;
};

export type SlideFooterConfig = {
  handle?: string;
  actionText?: string;
  showSwipeArrow?: boolean;
  avatarUrl?: string;
  brandName?: string;
};

/* Template Specific Props */

// 1. Cover Variations
export type CoverSlideVariant =
  | "hero-dark"
  | "editorial-cream"
  | "split-feature";

export type CoverSlideData = {
  template: "cover";
  variant?: CoverSlideVariant;
  theme?: SlideTheme;
  kicker?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: SlideBadgeVariant;
  imageUrl?: string;
  header?: SlideHeaderConfig;
  footer?: SlideFooterConfig;
};

// 2. Content / Editorial Variations
export type ContentSlideVariant =
  | "headline-text"
  | "quote-spotlight"
  | "photo-card-text";

export type ContentSlideData = {
  template: "content";
  variant?: ContentSlideVariant;
  theme?: SlideTheme;
  kicker?: string;
  title: string;
  body?: string | string[];
  quoteAuthor?: string;
  quoteRole?: string;
  badge?: string;
  badgeVariant?: SlideBadgeVariant;
  imageUrl?: string;
  imageCaption?: string;
  header?: SlideHeaderConfig;
  footer?: SlideFooterConfig;
};

// 3. List / Steps Variations
export type ListSlideVariant = "numbered-steps" | "card-grid" | "checklist";

export type ListItem = {
  number?: string | number;
  title: string;
  description: string;
  tag?: string;
  icon?: string;
};

export type ListSlideData = {
  template: "list";
  variant?: ListSlideVariant;
  theme?: SlideTheme;
  kicker?: string;
  title: string;
  subtitle?: string;
  items: ListItem[];
  badge?: string;
  badgeVariant?: SlideBadgeVariant;
  header?: SlideHeaderConfig;
  footer?: SlideFooterConfig;
};

// 4. Comparison / Versus Variations
export type ComparisonSide = {
  tag: string;
  tagVariant?: SlideBadgeVariant;
  title: string;
  points: string[];
  verdict?: string;
  isPositive?: boolean;
};

export type ComparisonSlideData = {
  template: "comparison";
  theme?: SlideTheme;
  kicker?: string;
  title: string;
  subtitle?: string;
  left: ComparisonSide;
  right: ComparisonSide;
  header?: SlideHeaderConfig;
  footer?: SlideFooterConfig;
};

// 5. Stats / Key Metric Variations
export type StatItem = {
  metric: string;
  label: string;
  description?: string;
  trend?: string;
};

export type StatsSlideData = {
  template: "stats";
  theme?: SlideTheme;
  kicker?: string;
  title: string;
  highlightMetric: string;
  highlightLabel: string;
  highlightDescription?: string;
  secondaryStats?: StatItem[];
  badge?: string;
  badgeVariant?: SlideBadgeVariant;
  header?: SlideHeaderConfig;
  footer?: SlideFooterConfig;
};

// 6. CTA / Final Action Variations
export type CtaSlideVariant =
  | "profile-action"
  | "save-and-share"
  | "minimal-brand";

export type CtaSlideData = {
  template: "cta";
  variant?: CtaSlideVariant;
  theme?: SlideTheme;
  kicker?: string;
  badge?: string;
  badgeVariant?: SlideBadgeVariant;
  title: string;
  body?: string;
  ctaButtonText?: string;
  ctaButtonVariant?: SlideButtonVariant;
  profileName?: string;
  profileHandle?: string;
  profileRole?: string;
  profileAvatar?: string;
  checklist?: string[];
  header?: SlideHeaderConfig;
  footer?: SlideFooterConfig;
};

export type SlideTemplateData =
  | CoverSlideData
  | ContentSlideData
  | ListSlideData
  | ComparisonSlideData
  | StatsSlideData
  | CtaSlideData;
