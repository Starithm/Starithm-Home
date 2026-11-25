/** Prepares a canvas for one frame: sizes its backing store to w × h CSS pixels at the device
 *  pixel ratio (capped at 2), clears it, and reads the three colours the Ears drawings use.
 *  Returns null when the browser gives no 2D context. */
export function prepareCanvas(canvas: HTMLCanvasElement, w: number, h: number) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const g = canvas.getContext('2d');
  if (!g) return null;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);

  const css = getComputedStyle(canvas);
  const token = (name: string) => css.getPropertyValue(name).trim();
  return { g, violet: token('--starithm-electric-violet'), amber: token('--starithm-selective-yellow'), ink: token('--text-body') };
}
