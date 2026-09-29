import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Contentmodel uit de "Website research & content blueprint".
// Bron-onafhankelijk: dezelfde velden kunnen later uit een headless CMS komen.

const seo = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(170).optional(),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    promise: z.string().describe('Korte case-belofte: opgave of uitkomst in een regel'),
    client: z.string(),
    sector: z.string(),
    year: z.number().int(),
    excerpt: z.string(),
    services: z.array(z.enum(['merk-identiteit', 'websites-digitale-ervaringen', 'webshops-commerce', 'groei-slimme-processen'])),
    scope: z.array(z.string()).default([]),
    technology: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().default(''),
    challenge: z.string(),
    approach: z.string(),
    result: z.string(),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    quote: z.object({ text: z.string(), author: z.string(), role: z.string() }).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    placeholder: z.boolean().default(false).describe('True = voorbeeldinhoud, nooit publiceren'),
    seo: seo.optional(),
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
    seo: seo.optional(),
  }),
});

export const collections = { cases, services };
