import type { Slide } from "./carousel";

type SlideCanvasProps = {
  slide: Slide;
  className?: string;
};

export function SlideCanvas({ slide, className = "" }: SlideCanvasProps) {
  return (
    <article className={`slide-canvas slide-cover ${className}`}>
      {slide.image ? (
        <img className="cover-image" src={slide.image} alt="" />
      ) : null}
      <div className="cover-scrim" />
      <div className="slide-safe cover-content">
        <div className="slide-topline">
          <span className="slide-mark" aria-hidden="true">
            ✣
          </span>
          <span>{slide.kicker}</span>
        </div>
        <h2>{slide.title}</h2>
        <div className="cover-footer">
          <span>{slide.footer}</span>
          <span className="round-arrow" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </article>
  );
}
