import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' ทำให้เว็บเปิดได้ทั้งบน GitHub Pages, Netlify หรือเปิดจากโฟลเดอร์โดยตรง
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});
