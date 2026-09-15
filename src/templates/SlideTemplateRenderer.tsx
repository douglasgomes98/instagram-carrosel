import { ComparisonSlideTemplate } from "./slides/ComparisonSlideTemplate";
import { ContentSlideTemplate } from "./slides/ContentSlideTemplate";
import { CoverSlideTemplate } from "./slides/CoverSlideTemplate";
import { CtaSlideTemplate } from "./slides/CtaSlideTemplate";
import { ListSlideTemplate } from "./slides/ListSlideTemplate";
import { StatsSlideTemplate } from "./slides/StatsSlideTemplate";
import type { SlideTemplateData } from "./types";

type SlideTemplateRendererProps = {
  data: SlideTemplateData;
  className?: string;
};

export function SlideTemplateRenderer({
  data,
  className = "",
}: SlideTemplateRendererProps) {
  let content: React.ReactNode = null;

  switch (data.template) {
    case "cover":
      content = <CoverSlideTemplate data={data} />;
      break;
    case "content":
      content = <ContentSlideTemplate data={data} />;
      break;
    case "list":
      content = <ListSlideTemplate data={data} />;
      break;
    case "comparison":
      content = <ComparisonSlideTemplate data={data} />;
      break;
    case "stats":
      content = <StatsSlideTemplate data={data} />;
      break;
    case "cta":
      content = <CtaSlideTemplate data={data} />;
      break;
  }

  return (
    <div className={`slide-template-container ${className}`}>{content}</div>
  );
}
