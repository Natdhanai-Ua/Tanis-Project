import { HeroGlobe } from './HeroGlobe';
import { LOCATION_COUNT, COUNTRY_COUNT, CONTINENT_COUNT, locations } from '../data/locations';
import { projectInfo } from '../data/team';
import { toThaiDigits } from '../lib/format';

const stats = [
  { value: LOCATION_COUNT, label: 'สถานที่ทั่วโลก' },
  { value: COUNTRY_COUNT, label: 'ประเทศ' },
  { value: CONTINENT_COUNT, label: 'ทวีป' },
];

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__grid" />
        <span className="hero__glow hero__glow--1" />
        <span className="hero__glow hero__glow--2" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__content">
          <p className="eyebrow">
            {projectInfo.subject} · {projectInfo.academicYear}
          </p>

          <h1 className="hero__title">
            สำรวจโลก
            <br />
            ผ่าน<span className="hero__title-accent">สายตาดาวเทียม</span>
          </h1>

          <p className="hero__lead">
            แผนที่ภูมิศาสตร์ดิจิทัลที่รวบรวม <strong>{toThaiDigits(LOCATION_COUNT)} สถานที่สำคัญ</strong> จากทั่วทุกมุมโลก
            พร้อมคำอธิบายลักษณะทางภูมิศาสตร์ และการประยุกต์ใช้เทคโนโลยี
            การสำรวจระยะไกล (RS) กับระบบดาวเทียมนำทางโลก (GNSS) ในการศึกษาแต่ละพื้นที่
          </p>

          <div className="hero__cta">
            <a href="#map" className="btn btn--primary">
              <span>เริ่มสำรวจแผนที่</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </a>
            <a href="#locations" className="btn btn--ghost">
              ดูสถานที่ทั้งหมด
            </a>
          </div>

          <dl className="hero__stats">
            {stats.map((s) => (
              <div key={s.label} className="hero__stat">
                <dt className="mono">{toThaiDigits(s.value)}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
            <div className="hero__stat hero__stat--tech">
              <dt className="mono">RS · GNSS</dt>
              <dd>เทคโนโลยีภูมิสารสนเทศ</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <HeroGlobe locations={locations} />
        </div>
      </div>

      <a className="hero__scroll" href="#map" aria-label="เลื่อนลงไปยังแผนที่โลก">
        <span>เลื่อนลง</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
