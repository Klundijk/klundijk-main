// WCAG-contrastberekening voor de designtokens (X v5). Wordt op build-tijd gebruikt,
// zodat het afgeleide token --k-accent-text niet op runtime berekend hoeft te worden.
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function ratio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export const palette = { ink: '#0E0E12', paper: '#F3F1EA', white: '#FFFFFF', yellow: '#FFD400', accent: '#FF6A3D' };
export const fieldOptions = ['#1F3BFF', '#FFD400', '#0B0B0F', '#0F4D3A'] as const;

/** Tekstkleur op het veld: wit of inkt, op basis van luminantiedrempel 0,4 (zoals in de handoff). */
export function onField(field: string): string {
  return luminance(field) > 0.4 ? palette.ink : palette.white;
}
/** Accent als >= 3:1 op het veld; anders geel (>= 3:1); anders de tekstkleur op het veld. */
export function accentText(field: string, accent = palette.accent): string {
  if (ratio(accent, field) >= 3) return accent;
  if (ratio(palette.yellow, field) >= 3) return palette.yellow;
  return onField(field);
}
