import { useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import type { Theme } from '../hooks/useTheme';
import { NAV_ITEMS } from '../navigation';
import { NavSheet } from './NavSheet';

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

/**
 * แถบเมนูอยู่ในคอลัมน์ซ้ายของส่วนหัว ตามโครงของเทมเพลต
 * ปุ่มแฮมเบอร์เกอร์ต้องลอยอยู่เหนือแผงเมนู จึงกำหนด z-index ไว้สูงกว่า
 * และคอลัมน์ซ้ายต้องไม่สร้าง stacking context ของตัวเอง
 */
export function SiteHeader({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [onPanel, setOnPanel] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const active = useActiveSection(NAV_ITEMS.map((i) => i.id));

  /**
   * แผงเมนูชิดขอบขวาและกว้างไม่เกิน 460px บนจอกว้างจึงอาจไม่ทับปุ่ม
   * ต้องวัดตำแหน่งจริง ไม่ใช่เดาจากจุดตัดขนาดหน้าจอ
   */
  const syncBurgerContrast = () => {
    const btn = toggleRef.current;
    const panel = document.querySelector('.navsheet__panel');
    if (!btn || !panel) return;
    const panelLeft = window.innerWidth - panel.getBoundingClientRect().width;
    setOnPanel(btn.getBoundingClientRect().right > panelLeft + 4);
  };

  useEffect(() => {
    if (!open) return;
    const onResize = () => syncBurgerContrast();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <>
      <nav className="nav" aria-label="เมนูหลัก">
        <a className="brand" href="#home">
          <span className="brand__name anim" style={{ ['--d' as string]: 2 }}>
            TANIS ATLAS
          </span>
        </a>

        <ul className="nav__links">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id} className="anim" style={{ ['--d' as string]: 4 + i }}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? 'is-active' : undefined}
                aria-current={active === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="themebtn anim"
          style={{ ['--d' as string]: 9 }}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'เปลี่ยนเป็นพื้นสว่าง' : 'เปลี่ยนเป็นพื้นมืด'}
        >
          {theme === 'dark' ? 'พื้นสว่าง' : 'พื้นมืด'}
        </button>

        <button
          className={`burger anim${open ? ' is-active' : ''}${onPanel ? ' burger--on-panel' : ''}`}
          style={{ ['--d' as string]: 10 }}
          id="navToggle"
          type="button"
          ref={toggleRef}
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          aria-controls="navSheet"
          onClick={() => {
            if (!open) syncBurgerContrast();
            setOpen((v) => !v);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <NavSheet open={open} onClose={() => setOpen(false)} toggleRef={toggleRef} />
    </>
  );
}
