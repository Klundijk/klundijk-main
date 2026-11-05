// Globale instellingen. Naam en structuur staan hier; de teksten, knoplabels en contactgegevens staan in teksten/instellingen.json (bewerkbaar via het CMS).
import { DIENSTEN, dienstHref, dienstLabels } from './diensten';
import i from './teksten/instellingen.json';

export const site = {
  name: 'Klundijk',
  tagline: i.tagline,
  description: i.description,
  primaryCta: { label: i.knoppen.primair, href: '/contact' },
  secondaryCta: { label: i.knoppen.secundair, href: '/werk' },
  commerceCta: { label: i.knoppen.kennismaking, href: '/contact' },
  nav: [
    { label: 'Werk', href: '/werk' },
    { label: 'Wat we doen', href: '/wat-we-doen' },
    { label: 'Over', href: '/over' },
    { label: 'Contact', href: '/contact' },
  ],
  // Dienstenpagina's onder "Wat we doen" (subnavigatie mobiel menu); volgorde en labels komen uit data/diensten.ts.
  services: DIENSTEN.map((d) => ({ label: d.label, href: dienstHref(d.id) })),
  serviceLabels: dienstLabels as Record<string, string>,
  footerLine: i.footerLine,
  // Telefoon en e-mail aangeleverd door Levi (23 okt). KvK en privacyverklaring aangeleverd (2 nov). Zolang een waarde null is,
  // wordt ze in productie niet getoond (alleen in dev als [placeholder]).
  contact: { email: (i.contact.email || null) as string | null, phone: (i.contact.phone || null) as string | null, location: i.contact.location },
  legal: { kvk: (i.kvk || null) as string | null, privacyHref: '/privacy' as string | null, termsHref: null as string | null },
} as const;

/** Placeholder-inhoud (nog te leveren) alleen tonen in dev of met PUBLIC_SHOW_PLACEHOLDERS=1. */
export const showPlaceholders = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === '1';

/** Alleen met PUBLIC_INDEXABLE=1 (bij livegang) mogen zoekmachines de site indexeren. Preview- en stagingomgevingen blijven noindex. */
export const indexable = import.meta.env.PUBLIC_INDEXABLE === '1';
