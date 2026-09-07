import { useCallback, useMemo, useState } from 'react';
import { Hero } from './components/Hero';
import { SectionHead } from './components/SectionHead';
import { LocationCard } from './components/LocationCard';
import { TechSection } from './components/TechSection';
import { TeamSection } from './components/TeamSection';
import { SiteFooter } from './components/SiteFooter';
import { LocationDetail } from './components/LocationDetail';
import { locations, LOCATION_COUNT } from './data/locations';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggle } = useTheme();
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const openIndex = useMemo(
    () => (openId ? locations.findIndex((l) => l.id === openId) : -1),
    [openId],
  );
  const openLocation = openIndex >= 0 ? locations[openIndex] : null;

  /** เลือกสถานที่: เลื่อนแผนที่ไปหาหมุด แล้วเปิดแผ่นข้อมูล */
  const select = useCallback((id: string) => {
    setFocusedId(id);
    setOpenId(id);
  }, []);

  const step = useCallback((delta: number) => {
    setOpenId((cur) => {
      const i = cur ? locations.findIndex((l) => l.id === cur) : -1;
      const next = locations[(i + delta + LOCATION_COUNT) % LOCATION_COUNT];
      setFocusedId(next.id);
      return next.id;
    });
  }, []);

  return (
    <>
      <a className="skip-link" href="#locations">
        ข้ามไปยังรายละเอียดสถานที่
      </a>

      <Hero
        theme={theme}
        onToggleTheme={toggle}
        locations={locations}
        activeId={focusedId}
        hoverId={hoverId}
        onHover={setHoverId}
        onSelect={select}
      />

      <main id="main">
        <section id="locations" className="section">
          <div className="wrap">
            <SectionHead
              eyebrow="รายละเอียดสถานที่"
              title={`${LOCATION_COUNT} สถานที่จากทั่วโลก`}
              description="แต่ละแห่งประกอบด้วยภาพประกอบ คำอธิบายลักษณะทางภูมิศาสตร์ การประยุกต์ใช้การสำรวจระยะไกล (RS) และระบบดาวเทียมนำทางโลก (GNSS) พร้อมพิกัดอ้างอิง"
            />

            <div className="entries">
              {locations.map((loc, i) => (
                <LocationCard key={loc.id} location={loc} index={i + 1} onOpen={select} />
              ))}
            </div>
          </div>
        </section>

        <TechSection />
        <TeamSection onOpen={select} />
      </main>

      <SiteFooter />

      <LocationDetail
        location={openLocation}
        index={openIndex + 1}
        total={LOCATION_COUNT}
        onClose={() => setOpenId(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </>
  );
}
