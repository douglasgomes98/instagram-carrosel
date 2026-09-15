import { useEffect, useRef, useState } from "react";
import type { Slide } from "./carousel";
import { SlideCanvas } from "./SlideCanvas";

type ScaledSlideProps = {
  className: string;
  slide: Slide;
};

export function ScaledSlide({ className, slide }: ScaledSlideProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => setScale(frame.clientWidth / 1080);
    const observer = new ResizeObserver(updateScale);
    updateScale();
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={frameRef}>
      <div className="scaled-slide" style={{ transform: `scale(${scale})` }}>
        <SlideCanvas slide={slide} />
      </div>
    </div>
  );
}
