// Controleert de contrastwaarden uit de Designer-handoff (X v5). Gebruik: node scripts/contrast-check.mjs
import { ratio, accentText, onField, fieldOptions, palette } from '../src/lib/contrast.ts';
const claims = [
  ['wit op blauw (#1F3BFF)', '#FFFFFF', '#1F3BFF', 6.71],
  ['inkt op geel (#FFD400)', '#0E0E12', '#FFD400', 13.46],
  ['wit op zwart (#0B0B0F)', '#FFFFFF', '#0B0B0F', 19.64],
  ['wit op groen (#0F4D3A)', '#FFFFFF', '#0F4D3A', 9.8],
  ['inkt op accent', '#0E0E12', '#FF6A3D', 6.77],
  ['accent op blauw', '#FF6A3D', '#1F3BFF', 2.36],
  ['accent op geel', '#FF6A3D', '#FFD400', 1.99],
  ['inkt op paper', '#0E0E12', '#F3F1EA', 17.04],
  ['muted op paper', '#57534B', '#F3F1EA', 6.77],
  ['muted-dark op inkt', '#B9B5AA', '#0E0E12', 9.4],
  ['accent op paper (focusring oud)', '#FF6A3D', '#F3F1EA', 2.52],
];
let off = 0;
for (const [name, fg, bg, claim] of claims) {
  const r = ratio(fg, bg);
  const ok = Math.abs(r - claim) < 0.06;
  if (!ok) off++;
  console.log(`${ok ? 'ok  ' : 'AFWIJKING'}  ${name}: berekend ${r.toFixed(2)} · handoff ${claim}`);
}
console.log('\nAfgeleid per veldkleur (onField / accent-text / ratio accent-text op veld):');
for (const f of fieldOptions) {
  const at = accentText(f);
  console.log(`  ${f}: tekst ${onField(f)} · "beter." ${at} (${ratio(at, f).toFixed(2)}:1) · knop-rand accent op veld ${ratio(palette.accent, f).toFixed(2)}:1`);
}
console.log(off ? `\n${off} afwijking(en)` : '\nAlle claims in de handoff kloppen.');
