import { getCollection, type CollectionEntry } from 'astro:content';
import { luminance, palette } from './contrast';

// Placeholder-cases zijn alleen zichtbaar in dev of met PUBLIC_SHOW_PLACEHOLDERS=1.
// Productiebuilds publiceren dus nooit onvolledige of voorbeeldinhoud als casepagina.
const showPlaceholders = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === '1';

export type WorkEntry = CollectionEntry<'cases'>;

/** Alle werk voor het overzicht (cases en projecten zonder case), op volgorde. */
export async function getWorkItems() {
  const all = await getCollection('cases');
  return all.filter((c) => !c.data.draft).sort((a, b) => a.data.order - b.data.order);
}

/** Heeft dit item een eigen casepagina? Anders is het een teaser ("Case volgt"). */
export function hasCasePage(e: WorkEntry) {
  return e.data.kind === 'case' && (showPlaceholders || !e.data.placeholder);
}

/** Casepagina's, in dezelfde volgorde als het overzicht (voor "Volgende case"). */
export async function getPublishedCases() {
  return (await getWorkItems()).filter(hasCasePage);
}

export async function getServices() {
  const all = await getCollection('services');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Leesbare tekstkleur (inkt of papier) op een achtergrondkleur. */
export function textOn(bg: string) {
  return luminance(bg) > 0.3 ? palette.ink : palette.paper;
}

/** Website van een klant, gezocht op naam (klantnaam of projecttitel, hoofdletterongevoelig). Geen website bekend = null. */
export async function getClientSites() {
  const map = new Map<string, string>();
  for (const e of await getWorkItems()) {
    if (!e.data.website) continue;
    for (const n of [e.data.client, e.data.title]) if (n) map.set(n.trim().toLowerCase(), e.data.website);
  }
  return (name: string) => map.get(name.trim().toLowerCase()) ?? null;
}
