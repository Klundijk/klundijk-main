import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Contentmodel uit de "Website research & content blueprint".
// Bron-onafhankelijk: dezelfde velden kunnen later uit een headless CMS komen.

const seo = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(170).optional(),
});

const serviceId = z.enum(['merk-identiteit', 'websites-digitale-ervaringen', 'webshops-commerce', 'groei-slimme-processen']);
const image = z.object({ src: z.string(), alt: z.string().default(''), position: z.string().optional().describe('CSS object-position voor de uitsnede, bijv. "left top"') });

// Eén collectie voor alle werk: `kind: project` is een teaser op het werkoverzicht zonder eigen pagina ("Case volgt"),
// `kind: case` krijgt een casepagina. Casemodules die leeg zijn, worden niet getoond (geen placeholder-blokken in productie).
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z
    .object({
      title: z.string(),
      kind: z.enum(['case', 'project']).default('project'),
      order: z.number().int().default(99).describe('Volgorde op het werkoverzicht'),
      tags: z.array(z.string()).default([]).describe('Labels op de kaart, bijv. "Merk & identiteit", "Website"'),
      services: z.array(serviceId).default([]),
      excerpt: z.string().optional().describe('Eén regel op de kaart'),
      cardColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#DAD5CB').describe('Achtergrond van kaart en hero zolang er geen beeld is'),
      cardImage: image.optional(),
      // Casepagina
      promise: z.string().optional().describe('Korte case-belofte: opgave of uitkomst in een regel'),
      client: z.string().optional(),
      sector: z.string().optional(),
      year: z.number().int().optional(),
      scope: z.array(z.string()).default([]),
      technology: z.array(z.string()).optional(),
      heroImage: image.optional(),
      challengeHeading: z.string().optional(),
      challenge: z.string().optional(),
      approachHeading: z.string().optional(),
      approach: z.string().optional(),
      choices: z.array(z.object({ title: z.string(), reason: z.string() })).max(3).default([]),
      detailImages: z.array(image).max(2).default([]),
      executionHeading: z.string().default('Wat Klundijk deed.'),
      executionImage: image.optional(),
      resultHeading: z.string().optional(),
      result: z.string().optional(),
      metrics: z.array(z.object({ label: z.string(), value: z.string() })).max(3).optional(),
      quote: z.object({ text: z.string(), author: z.string(), role: z.string() }).optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      placeholder: z.boolean().default(false).describe('True = niet publiceren als casepagina (nog niet compleet of voorbeeldinhoud)'),
      seo: seo.optional(),
    })
    .superRefine((d, ctx) => {
      if (d.kind === 'case' && !d.placeholder) {
        for (const k of ['promise', 'excerpt', 'challenge', 'approach', 'result'] as const) {
          if (!d[k]) ctx.addIssue({ code: 'custom', path: [k], message: `${k} is verplicht voor een gepubliceerde case` });
        }
      }
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    shortIntro: z.string(),
    heroStatement: z.string(),
    situations: z.array(z.string()),
    outcomes: z.array(z.string()),
    deliverables: z.array(z.string()),
    approach: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    // Dienstpagina (patroon bord X · Commerce). Alles optioneel: ontbreekt een blok, dan wordt het niet getoond.
    heroText: z.string().optional().describe('Intro in de hero; standaard shortIntro'),
    momentsHeading: z.string().optional(),
    moments: z.array(z.object({ title: z.string(), text: z.string() })).max(4).default([]),
    projectsHeading: z.string().default('Ons werk.'),
    contactHeading: z.string().optional(),
    contactText: z.string().optional(),
    concept: z.boolean().default(true).describe('Tekst is concept en nog niet beoordeeld door SEO & content (badge alleen in dev)'),
    seo: seo.optional(),
  }),
});

export const collections = { cases, services };
