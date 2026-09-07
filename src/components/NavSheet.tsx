import { useEffect, useRef } from 'react';
import { NAV_ITEMS } from '../navigation';

const Arrow = ({ size = 22 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

interface Props {
  open: boolean;
  onClose: () => void;
  /** ปุ่มแฮมเบอร์เกอร์ ใช้คืนโฟกัสเมื่อปิดด้วยปุ่ม Escape */
  toggleRef: React.RefObject<HTMLButtonElement>;
}

/** เมนูที่เลื่อนเข้าจากขอบขวา — เข้าช้าแบบผ่อนออก ปิดเร็วกว่าและใช้เส้นโค้งคนละแบบ */
export function NavSheet({ open, onClose, toggleRef }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, toggleRef]);

  return (
    <div
      className={`navsheet${open ? ' is-open' : ''}`}
      id="navSheet"
      ref={sheetRef}
      {...(open ? {} : { inert: '' })}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t.hasAttribute('data-nav-close') || t.closest('a')) onClose();
      }}
    >
      <div className="navsheet__scrim" data-nav-close />

      <nav className="navsheet__panel" aria-label="เมนู">
        <ul className="navsheet__list">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id} style={{ ['--i' as string]: i }}>
              <a className="navsheet__link" href={`#${item.id}`}>
                {item.label}
                <Arrow />
              </a>
            </li>
          ))}
        </ul>

        <div className="navsheet__foot">
          <a className="navsheet__cta" href="#map">
            เริ่มสำรวจแผนที่
            <Arrow size={16} />
          </a>
          <p className="navsheet__note">
            โครงงานภูมิศาสตร์ · สำรวจ 7 สถานที่ทั่วโลก
            <br />
            พร้อมข้อมูล RS และ GNSS
          </p>
        </div>
      </nav>
    </div>
  );
}
