# Klundijk.com

Statische site in Astro 7 + TypeScript voor Klundijk (Veendam). Ontwerp: bord *X* van de Designer (Claude Design), inhoud en besluiten: Notion (leidend).

## Starten

```bash
npm install
npm run dev              # ontwikkelserver (placeholders zichtbaar)
npm run check            # astro check: types, content en .astro-bestanden
npm run check:contrast   # WCAG-claims van de designtokens (Node 22.12+)
npm run build            # productiebuild naar dist/
npm run verify           # check + build, zoals de CI
```

Node 22.12 of nieuwer.

## Structuur

| Pad | Inhoud |
| --- | --- |
| `src/pages/` | Routes: `/`, `/werk`, `/werk/[slug]`, `/wat-we-doen`, `/wat-we-doen/[slug]`, `/over`, `/contact`, `404`, `robots.txt` |
| `src/components/` | Header, Footer, ContactBand, ContactForm, WorkCard; `home/` = secties van de homepage |
| `src/data/` | Eén bron per soort inhoud: `site.ts` (naam, contact, navigatie), `diensten.ts` (volgorde en labels van de vier diensten), `home.ts`, `over.ts`, `overzicht.ts`, `werkwijze.ts`, `form.ts`, `theme.ts` |
| `src/content/cases`, `src/content/services` | Markdown met schema (`src/content.config.ts`) |
| `src/styles/` | `tokens.css` (vaste designtokens), `global.css` (basis, knoppen, chips) |
| `src/lib/` | `content.ts` (werk ophalen), `contrast.ts` (WCAG-berekeningen), `stage.ts` (illustraties "nu / beter") |
| `public/` | Lettertypen (zelf gehost), favicons, `og-image.png`, `work/*.webp` (1400 px + `-800`-variant) |
| `deploy/` | Hostinginstellingen voor Apache (DirectAdmin); `vercel.json` staat in de root voor previews |

Kleuren (blauw veld, oranje accent) staan op één plek in `src/data/theme.ts`; componenten gebruiken alleen CSS-variabelen.

## Inhoud toevoegen

- **Werk:** nieuw bestand in `src/content/cases/`. `kind: project` is een teaser ("Case volgt"), `kind: case` krijgt een eigen pagina zodra `placeholder: false` en de verplichte velden gevuld zijn. Beelden als `.webp` in `public/work/` (1400 px breed, plus `naam-800.webp`).
- **Diensten:** volgorde en labels in `src/data/diensten.ts`, tekst per dienst in `src/content/services/`.
- Verzin nooit casefeiten of cijfers: alleen echte, aantoonbare resultaten.

## Placeholders en indexering

- Inhoud die nog geleverd moet worden (portret, quote, resultaat, KvK, privacy) verschijnt alleen als `[placeholder]` in dev of met `PUBLIC_SHOW_PLACEHOLDERS=1`. Een gewone productiebuild bevat ze nooit.
- De site is `noindex, nofollow` en `robots.txt` blokkeert alles, tot bij livegang beide variabelen gezet worden:

```bash
SITE_URL=https://klundijk.com PUBLIC_INDEXABLE=1 npm run build
```

`SITE_URL` bepaalt canonical, `og:url` en de sitemap. Zonder die variabele valt de build terug op de Vercel-domeinnaam, anders op `https://example.invalid`.

## Livegang en hosting

- **Vercel** (previews): `vercel.json` zet beveiligings- en cacheheaders.
- **FXW / DirectAdmin** (voorstel productie): zie `deploy/apache.htaccess`. Daarin staan HTTPS, URL's zonder slash, `404.html` als foutpagina, beveiligingsheaders en caching. Dit is nog niet op de echte host getest. De 404-status moet door de host komen (`ErrorDocument`), niet door de pagina.
- De Content-Security-Policy staat `connect-src` en `form-action` toe op `https:`. Zet die vast op het echte formulier-endpoint zodra dat bekend is.

## Bewust nog open (zie Notion)

- Contactformulier: de validatie en alle staten werken, maar `src/data/form.ts` heeft nog geen `endpoint` (extern formulierplatform, serverless functie of eigen e-mailverwerking). Het formulier toont tot die tijd een nette serverfout. Reactietijd en privacytekst volgen.
- Contentbeheer (Keystatic of vergelijkbaar), domein en hosting, KvK-nummer, tekst en portret van Levi, definitieve volgorde van de diensten, cases met echte keuzes en resultaten.

## Kwaliteitsafspraken

- Geen horizontale scroll van 320 tot 1440 px; tikdoelen minimaal 44 px onder 768 px; axe 0 overtredingen; Lighthouse Accessibility en Best Practices 100.
- Beweging alleen via `opacity`, `transform` en kleur, en altijd uit bij `prefers-reduced-motion`.
- Pagina's werken zonder JavaScript: interactie (accordeon, "nu / beter", filters, menu) is een verbetering bovenop gewone HTML.
