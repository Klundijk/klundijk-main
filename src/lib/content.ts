import { getCollection } from 'astro:content';

// Placeholder-cases zijn alleen zichtbaar in dev of met PUBLIC_SHOW_PLACEHOLDERS=1.
// Productiebuilds publiceren dus nooit voorbeeldinhoud.
const showPlaceholders = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === '1';

export async function getPublishedCases() {
  const all = await getCollection('cases');
  return all.filter((c) => !c.data.draft && (showPlaceholders || !c.data.placeholder)).sort((a, b) => b.data.year - a.data.year);
}

export async function getServices() {
  const all = await getCollection('services');
  return all.sort((a, b) => a.data.order - b.data.order);
}
