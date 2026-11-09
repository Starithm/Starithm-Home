import { useLayoutEffect, useRef, useState } from 'react';
import { STAGE_H, STAGE_W } from '../styled_components/LiveSlide.styled';

/** Scales the 1920×1080 stage to fit its frame, centred. Put `ref` on the frame and `transform` on the stage. */
export function useStageFit<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [fit, setFit] = useState({ scale: 1, x: 0, y: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / STAGE_W, height / STAGE_H) || 1;
      setFit({ scale, x: (width - STAGE_W * scale) / 2, y: (height - STAGE_H * scale) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})` };
}
