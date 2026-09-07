/**
 * รวมเว็บไซต์ทั้งหมดให้เหลือไฟล์ HTML ไฟล์เดียว
 *
 * รันด้วย:  npm run build:single
 *
 * ผลลัพธ์:  dist/tanis-atlas.html
 *   ไฟล์เดียวจบ — ฝังทั้ง CSS, JavaScript, ฟอนต์ และภาพไว้ข้างในหมดแล้ว
 *   ก๊อปใส่แฟลชไดรฟ์ ส่งทางอีเมล หรือดับเบิลคลิกเปิดได้เลย ไม่ต้องมีอินเทอร์เน็ต
 *   เหมาะสำหรับวันนำเสนอที่ไม่แน่ใจว่าจะต่อเน็ตได้หรือไม่
 *
 * ต้องรัน `npm run build` ก่อนเสมอ
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const assets = resolve(dist, 'assets');

if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('ไม่พบ dist/index.html — กรุณารัน `npm run build` ก่อน');
  process.exit(1);
}

const MIME = {
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const dataUri = (file) =>
  `data:${MIME[extname(file).toLowerCase()] ?? 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`;

let html = readFileSync(resolve(dist, 'index.html'), 'utf8');

/* ── 1. ฝัง CSS พร้อมฟอนต์ ──────────────────────────────────── */
const cssName = html.match(/href="\.\/assets\/([^"]+\.css)"/)?.[1];
if (!cssName) throw new Error('ไม่พบไฟล์ CSS ใน dist/index.html');
let css = readFileSync(resolve(assets, cssName), 'utf8');

let fontCount = 0;
let cssAssetCount = 0;
css = css.replace(/url\(([^)]*?\.(?:woff2?|svg|png|jpe?g|webp))\)/g, (whole, rawPath) => {
  const clean = rawPath.replace(/^["']|["']$/g, '').replace(/^\.?\/?assets\//, '');
  const file = resolve(assets, clean);
  if (!existsSync(file)) return whole;
  if (/\.woff2?$/.test(clean)) fontCount++;
  else cssAssetCount++;
  return `url(${dataUri(file)})`;
});

/* ── 2. ฝัง JavaScript พร้อมภาพสถานที่ ──────────────────────── */
const jsName = html.match(/src="\.\/assets\/([^"]+\.js)"/)?.[1];
if (!jsName) throw new Error('ไม่พบไฟล์ JavaScript ใน dist/index.html');
let js = readFileSync(resolve(assets, jsName), 'utf8');

/* ภาพใน public/images ถูกอ้างอิงเป็นพาธสัมพัทธ์ จึงต้องแปลงเป็น data URI */
const imgDir = resolve(dist, 'images');
let imageCount = 0;
if (existsSync(imgDir)) {
  for (const name of readdirSync(imgDir)) {
    if (!MIME[extname(name).toLowerCase()]) continue;
    const ref = `images/${name}`;
    if (!js.includes(ref)) continue;
    js = js.split(ref).join(dataUri(resolve(imgDir, name)));
    imageCount++;
  }
}

/* กันไม่ให้เนื้อหาในสคริปต์ไปปิดแท็กก่อนเวลา */
const safeJs = js.replace(/<\/script/gi, '<\\/script');
const safeCss = css.replace(/<\/style/gi, '<\\/style');

/* ── 3. เขียนไฟล์เดียวจบ ────────────────────────────────────── */
html = html
  .replace(/\s*<script type="module"[^>]*src="\.\/assets\/[^"]+\.js"><\/script>/, '')
  .replace(
    /\s*<link rel="stylesheet"[^>]*href="\.\/assets\/[^"]+\.css">/,
    `\n    <style>\n${safeCss}\n    </style>`,
  )
  .replace('</body>', `  <script type="module">\n${safeJs}\n    </script>\n  </body>`);

const out = resolve(dist, 'tanis-atlas.html');
writeFileSync(out, html, 'utf8');

const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(`เขียนไฟล์ dist/tanis-atlas.html เรียบร้อย (${mb} MB)`);
console.log(`  ฝังฟอนต์ ${fontCount} ไฟล์ · ฝังภาพจาก CSS ${cssAssetCount} ไฟล์ · ฝังภาพสถานที่ ${imageCount} ไฟล์`);
