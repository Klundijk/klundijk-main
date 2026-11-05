// Inhoud van het overzicht "Wat we doen" (bord X · Wat we doen, handoff v5.7). De tekst staat in teksten/wat-we-doen.json
// (bewerkbaar via het CMS). De pills van Websites, Groei en Merk zijn een voorstel van de Designer. Volgorde komt uit data/diensten.ts.
import type { DienstId } from './diensten';
import j from './teksten/wat-we-doen.json';

export const overzicht = {
  ...j,
  // Rijen onder het uitgelichte Webshops & commerce. `example` = slug van een bestaand werk-item.
  rows: j.rows as Partial<Record<DienstId, { text: string; pills: string[]; example: string }>>,
  vraagstukken: { ...j.vraagstukken, items: j.vraagstukken.items as { text: string; dienst: DienstId }[] },
};
