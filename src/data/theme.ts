// Eén plek voor de wisselbare designtokens (besluit Levi 23 oktober 2026: blauw + oranje).
// Geen kleur hardcoderen in componenten: gebruik de CSS-variabelen uit tokens.css.
import { onField, accentText, palette } from '../lib/contrast';

export const theme = {
  field: '#1F3BFF',
  accent: palette.accent, // #FF6A3D
  ink: palette.ink,
  paper: palette.paper,
} as const;

/** Afgeleide waarden, op build-tijd berekend (WCAG): geel voor "beter." op blauw. */
export const derived = {
  onField: onField(theme.field),
  accentText: accentText(theme.field, theme.accent),
};

export const themeCss = `:root{--k-field:${theme.field};--k-accent:${theme.accent};--k-ink:${theme.ink};--k-paper:${theme.paper};--k-on-field:${derived.onField};--k-accent-text:${derived.accentText};}`;
