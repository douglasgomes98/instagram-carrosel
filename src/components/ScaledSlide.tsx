import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ScaledSlideProps = {
  className: string;
  children: ReactNode;
};

export function ScaledSlide({ className, children }: ScaledSlideProps) {
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
        {children}
      </div>
    </div>
  );
}
