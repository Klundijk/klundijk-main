// Homepage-inhoud (bron: ontwerpbord X · Home / X · Mobiel). Eén plek, geen tekst in de componenten.
// Het werk op de homepage komt uit de collectie `cases`; de diensten uit data/diensten.ts.
import type { Art } from '../lib/stage';
import { DIENSTEN, dienstHref, type DienstId } from './diensten';
import { overzicht } from './overzicht';
import h from './teksten/home.json';
import i from './teksten/instellingen.json';
import { stappen } from './werkwijze';

// Illustraties van de vier situaties. Volgorde en nummers volgen data/diensten.ts, zodat 01-04 op de hele pagina
// dezelfde dienst betekenen (in het bord staan Merk en Processen hier omgewisseld t.o.v. de diensten eronder).
const ART: Record<DienstId, Art> = {
  'webshops-commerce': { blocks: [
    { b: [14, 14, 70, 200, 0, '#C9CCD1', 0], a: [14, 14, 312, 20, 0, '#111111', 0] },
    { b: [96, 14, 60, 70, -4, '#E59866', 0], a: [14, 46, 100, 82, 0, '#DAD5CB', 0] },
    { b: [166, 30, 80, 50, 5, '#85C1E9', 0], a: [120, 46, 100, 82, 0, '#DAD5CB', 0] },
    { b: [254, 12, 70, 90, -2, '#F7DC6F', 0], a: [226, 46, 100, 82, 0, '#DAD5CB', 0] },
    { b: [100, 100, 90, 60, 3, '#BB8FCE', 0], a: [14, 136, 100, 82, 0, '#DAD5CB', 0] },
    { b: [200, 120, 56, 80, -6, '#82E0AA', 0], a: [120, 136, 100, 82, 0, '#DAD5CB', 0] },
    { b: [264, 130, 60, 56, 4, '#F1948A', 0], a: [226, 136, 100, 82, 0, '#DAD5CB', 0] },
  ] },
  'websites-digitale-ervaringen': { blocks: [
    { b: [20, 16, 300, 22, 0, '#BDBDBD', 0], a: [20, 16, 300, 22, 0, '#111111', 0] },
    { b: [20, 50, 180, 90, -1, '#9AA5B1', 0], a: [20, 50, 300, 84, 0, 'FIELD', 0] },
    { b: [210, 56, 90, 26, 3, '#E74C3C', 3], a: [36, 92, 110, 30, 0, 'ACCENT', 0] },
    { b: [218, 88, 96, 26, -4, '#F1C40F', 3], a: [190, 107, 0, 0, 0, '#F1C40F', 0] },
    { b: [206, 120, 84, 26, 6, '#2ECC71', 3], a: [190, 107, 0, 0, 0, '#2ECC71', 0] },
    { b: [20, 156, 80, 70, 3, '#D5D8DC', 0], a: [20, 150, 94, 74, 0, '#DAD5CB', 0] },
    { b: [108, 164, 110, 56, -2, '#D5D8DC', 0], a: [123, 150, 94, 74, 0, '#DAD5CB', 0] },
    { b: [226, 150, 94, 80, 2, '#D5D8DC', 0], a: [226, 150, 94, 74, 0, '#DAD5CB', 0] },
  ] },
  'groei-slimme-processen': { blocks: [
    { b: [30, 40, 38, 38, 0, '#E67E22', 6], a: [20, 101, 38, 38, 0, '#111111', 6] },
    { b: [150, 150, 38, 38, 0, '#3498DB', 6], a: [110, 101, 38, 38, 0, '#111111', 6] },
    { b: [250, 50, 38, 38, 0, '#9B59B6', 6], a: [200, 101, 38, 38, 0, '#111111', 6] },
    { b: [90, 170, 38, 38, 0, '#1ABC9C', 19], a: [290, 101, 38, 38, 0, 'ACCENT', 19] },
  ], lines: [[0, 1, false], [1, 2, false], [2, 3, false], [0, 2, true], [1, 3, true]] },
  'merk-identiteit': { blocks: [
    { b: [30, 40, 70, 70, -8, '#E8A33D', 35], a: [30, 40, 56, 56, 0, '#111111', 10] },
    { b: [118, 62, 150, 18, 4, '#C0392B', 2], a: [104, 46, 120, 14, 0, '#111111', 0] },
    { b: [110, 100, 190, 8, -3, '#2E86C1', 2], a: [104, 70, 72, 8, 0, '#8A857A', 0] },
    { b: [30, 150, 40, 40, 10, '#8E44AD', 6], a: [30, 150, 56, 56, 0, 'FIELD', 0] },
    { b: [84, 168, 28, 50, -14, '#27AE60', 6], a: [98, 150, 56, 56, 0, '#111111', 0] },
    { b: [120, 150, 60, 30, 8, '#F39C12', 6], a: [166, 150, 56, 56, 0, 'ACCENT', 0] },
    { b: [190, 176, 36, 36, 22, '#16A085', 18], a: [280, 178, 0, 0, 0, '#16A085', 0] },
  ] },
};

// Teksten van de vier situaties staan in teksten/home.json (bewerkbaar via het CMS).
const SITUATIES = h.situaties.items as Record<DienstId, { heading: string; copy: string }>;

export const TILES = DIENSTEN.map((d, i) => ({
  id: d.id, num: String(i + 1).padStart(2, '0'), label: d.label, ...SITUATIES[d.id], art: ART[d.id],
}));

// Illustratie van het proces (bord X · Home): de website-tegel, die per stap verder "beter" wordt.
export const PROCES_ART: Art = ART['websites-digitale-ervaringen'];

// Op de homepage is de uitspraak ("We bouwen webshops.") de kop; de dienstnaam staat er klein bij en blijft de linknaam.
const ITEMS = h.diensten.items as Record<DienstId, { statement: string; text: string }>;

export const SERVICES = {
  hub: {
    num: '01', title: ITEMS[DIENSTEN[0].id].statement, label: DIENSTEN[0].label,
    text: ITEMS[DIENSTEN[0].id].text,
    tags: overzicht.commerce.topics,
    cta: { label: i.knoppen.kennismaking, href: '/contact' },
    more: { label: h.diensten.hubMore, href: dienstHref('webshops-commerce') },
    imageCase: 'rootboxes',
    imageCaption: h.diensten.hubImageCaption,
  },
  rows: DIENSTEN.slice(1).map((d, i) => ({
    num: String(i + 2).padStart(2, '0'), title: ITEMS[d.id].statement, label: d.label, href: dienstHref(d.id),
    text: ITEMS[d.id].text,
  })),
};

// Uitgelichte case op de homepage. De vraag en uitvoering komen uit teksten/home.json; keuze is nog te leveren
// (Levi en SEO & content) en verschijnt alleen in dev als placeholder. Nooit cijfers verzinnen.
export const HOME_CASE = {
  slug: 'auto-restyle-noord',
  kicker: h.case.kicker,
  title: h.case.title,
  more: h.case.more,
  cols: [
    { k: 'Vraagstuk', v: (h.case.vraagstuk || null) as string | null, ph: '[Wat was het vraagstuk? Levi en SEO & content vullen aan.]' },
    { k: 'Belangrijkste keuze', v: ((h.case as { keuze?: string }).keuze || null) as string | null, ph: '[Welke keuze maakte het verschil? Levi en SEO & content vullen aan.]' },
    { k: 'Uitvoering', v: (h.case.uitvoering || null) as string | null, ph: '[Wat deed Klundijk? Levi en SEO & content vullen aan.]' },
    { k: 'Resultaat', v: (h.case.resultaat || null) as string | null, ph: '' },
  ],
  slot: { kicker: 'Slot — tweede uitgelichte case', title: '[Webshop-case — bijv. Acta Buitenleven, zodra aantoonbaar]', note: 'Alleen met echte resultaten en toestemming.' },
};

// De vier fasen komen uit teksten/werkwijze.json; `t` is de voortgang van de illustratie (0 = begin, 1 = klaar).
const T = [0, 0.4, 0.75, 1];
export const STEPS = stappen.map((s, n) => ({ ...s, t: T[n] ?? 1 }));

export const OVER = {
  ...h.over,
  portraitCaption: 'Levi, [functie] bij Klundijk',
};

export const CLIENTS = h.klanten.namen;
export const HOME_TEXT = h;
