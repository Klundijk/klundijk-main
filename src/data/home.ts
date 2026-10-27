// Homepage-inhoud (bron: handoff X v5.1 / prototype). Eén plek, geen tekst in de componenten.
export const WORK = [
  { id: 'arn', title: 'Auto Restyle Noord', tags: ['Merk & identiteit', 'Website'], href: '/werk' },
  { id: 'kraaij', title: 'Kraaij AV', tags: ['Logo', 'Huisstijl', 'Website'], href: '/werk' },
  { id: 'pandan', title: 'Pandan Sisters', tags: ['Logo', 'Huisstijl'], href: '/werk' },
  { id: 'drenthe', title: 'Drenthe Caravans', tags: ['Merk', 'Website'], href: '/werk' },
  { id: 'rudi', title: 'Rudi Schipper', tags: ['Webshop', 'Automatisering'], href: '/werk' },
  { id: 'root', title: 'RootBoxes', tags: ['Logo', 'Huisstijl', 'Webshop'], href: '/werk' },
  { id: 'oakbase', title: 'OakBase', tags: ['Logo', 'Huisstijl', 'Website'], href: '/werk' },
] as const;

type Block = [x: number, y: number, w: number, h: number, rot: number, color: 'FIELD' | 'ACCENT' | 'INK' | 'PAPER', radius: number];
export interface Tile {
  id: string; num: string; label: string; heading: string; copy: string; large?: boolean;
  b: Block[]; a: Block[];
}
// Blokken in % van de tegel: [x, y, w, h, rotatie, kleur, radius]. 'b' = nu, 'a' = beter.
export const TILES: Tile[] = [
  { id: 'webshop', num: '01', label: 'Webshops & commerce', large: true,
    heading: 'Je webshop of digitale omgeving is ingewikkelder geworden dan nodig.',
    copy: 'Dan brengen we techniek, productstructuur, beheer, SEO en klantreis terug naar een logisch geheel.',
    b: [[8,12,38,30,-6,'INK',4],[40,30,34,34,5,'ACCENT',2],[18,56,44,26,-3,'PAPER',6],[66,10,24,22,8,'FIELD',2]],
    a: [[8,12,26,34,0,'FIELD',14],[38,12,26,34,0,'FIELD',14],[68,12,24,34,0,'ACCENT',14],[8,54,84,28,0,'INK',14]] },
  { id: 'website', num: '02', label: 'Websites',
    heading: 'Je website ziet er prima uit, maar doet commercieel te weinig.',
    copy: 'Dan kijken we naar boodschap, structuur, gebruikerservaring en wat bezoekers nodig hebben om verder te gaan.',
    b: [[10,10,60,20,-4,'INK',2],[30,36,50,16,3,'PAPER',2],[12,60,36,24,-2,'ACCENT',2]],
    a: [[10,10,80,24,0,'FIELD',12],[10,40,50,12,0,'INK',6],[10,60,36,22,0,'ACCENT',12]] },
  { id: 'processen', num: '03', label: 'Groei & slimme processen',
    heading: 'Je weet dat processen slimmer kunnen, maar nog niet welke technologie daarbij past.',
    copy: 'Dan beginnen we bij het proces en kiezen we pas daarna de techniek, automatisering of AI die werkelijk helpt.',
    b: [[8,20,22,22,-8,'INK',2],[50,44,22,22,10,'ACCENT',2],[20,62,22,18,-4,'PAPER',2]],
    a: [[8,40,20,22,0,'FIELD',50],[40,40,20,22,0,'ACCENT',50],[72,40,20,22,0,'INK',50]] },
  { id: 'merk', num: '04', label: 'Merk & identiteit',
    heading: 'Je merk past niet meer bij het bedrijf dat je bent geworden.',
    copy: 'Dan helpen we om positie, uitstraling en middelen opnieuw op één lijn te brengen.',
    b: [[8,14,30,30,-10,'ACCENT',2],[44,22,28,28,12,'INK',2],[22,56,34,26,-5,'PAPER',2]],
    a: [[10,14,34,34,0,'FIELD',50],[50,14,34,34,0,'ACCENT',50],[10,56,74,24,0,'INK',14]] },
];

export const SERVICES = {
  hub: { num: '01', title: 'Webshops & commerce',
    tags: ['Nieuwe webshops', 'Redesign & migratie', 'Productdata & koppelingen', 'Beheer & optimalisatie'],
    cta: { label: 'Plan een kennismaking', href: '/contact' }, more: { label: 'Bekijk webshops & commerce', href: '/wat-we-doen' },
    image: 'RootBoxes — logo, huisstijl en webshop' },
  rows: [
    { num: '02', title: 'Websites' },
    { num: '03', title: 'Groei & slimme processen' },
    { num: '04', title: 'Merk & identiteit' },
  ],
};

export const CLIENTS = ['Kraaij AV','Drenthe Caravans','Voetbalkooi Nederland','Auto Restyle Groningen','Auto Restyle Noord','Rudi Schipper','Buurmeijer Automotive','Pandan Sisters','RootBoxes'];

export const STEPS = ['Begrijpen','Adviseren','Kiezen','Maken of regisseren','Meten','Verbeteren'];
