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
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12.5" />
              <path d="M16 3.5v25M3.5 16h25" />
              <ellipse cx="16" cy="16" rx="6" ry="12.5" />
              <circle cx="16" cy="16" r="2.4" className="brand__dot" />
            </svg>
          </span>
          <span className="brand__text">
            <strong>TANIS ATLAS</strong>
            <small>แผนที่ภูมิศาสตร์ดิจิทัล</small>
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
            aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
            title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {theme === 'dark' ? (
                <>
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8" />
                </>
              ) : (
                <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z" />
              )}
            </svg>
            <span className="visually-hidden">สลับโหมดสีของเว็บไซต์</span>
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
