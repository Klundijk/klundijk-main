// Beeldhulp voor beelden in public/. Leest de echte afmetingen bij de build, zodat width/height altijd kloppen
// (geen layoutverschuiving, en Lighthouse "image-aspect-ratio" blijft groen). Alleen voor lokale bestanden onder /.
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';

const cache = new Map<string, { width: number; height: number }>();

/** Afmetingen van een beeld onder public/, bijv. "/work/rootboxes.webp". Onbekend bestand: geen attributen. */
export function dims(src: string): { width?: number; height?: number } {
  if (!src.startsWith('/')) return {};
  const hit = cache.get(src);
  if (hit) return hit;
  try {
    const { width, height } = imageSize(fs.readFileSync(path.join(process.cwd(), 'public', src)));
    if (!width || !height) return {};
    cache.set(src, { width, height });
    return { width, height };
  } catch {
    return {};
  }
}

/** srcset voor .webp-beelden met een -800-variant (kleine schermen). Andere bestanden: geen srcset. */
export function srcsetFor(src: string): string | undefined {
  if (!src.endsWith('.webp')) return undefined;
  const small = src.replace('.webp', '-800.webp');
  const { width } = dims(src);
  const w2 = dims(small).width;
  return w2 && width ? `${small} ${w2}w, ${src} ${width}w` : undefined;
}
