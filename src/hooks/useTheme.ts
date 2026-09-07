import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'tanis-atlas-theme';

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'dark';

  // 1. ค่าที่ผู้ใช้เคยเลือกไว้บนเครื่องนี้
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* เบราว์เซอร์โหมดส่วนตัวอาจอ่านค่าไม่ได้ */
  }

  // 2. ค่าที่หน้าเว็บถูกฝังมาพร้อมกำหนดไว้แล้ว (เช่นเวลาเปิดผ่านตัวแสดงผลอื่น)
  const stamped = document.documentElement.getAttribute('data-theme');
  if (stamped === 'dark' || stamped === 'light') return stamped;

  // 3. ค่าเริ่มต้นของเว็บไซต์คือโหมดมืด ตามแนวคิดการออกแบบ
  return 'dark';
}

/** จัดการโหมดสว่าง/มืด และจดจำค่าที่ผู้ใช้เลือกไว้ */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#070C18' : '#F6F7FA');
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* โหมดส่วนตัวของเบราว์เซอร์อาจบันทึกไม่ได้ */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}
