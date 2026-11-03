/* Design tokens for canvas drawing, which can't read CSS custom properties itself. */

export function token(el: Element, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/** A token (hex or rgb()) at an alpha, in a form canvas accepts everywhere. */
export function rgba(color: string, a: number) {
  const hex = color.match(/^#([0-9a-f]{6})/i);
  const [r, g, b] = hex
    ? [0, 2, 4].map((k) => parseInt(hex[1].slice(k, k + 2), 16))
    : (color.match(/\d+(\.\d+)?/g) ?? ['255', '255', '255']).slice(0, 3).map(Number);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}
