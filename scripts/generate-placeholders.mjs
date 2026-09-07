/**
 * สร้างภาพ placeholder แบบ SVG สำหรับทั้ง 7 สถานที่
 * รันด้วย:  node scripts/generate-placeholders.mjs
 * ภาพจะถูกเขียนลงที่ public/images/placeholder-01.svg ... placeholder-07.svg
 *
 * เมื่อได้ภาพจริงแล้ว ให้วางไฟล์ภาพใน public/images/ และแก้ image.src
 * ในไฟล์ src/data/locations.ts — ไม่จำเป็นต้องรันสคริปต์นี้อีก
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/images');
mkdirSync(outDir, { recursive: true });

// โทนสีของแต่ละสถานที่ (ไล่จากอุ่นไปเย็น) — [สีเข้ม, สีเน้น]
const themes = [
  ['#12203c', '#e9b44c'],
  ['#231a34', '#f08b4e'],
  ['#07272e', '#3ed6c0'],
  ['#0d2a1e', '#6fce6a'],
  ['#2a1a1d', '#e2705a'],
  ['#161b34', '#9b87f5'],
  ['#101c2c', '#7fb7e8'],
];

const W = 1600;
const H = 1000;

/** เส้นคอนทัวร์แบบสุ่มด้วย seed คงที่ เพื่อให้ผลลัพธ์เหมือนเดิมทุกครั้ง */
function contours(seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const paths = [];
  for (let i = 0; i < 9; i++) {
    const cy = H * 0.5 + (i - 4) * 46;
    let d = `M -40 ${cy.toFixed(1)}`;
    for (let x = 0; x <= W + 80; x += 80) {
      const y = cy + Math.sin((x / W) * Math.PI * (2 + rnd())) * (26 + i * 5) + (rnd() - 0.5) * 14;
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
}

for (let i = 0; i < 7; i++) {
  const n = String(i + 1).padStart(2, '0');
  const [base, accent] = themes[i];
  const lines = contours(i + 1)
    .map(
      (d, k) =>
        `<path d="${d}" fill="none" stroke="${accent}" stroke-width="1.1" opacity="${(0.05 + k * 0.018).toFixed(3)}"/>`,
    )
    .join('\n    ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Placeholder image ${n}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="100%" stop-color="#05080f"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="28%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity=".28"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-width="1" opacity=".045"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <g>
    ${lines}
  </g>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- crosshair -->
  <g stroke="${accent}" fill="none" opacity=".55">
    <circle cx="${W / 2}" cy="${H / 2}" r="118" stroke-width="1.2" opacity=".45"/>
    <circle cx="${W / 2}" cy="${H / 2}" r="72" stroke-width="1.6"/>
    <path d="M${W / 2} ${H / 2 - 170}V${H / 2 - 96}M${W / 2} ${H / 2 + 96}V${H / 2 + 170}M${W / 2 - 170} ${H / 2}H${W / 2 - 96}M${W / 2 + 96} ${H / 2}H${W / 2 + 170}" stroke-width="1.4"/>
  </g>
  <circle cx="${W / 2}" cy="${H / 2}" r="9" fill="${accent}"/>

  <!-- index -->
  <text x="96" y="${H - 96}" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="150" font-weight="500" fill="${accent}" opacity=".9">${n}</text>
  <text x="96" y="152" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="26" letter-spacing="6" fill="#ffffff" opacity=".5">REPLACE  THIS  IMAGE</text>
  <text x="96" y="192" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="20" letter-spacing="2" fill="#ffffff" opacity=".3">public / images / placeholder-${n}.svg</text>

  <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${accent}" stroke-width="2" opacity=".18"/>
</svg>
`;
  writeFileSync(resolve(outDir, `placeholder-${n}.svg`), svg, 'utf8');
}

console.log('สร้างภาพตัวอย่าง 7 ไฟล์เรียบร้อยที่ public/images/');
