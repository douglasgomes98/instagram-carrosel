import type { Slide } from "./carousel";

type SlideCanvasProps = {
  slide: Slide;
  className?: string;
};

export function SlideCanvas({ slide, className = "" }: SlideCanvasProps) {
  if (slide.type === "cover") {
    return (
      <article className={`slide-canvas slide-cover ${className}`}>
        <img className="cover-image" src={slide.image} alt="" />
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

  if (slide.type === "statement") {
    return (
      <article className={`slide-canvas slide-statement ${className}`}>
        <div className="statement-orbit" aria-hidden="true" />
        <div className="slide-safe statement-content">
          <div className="slide-topline dark">
            <span className="slide-mark light" aria-hidden="true">
              ✣
            </span>
            <span>GUIA DE MERCADO</span>
          </div>
          <span className="statement-number">{slide.number}</span>
          <h2>{slide.title}</h2>
          <p>{slide.body}</p>
          <div className="statement-footer">
            DESLIZE PARA CONTINUAR <span>→</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`slide-canvas slide-checklist ${className}`}>
      <div className="checklist-photo-wrap">
        <img
          className="checklist-photo"
          src={`${import.meta.env.BASE_URL}assets/yogurt.jpg`}
          alt=""
        />
      </div>
      <div className="slide-safe checklist-content">
        <div className="slide-topline dark">
          <span className="slide-mark light" aria-hidden="true">
            ✣
          </span>
          <span>{slide.kicker}</span>
        </div>
        <h2>{slide.title}</h2>
        <ol>
          {slide.items.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
        <p className="checklist-footer">{slide.footer}</p>
      </div>
    </article>
  );
}
