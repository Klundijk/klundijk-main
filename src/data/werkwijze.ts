// Werkwijze-teksten (gedeeld door home, Over, Wat we doen en de dienstpagina's). De tekst staat in teksten/werkwijze.json
// (bewerkbaar via het CMS); hier alleen de vorm. Volgorde en benaming van de zes stappen is nog niet bevestigd (open punt in Notion).
import w from './teksten/werkwijze.json';

export const principles = w.uitgangspunten;

// Over-pagina (bord X · Over): de drie uitgangspunten van de dienstpagina's plus een vierde.
export const principlesAbout = [...w.uitgangspunten, w.extraUitgangspunt];

export const principlesHeading = w.kop;
export const procesKicker = w.procesKicker;
export const steps = w.stappen.map((s) => s.title);
export const stappen = w.stappen;

// Doel van "Meer over onze werkwijze": de Over-pagina.
export const werkwijzeHref = '/over';
export const werkwijzeMeer = w.meerLabel;
