// Globale instellingen. Naam en contactgegevens zijn bewust op één plek gezet:
// het besluit "blijft het Klundijk?" staat nog open in Notion.
export const site = {
  name: 'Klundijk',
  tagline: 'Digitaal kan beter. Dus maken we het beter.',
  description:
    'Klundijk helpt bedrijven vooruit met sterke merken, websites, commerce en slimme digitale oplossingen.',
  primaryCta: { label: 'Bespreek je vraagstuk', href: '/contact' },
  secondaryCta: { label: 'Bekijk ons werk', href: '/werk' },
  nav: [
    { label: 'Werk', href: '/werk' },
    { label: 'Wat we doen', href: '/wat-we-doen' },
    { label: 'Over', href: '/over' },
    { label: 'Contact', href: '/contact' },
  ],
  // Nog aan te leveren (zie Aanleverlijst in Notion): bedrijfsgegevens, e-mail, socials.
  contact: { email: '[e-mailadres volgt]', location: 'Veendam' },
} as const;
