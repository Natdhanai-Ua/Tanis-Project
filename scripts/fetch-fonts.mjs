/**
 * ดาวน์โหลดฟอนต์จาก Google Fonts มาเก็บไว้ในโครงการ (self-host)
 * รันด้วย:  node scripts/fetch-fonts.mjs
 *
 * เหตุผล: เว็บไซต์จะแสดงฟอนต์ถูกต้องแม้ไม่มีอินเทอร์เน็ตในวันนำเสนอ
 * ผลลัพธ์:  src/assets/fonts/*.woff2  และ  src/styles/fonts.css
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// เก็บไว้ใน src เพื่อให้ Vite จัดการเส้นทางไฟล์และแคชให้ถูกต้องทุกกรณี
const fontDir = resolve(root, 'src/assets/fonts');
mkdirSync(fontDir, { recursive: true });

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const FAMILIES = [
  'Plus+Jakarta+Sans:wght@400;500;600;700',
  'IBM+Plex+Sans+Thai:wght@400;500;600;700',
  'IBM+Plex+Mono:wght@400;500',
];

const url = `https://fonts.googleapis.com/css2?${FAMILIES.map((f) => `family=${f}`).join('&')}&display=swap`;

const res = await fetch(url, { headers: { 'User-Agent': UA } });
if (!res.ok) throw new Error(`โหลด CSS ไม่สำเร็จ: ${res.status}`);
let css = await res.text();

/* เก็บเฉพาะชุดอักขระที่เว็บไซต์ใช้จริง เพื่อลดขนาดไฟล์ */
const KEEP = ['thai', 'latin', 'latin-ext'];
css = css
  .split(/(?=\/\* [a-z-]+ \*\/)/)
  .filter((block) => {
    const m = block.match(/^\/\* ([a-z-]+) \*\//);
    return !m || KEEP.includes(m[1]);
  })
  .join('');

const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]))];
console.log(`พบไฟล์ฟอนต์ ${urls.length} ไฟล์ กำลังดาวน์โหลด...`);

let done = 0;
for (const u of urls) {
  const name = u.split('/').slice(-2).join('-').replace(/[^\w.-]/g, '_');
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`โหลดไม่สำเร็จ: ${u} (${r.status})`);
  writeFileSync(resolve(fontDir, name), Buffer.from(await r.arrayBuffer()));
  css = css.split(u).join(`../assets/fonts/${name}`);
  done++;
}

const header = `/* ═══════════════════════════════════════════════════════════════
   ฟอนต์ที่เก็บไว้ในโครงการ (self-hosted) — สร้างอัตโนมัติ
   สร้างใหม่ได้ด้วยคำสั่ง:  node scripts/fetch-fonts.mjs
   ห้ามแก้ไขไฟล์นี้ด้วยมือ
   ที่มา: Google Fonts — Plus Jakarta Sans (ละติน), IBM Plex Sans Thai (ไทย), IBM Plex Mono (ตัวเลข)
   สัญญาอนุญาต: SIL Open Font License 1.1
   ═══════════════════════════════════════════════════════════════ */

`;
writeFileSync(resolve(root, 'src/styles/fonts.css'), header + css, 'utf8');
console.log(`เสร็จสิ้น: ดาวน์โหลด ${done} ไฟล์ และเขียน src/styles/fonts.css`);
