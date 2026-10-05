// src/index.html → www/index.html
// Three.js (r149 UMD), Exo 2 ve Cairo (Arapça) yazı tipleri ile dil sözlüğü dosyaya gömülür; dış istek kalmaz.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = (name) => join(root, 'node_modules', name);

const threeDir = pkgDir('three');
const threeVer = JSON.parse(readFileSync(join(threeDir, 'package.json'), 'utf8')).version;
if (threeVer !== '0.149.0') throw new Error('three 0.149.0 bekleniyordu, bulunan: ' + threeVer);
const three = readFileSync(join(threeDir, 'build/three.min.js'), 'utf8').replace(/<\/script/gi, '<\\/script');

const b64 = (dir, f) => readFileSync(join(pkgDir(dir), 'files', f)).toString('base64');
const face = (family, weight, dir, file, range) =>
  `@font-face { font-family: '${family}'; font-style: normal; font-weight: ${weight}; font-display: swap;\n` +
  `  src: url(data:font/woff2;base64,${b64(dir, file)}) format('woff2');\n  unicode-range: ${range}; }`;
const EXO_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const ARABIC = 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
const fonts = [
  face('Exo 2', 600, '@fontsource/exo-2', 'exo-2-latin-ext-600-normal.woff2', EXO_EXT),
  face('Exo 2', 600, '@fontsource/exo-2', 'exo-2-latin-600-normal.woff2', LATIN),
  face('Cairo', 400, '@fontsource/cairo', 'cairo-arabic-400-normal.woff2', ARABIC),
  face('Cairo', 600, '@fontsource/cairo', 'cairo-arabic-600-normal.woff2', ARABIC),
  face('Cairo', 400, '@fontsource/cairo', 'cairo-latin-400-normal.woff2', LATIN),
  face('Cairo', 600, '@fontsource/cairo', 'cairo-latin-600-normal.woff2', LATIN)
].join('\n');

const i18n = readFileSync(join(root, 'src/i18n-ar.js'), 'utf8');

let html = readFileSync(join(root, 'src/index.html'), 'utf8');
for (const mark of ['/*@@FONTS@@*/', '/*@@THREE@@*/', '/*@@I18N@@*/']) {
  if (html.split(mark).length !== 2) throw new Error('İşaret bulunamadı veya birden fazla: ' + mark);
}
html = html.replace('/*@@FONTS@@*/', () => fonts).replace('/*@@THREE@@*/', () => three).replace('/*@@I18N@@*/', () => i18n);
if (/(src|href)=["']https?:/i.test(html.replace(/href="https:\/\/www\.google\.com\/maps[^"]*"/g, ''))) {
  console.warn('Uyarı: dış bağlantı bulundu');
}
mkdirSync(join(root, 'www'), { recursive: true });
writeFileSync(join(root, 'www/index.html'), html);
console.log('www/index.html yazıldı (' + Math.round(html.length / 1024) + ' KB)');
