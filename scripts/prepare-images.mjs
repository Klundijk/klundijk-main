// Maakt voor elk werkbeeld in public/work (webp) een -800-variant als die nog ontbreekt. De site gebruikt die voor kleine schermen
// en de miniaturen. Zo hoeft een redacteur via het CMS maar één beeld te uploaden. Bestaande varianten blijven ongemoeid.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/work');
if (!fs.existsSync(dir)) process.exit(0);
let made = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.webp') || f.endsWith('-800.webp')) continue;
  const small = path.join(dir, f.replace(/\.webp$/, '-800.webp'));
  if (fs.existsSync(small)) continue;
  await sharp(path.join(dir, f)).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(small);
  made++;
  console.log('prepare-images: ' + path.basename(small) + ' gemaakt');
}
if (!made) console.log('prepare-images: alle varianten aanwezig');
