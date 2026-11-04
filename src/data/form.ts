// Contactformulier: configuratie en teksten op één plek.
// Alle teksten zijn CONCEPT: SEO & content is eigenaar van de definitieve tekst (ontwerpbord X · Componenten, sectie 04).
// Verzending loopt via public/api/contact.php (PHP op de FXW-host) naar Resend; de API-sleutel staat buiten de webroot en komt uit
// GitHub-geheimen (zie README). Zolang het endpoint null is, verstuurt het formulier niets en toont het de serverfout-staat.
export const form = {
  endpoint: '/api/contact.php' as string | null,
  responseTime: null as string | null, // bijv. 'één werkdag'; null laat de zin zonder termijn
  copy: {
    summaryTitle: 'Er is iets niet goed ingevuld',
    submit: 'Versturen',
    busy: 'Versturen…',
    successKicker: 'Verzonden',
    successTitleNamed: 'Bedankt, {naam}.',
    successTitle: 'Bedankt.',
    success: (termijn: string | null) =>
      `We hebben je bericht ontvangen en reageren ${termijn ? `binnen ${termijn}` : 'zo snel mogelijk'}.`,
    successBack: 'Terug naar de homepage',
    errorTitle: 'Versturen is niet gelukt',
    errorBody: (mail: string | null) =>
      `Probeer het opnieuw${mail ? ` of stuur een mail naar ${mail}` : ''}. Je ingevulde gegevens zijn bewaard.`,
    errorNotConnected: 'Dit formulier is nog niet gekoppeld, er is dus niets verstuurd. Je ingevulde gegevens zijn bewaard.',
    retry: 'Probeer opnieuw',
    privacy: 'Door te versturen ga je akkoord met onze',
    privacyLink: 'privacyverklaring',
  },
  fields: {
    naam: { label: 'Naam', empty: 'Vul je naam in.', summary: 'vul je naam in' },
    email: {
      label: 'E-mail',
      empty: 'Vul je e-mailadres in, bijvoorbeeld naam@bedrijf.nl.',
      invalid: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.',
      summary: 'vul een geldig e-mailadres in',
    },
    bedrijf: { label: 'Bedrijf', optional: '(optioneel)' },
    vraagstuk: {
      label: 'Waar wil je iets aan verbeteren?',
      empty: 'Vertel kort waar je tegenaan loopt, dan kunnen we gericht reageren.',
      summary: 'vertel kort waar je tegenaan loopt',
    },
  },
} as const;
