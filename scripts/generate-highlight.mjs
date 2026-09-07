/**
 * สร้างภาพพื้นหลังสำหรับคำที่ถูกเน้นในหัวเรื่องหน้าแรก (คำว่า "โลก,")
 * รันด้วย:  node scripts/generate-highlight.mjs
 * ผลลัพธ์:  src/assets/highlight-texture.svg
 *
 * เก็บไว้ในโครงการเพื่อให้เว็บไซต์ทำงานได้แม้ไม่มีอินเทอร์เน็ต
 * ต้องการเปลี่ยนเป็นภาพถ่ายจริง ให้วางไฟล์ใน public/images แล้วแก้ตัวแปร
 * --highlight-img ในไฟล์ src/styles/tokens.css
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'src/assets');
mkdirSync(outDir, { recursive: true });

const W = 900;
const H = 300;

/** เส้นชั้นความสูงจำลอง ใช้ค่าคงที่เพื่อให้ผลลัพธ์เหมือนเดิมทุกครั้ง */
let seed = 20260916;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

const contours = Array.from({ length: 7 }, (_, i) => {
  const cy = 40 + i * 38;
  let d = `M -20 ${cy.toFixed(1)}`;
  for (let x = 0; x <= W + 40; x += 45) {
    const y = cy + Math.sin((x / W) * Math.PI * (2.2 + rnd() * 0.8)) * (16 + i * 3) + (rnd() - 0.5) * 8;
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  return `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="${(0.07 + i * 0.012).toFixed(3)}"/>`;
}).join('\n    ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="">
  <defs>
    <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d4f6b"/>
      <stop offset="46%" stop-color="#0a6f86"/>
      <stop offset="100%" stop-color="#07314a"/>
    </linearGradient>
    <radialGradient id="lift" cx="34%" cy="26%" r="72%">
      <stop offset="0%" stop-color="#3fb8c9" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#3fb8c9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sea)"/>
  <rect width="${W}" height="${H}" fill="url(#lift)"/>
  <g>
    ${contours}
  </g>
</svg>
`;

writeFileSync(resolve(outDir, 'highlight-texture.svg'), svg, 'utf8');
console.log('สร้างไฟล์ src/assets/highlight-texture.svg เรียบร้อย');
