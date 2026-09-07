import { useEffect, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import type { Theme } from '../hooks/useTheme';
import { NAV_ITEMS } from '../navigation';

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

export function SiteHeader({ theme, onToggleTheme }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_ITEMS.map((i) => i.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    return () => document.body.classList.remove('is-locked');
  }, [open]);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header__inner wrap">
        <a className="brand" href="#home" onClick={() => setOpen(false)}>
          <span className="brand__text">
            <strong>แผนที่ภูมิศาสตร์เจ็ดสถานที่ทั่วโลก</strong>
            <small className="mono">TANIS ATLAS</small>
          </span>
        </a>

        <nav className={`nav${open ? ' is-open' : ''}`} aria-label="เมนูหลัก">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'is-active' : undefined}
                  aria-current={active === item.id ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'เปลี่ยนเป็นพื้นสว่าง' : 'เปลี่ยนเป็นพื้นมืด'}
          >
            {theme === 'dark' ? 'พื้นสว่าง' : 'พื้นมืด'}
          </button>

          <button
            type="button"
            className={`burger${open ? ' is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
