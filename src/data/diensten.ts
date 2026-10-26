// Eén bron voor de vier diensten: volgorde en labels. Menu, footer, home, /wat-we-doen en de werkfilters
// (na "Alles") lezen hier. Volgorde volgens handoff X v5.5; Levi en SEO & content bevestigen de definitieve volgorde.
export const DIENSTEN = [
  { id: 'webshops-commerce', label: 'Webshops & commerce' },
  { id: 'websites-digitale-ervaringen', label: 'Websites' },
  { id: 'groei-slimme-processen', label: 'Groei & slimme processen' },
  { id: 'merk-identiteit', label: 'Merk & identiteit' },
] as const;

export type DienstId = (typeof DIENSTEN)[number]['id'];
export const DIENST_IDS = DIENSTEN.map((d) => d.id) as [DienstId, ...DienstId[]];
export const dienstHref = (id: DienstId) => `/wat-we-doen/${id}`;
export const dienstLabels = Object.fromEntries(DIENSTEN.map((d) => [d.id, d.label])) as Record<DienstId, string>;
export const dienstOrder = (id: DienstId) => DIENSTEN.findIndex((d) => d.id === id) + 1;
