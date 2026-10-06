// Hızlı kontrol: www/index.html içindeki uygulama betiği sözdizimsel olarak geçerli mi,
// dış kaynak (CDN, font, görsel) çağrısı var mı?
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../www/index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (scripts.length !== 3) throw new Error("3 <script> bekleniyordu, bulunan: " + scripts.length);
scripts.forEach((code, i) => new vm.Script(code, { filename: 'script-' + i + '.js' }));
const ext = html.match(/<(script|link|img)[^>]+(src|href)=["']https?:[^"']+/gi);
if (ext) throw new Error('Dış kaynak bulundu: ' + ext.join(', '));
for (const s of ['APP_VERSION', 'SCHEMA_VERSION', 'indexedDB', 'THREE.WebGLRenderer', 'AR_DICT', 'I18n', 'QrShare', 'jsQR', 'qrcode']) {
  if (!html.includes(s)) throw new Error('Eksik: ' + s);
}
console.log('Kontrol tamam: ' + Math.round(html.length / 1024) + ' KB, betikler geçerli, dış kaynak yok.');
