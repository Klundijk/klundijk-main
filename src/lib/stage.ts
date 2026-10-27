// Tekenhulp voor de interactieve "nu / beter"-illustraties (homepage: Situaties en Proces).
// Bron: ontwerpbord X · Home. Blokken staan in een logisch vlak van 340 × 240 en worden hier omgezet naar
// percentages en container-eenheden, zodat de illustratie op elke breedte meeschaalt zonder JavaScript-berekening.
export type Frame = [x: number, y: number, w: number, h: number, rot: number, color: string, radius: number];
export type Block = { b: Frame; a: Frame };
export type Art = { blocks: Block[]; lines?: [from: number, to: number, dashed: boolean][] };

const W = 340;
const H = 240;
const r2 = (n: number) => Math.round(n * 100) / 100;
export const color = (c: string) => (c === 'FIELD' ? 'var(--k-field)' : c === 'ACCENT' ? 'var(--k-accent)' : c);

export const frameStyle = (f: Frame) =>
  `left:${r2((f[0] / W) * 100)}%;top:${r2((f[1] / H) * 100)}%;width:${r2((f[2] / W) * 100)}%;height:${r2((f[3] / H) * 100)}%;` +
  `background:${color(f[5])};border-radius:${r2((f[6] / W) * 100)}cqw;transform:rotate(${f[4]}deg)`;

/** Tussenstand tussen "nu" (t = 0) en "beter" (t = 1). */
export const mixFrame = (b: Frame, a: Frame, t: number): Frame => {
  const n = (i: 0 | 1 | 2 | 3 | 4 | 6) => r2((b[i] as number) + ((a[i] as number) - (b[i] as number)) * t);
  const c = t <= 0 ? b[5] : t >= 1 ? a[5] : `color-mix(in srgb, ${color(a[5])} ${Math.round(t * 100)}%, ${color(b[5])})`;
  return [n(0), n(1), n(2), n(3), n(4), c, n(6)];
};

export const blockStyles = (art: Art, t: number) => art.blocks.map((k) => frameStyle(mixFrame(k.b, k.a, t)));

/** Verbindingslijnen tussen blokmiddens (tegel "Groei & slimme processen"). Gestippelde lijnen verdwijnen in "beter". */
export const lineStyles = (art: Art, t: 0 | 1) => {
  const fr = art.blocks.map((k) => (t ? k.a : k.b));
  return (art.lines ?? []).map(([i, j, dashed]) => {
    const p = fr[i];
    const q = fr[j];
    const x1 = p[0] + p[2] / 2, y1 = p[1] + p[3] / 2, x2 = q[0] + q[2] / 2, y2 = q[1] + q[3] / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    return `left:${r2((x1 / W) * 100)}%;top:${r2(((y1) / H) * 100)}%;width:${r2((len / W) * 100)}%;transform:rotate(${r2(ang)}deg);` +
      `opacity:${dashed ? 1 - t : 1};background:${dashed ? '#999999' : '#111111'}`;
  });
};
