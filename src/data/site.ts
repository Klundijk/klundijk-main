// Globale instellingen. Naam en contactgegevens staan op één plek.
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
  // Dienstenpagina's onder "Wat we doen" (subnavigatie mobiel menu). Volgorde is een voorstel van de Designer
  // (v5.2) en nog niet bevestigd door Levi en SEO & content.
  services: [
    { label: 'Webshops & commerce', href: '/wat-we-doen/webshops-commerce' },
    { label: 'Websites', href: '/wat-we-doen/websites-digitale-ervaringen' },
    { label: 'Groei & slimme processen', href: '/wat-we-doen/groei-slimme-processen' },
    { label: 'Merk & identiteit', href: '/wat-we-doen/merk-identiteit' },
  ],
  // Labels van de vier capabilities en hun volgorde in de werkfilters (bord X · Werk).
  serviceLabels: {
    'merk-identiteit': 'Merk & identiteit',
    'websites-digitale-ervaringen': 'Websites',
    'webshops-commerce': 'Webshops & commerce',
    'groei-slimme-processen': 'Groei & slimme processen',
  } as Record<string, string>,
  footerLine: 'Digitale partner voor merk, websites, webshops en slimme processen.',
  // Nog aan te leveren door Levi (Aanleverlijst in Notion): telefoon, e-mail, KvK. Zolang een waarde null is,
  // wordt ze in productie niet getoond (alleen in dev als [placeholder]).
  contact: { email: null as string | null, phone: null as string | null, location: 'Veendam' },
  legal: { kvk: null as string | null, privacyHref: null as string | null, termsHref: null as string | null },
} as const;

/** Placeholder-inhoud (nog te leveren) alleen tonen in dev of met PUBLIC_SHOW_PLACEHOLDERS=1. */
export const showPlaceholders = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === '1';
