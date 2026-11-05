// Kopieert het Sveltia CMS (uit node_modules) naar public/admin/cms, zodat het van de eigen site wordt geladen
// (geen externe scripts nodig, past in de CSP). Draait automatisch vóór build en dev (zie package.json).
import fs from 'node:fs';
import path from 'node:path';

const from = path.resolve('node_modules/@sveltia/cms/dist');
const to = path.resolve('public/admin/cms');
if (!fs.existsSync(from)) {
  console.error('copy-cms: @sveltia/cms ontbreekt. Draai eerst "npm ci".');
  process.exit(1);
}
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true, filter: (src) => !src.endsWith('.map') && !src.endsWith('.mjs') });
console.log('copy-cms: Sveltia CMS gekopieerd naar public/admin/cms');
