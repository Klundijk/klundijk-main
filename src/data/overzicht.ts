// Inhoud van het overzicht "Wat we doen" (bord X · Wat we doen, handoff v5.7). Conceptteksten: SEO & content beoordeelt.
// De pills van Websites, Groei en Merk zijn een voorstel van de Designer. Volgorde komt uit data/diensten.ts.
import type { DienstId } from './diensten';

export const overzicht = {
  eyebrow: 'Wat we doen',
  title: ['Vier terreinen.', 'Eén aanspreekpunt.'],
  lead: 'We helpen met webshops, websites, groei en slimme processen en merk. We beginnen bij je vraagstuk, adviseren eerst en kiezen daarna de techniek die past.',
  commerce: {
    badge: 'Zwaartepunt',
    lead: 'Je webshop of digitale omgeving is ingewikkelder geworden dan nodig. Dan brengen we techniek, productstructuur, beheer, SEO en klantreis terug naar een logisch geheel.',
    topics: ['Nieuwe webshops', 'Redesign & migratie', 'Productdata & koppelingen', 'Beheer & optimalisatie'],
    cta: 'Bekijk webshops & commerce',
  },
  // Rijen onder het uitgelichte Webshops & commerce. `example` = slug van een bestaand werk-item.
  rows: {
    'websites-digitale-ervaringen': {
      text: "Websites, landingspagina's en digitale omgevingen die duidelijk maken wie je bent en bezoekers helpen verder te gaan.",
      pills: ['Boodschap & structuur', 'Ontwerp & UX', 'Bouw & beheer'],
      example: 'auto-restyle-noord',
    },
    'groei-slimme-processen': {
      text: 'Optimalisatie, analytics, SEO, conversie, koppelingen, automatisering en passende AI-toepassingen na een goede diagnose.',
      pills: ['Analytics & SEO', 'Conversie', 'Koppelingen & automatisering'],
      example: 'rudi-schipper',
    },
    'merk-identiteit': {
      text: 'Van positionering en visuele identiteit tot logo, huisstijl en middelen die in de praktijk werken.',
      pills: ['Positionering', 'Logo & huisstijl', 'Middelen'],
      example: 'kraaij-av',
    },
  } as Partial<Record<DienstId, { text: string; pills: string[]; example: string }>>,
  vraagstukken: {
    kicker: 'Niet zeker welke je nodig hebt?',
    title: 'Begin bij je vraagstuk.',
    items: [
      { text: 'Mijn webshop is ingewikkelder geworden dan nodig.', dienst: 'webshops-commerce' },
      { text: 'Mijn website ziet er prima uit, maar doet commercieel te weinig.', dienst: 'websites-digitale-ervaringen' },
      { text: 'Er gaat te veel tijd zitten in handwerk dat anders kan.', dienst: 'groei-slimme-processen' },
      { text: 'Mijn merk past niet meer bij het bedrijf dat ik ben geworden.', dienst: 'merk-identiteit' },
    ] as { text: string; dienst: DienstId }[],
  },
  werkwijze: { kicker: 'Hoe we werken' },
};
