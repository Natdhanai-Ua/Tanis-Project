import { SiteHeader } from './SiteHeader';
import { WorldMap } from './WorldMap';
import type { Theme } from '../hooks/useTheme';
import type { GeoLocation } from '../data/types';
import { LOCATION_COUNT, COUNTRY_COUNT, CONTINENT_COUNT } from '../data/locations';

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
  locations: GeoLocation[];
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * ส่วนหัวของหน้าแรก
 *
 * ลำดับใน DOM สำคัญ: .hero__media ต้องมาก่อน .hero__left แล้วค่อยสลับ
 * ลำดับการแสดงผลด้วย order เพื่อให้คอลัมน์ซ้ายวาดทับการ์ดแผนที่ได้
 * โดยไม่ต้องกำหนด z-index — ถ้ากำหนด z-index ให้ .hero__left
 * มันจะสร้าง stacking context ของตัวเอง แล้วปุ่มแฮมเบอร์เกอร์
 * จะจมอยู่ใต้แผงเมนู
 */
export function Hero({ theme, onToggleTheme, locations, activeId, hoverId, onHover, onSelect }: Props) {
  return (
    <section id="home" className="hero">
      <div className="hero__media anim anim--media" style={{ ['--d' as string]: 0 }}>
        <WorldMap
          locations={locations}
          activeId={activeId}
          hoverId={hoverId}
          onHover={onHover}
          onSelect={onSelect}
        />
      </div>

      <div className="hero__left">
        <SiteHeader theme={theme} onToggleTheme={onToggleTheme} />

        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__line anim" style={{ ['--d' as string]: 11 }}>
              สำรวจ<span className="hl">โลก</span>
            </span>
            <span className="hero__line anim" style={{ ['--d' as string]: 12 }}>
              ผ่านสายตาดาวเทียม
            </span>
          </h1>

          <p className="hero__text anim" style={{ ['--d' as string]: 13 }}>
            โครงงานภูมิศาสตร์ที่พาไปสำรวจ {LOCATION_COUNT} สถานที่สำคัญจาก {CONTINENT_COUNT} ทวีปทั่วโลก
            แต่ละแห่งอธิบายลักษณะภูมิประเทศและภูมิอากาศ ควบคู่กับการใช้การสำรวจระยะไกล
            และระบบดาวเทียมนำทางโลกในการศึกษาพื้นที่นั้น
          </p>

          <div className="hero__actions">
            <a className="cta anim" style={{ ['--d' as string]: 14 }} href="#locations">
              <span className="cta__label">อ่านรายละเอียดสถานที่</span>
              <span className="cta__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          </div>

          <dl className="tally anim" style={{ ['--d' as string]: 15 }}>
            <div>
              <dt className="mono">{LOCATION_COUNT}</dt>
              <dd>สถานที่</dd>
            </div>
            <div>
              <dt className="mono">{COUNTRY_COUNT}</dt>
              <dd>ประเทศ</dd>
            </div>
            <div>
              <dt className="mono">{CONTINENT_COUNT}</dt>
              <dd>ทวีป</dd>
            </div>
            <div>
              <dt className="mono">RS · GNSS</dt>
              <dd>เทคโนโลยีภูมิสารสนเทศ</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
