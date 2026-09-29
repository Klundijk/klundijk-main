# Klundijk website (technische proef, fase 1)

Static-first site in Astro + TypeScript. Dit is een **proef**, geen definitief ontwerp: de art-direction-gate uit het ontwikkelplan (Notion) staat nog open. Kleuren, typografie en componenten zijn bewust neutraal.

## Starten

```bash
npm install
npm run dev        # ontwikkelserver
npm run check      # type- en contentcontrole
npm run build      # productiebuild naar dist/
```

Placeholder-cases (`placeholder: true`) verschijnen alleen in dev of met `PUBLIC_SHOW_PLACEHOLDERS=1`. Een gewone productiebuild bevat ze nooit.

## Wat er staat

- Contentmodel (`src/content.config.ts`): `cases` en `services` volgens de content blueprint. Bron-onafhankelijk: lokale Markdown nu, headless CMS later mogelijk.
- Routes: `/`, `/werk`, `/werk/[slug]`, `/wat-we-doen`, `/wat-we-doen/[slug]` (vier eigen capabilityroutes), `/over`, `/contact`, 404, sitemap en robots.
- Homepage in de vastgestelde volgorde (9 blokken), met conceptcopy.
- Basis voor SEO (title, description, canonical, Open Graph, Organization JSON-LD), toegankelijkheid (skip-link, focus, semantiek, reduced motion) en designtokens (`src/styles/tokens.css`).

## Bewust nog open (zie Notion, Aanleverlijst)

- Naam/merk, zichtbaarheid van Levi, contentbeheer (Git of CMS-interface), domein en hosting.
- Contactformulier: uitgeschakeld tot de formulierarchitectuur is gekozen (externe formservice, serverless functie of Astro-adapter).
- Echte cases, teksten, beeld, logo en bedrijfsgegevens.
- `site` in `astro.config.mjs` is een placeholder tot het domein bekend is.

## Meetresultaten proef (Lighthouse, mobiel, lokale preview)

Performance, Accessibility en SEO 100 op Home, Contact en een dienstpagina; Best Practices 96. De placeholder-casepagina scoort 66 op SEO omdat ze bewust `noindex` heeft. Lighthouse is een regressiegate; handmatige toegankelijkheidsronde en echte Core Web Vitals volgen later.
