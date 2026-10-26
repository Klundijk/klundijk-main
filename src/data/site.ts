// Globale instellingen. Naam en contactgegevens staan op één plek.
import { DIENSTEN, dienstHref, dienstLabels } from './diensten';

export const site = {
  name: 'Klundijk',
  tagline: 'Digitaal kan beter. Dus maken we het beter.',
  description:
    'Klundijk helpt bedrijven vooruit met sterke merken, websites, webshops en slimme digitale oplossingen. We beginnen bij het vraagstuk, niet bij het platform.',
  primaryCta: { label: 'Bespreek je vraagstuk', href: '/contact' },
  secondaryCta: { label: 'Bekijk ons werk', href: '/werk' },
  commerceCta: { label: 'Plan een kennismaking', href: '/contact' },
  nav: [
    { label: 'Werk', href: '/werk' },
    { label: 'Wat we doen', href: '/wat-we-doen' },
    { label: 'Over', href: '/over' },
    { label: 'Contact', href: '/contact' },
  ],
  // Dienstenpagina's onder "Wat we doen" (subnavigatie mobiel menu); volgorde en labels komen uit data/diensten.ts.
  services: DIENSTEN.map((d) => ({ label: d.label, href: dienstHref(d.id) })),
  serviceLabels: dienstLabels as Record<string, string>,
  footerLine: 'Digitale partner voor merk, websites, webshops en slimme processen.',
  // Telefoon en e-mail aangeleverd door Levi (23 okt). Nog aan te leveren: KvK. Zolang een waarde null is,
  // wordt ze in productie niet getoond (alleen in dev als [placeholder]).
  contact: { email: 'info@klundijk.com' as string | null, phone: '06 83 79 30 22' as string | null, location: 'Veendam' },
  legal: { kvk: null as string | null, privacyHref: null as string | null, termsHref: null as string | null },
} as const;

/** Placeholder-inhoud (nog te leveren) alleen tonen in dev of met PUBLIC_SHOW_PLACEHOLDERS=1. */
export const showPlaceholders = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === '1';

/** Alleen met PUBLIC_INDEXABLE=1 (bij livegang) mogen zoekmachines de site indexeren. Preview- en stagingomgevingen blijven noindex. */
export const indexable = import.meta.env.PUBLIC_INDEXABLE === '1';
