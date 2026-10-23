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
  // Nog aan te leveren (Aanleverlijst in Notion): telefoon, e-mail, KvK/btw, socials.
  contact: { email: null as string | null, phone: null as string | null, location: 'Veendam' },
} as const;

/** Placeholder-inhoud (nog te leveren) alleen tonen in dev of met PUBLIC_SHOW_PLACEHOLDERS=1. */
export const showPlaceholders = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === '1';
