import { useCallback, useMemo, useState } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { WorldMap } from './components/WorldMap';
import { LocationRail } from './components/LocationRail';
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

  /** เลือกจากแผนที่หรือรายการ: ซูมไปที่หมุด แล้วเปิดแผงรายละเอียด */
  const select = useCallback((id: string) => {
    setFocusedId(id);
    setOpenId(id);
  }, []);

  /** เปิดรายละเอียดจากส่วนอื่นของหน้า พร้อมย้ายหมุดบนแผนที่ให้ตรงกัน */
  const openFromAnywhere = useCallback((id: string) => {
    setFocusedId(id);
    setOpenId(id);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenId((cur) => {
        const i = cur ? locations.findIndex((l) => l.id === cur) : -1;
        const next = locations[(i + delta + LOCATION_COUNT) % LOCATION_COUNT];
        setFocusedId(next.id);
        return next.id;
      });
    },
    [],
  );

  return (
    <>
      <a className="skip-link" href="#map">
        ข้ามไปยังแผนที่โลก
      </a>

      <SiteHeader theme={theme} onToggleTheme={toggle} />

      <main id="main">
        <Hero onOpen={openFromAnywhere} />

        {/* ── แผนที่โลก ─────────────────────────────────────── */}
        <section id="map" className="section section--map">
          <div className="wrap">
            <SectionHead
              label="แผ่นที่ 1"
              title="แผนที่แสดงตำแหน่งสถานที่ศึกษา"
              description={`หมายเลข 1 ถึง ${LOCATION_COUNT} บนแผ่นแผนที่วางตามพิกัดละติจูดและลองจิจูดจริงของแต่ละแห่ง เลือกหมายเลขบนแผนที่หรือจากดัชนีด้านข้างเพื่อขยายและเปิดข้อมูลประกอบ`}
            />

            <div className="map-layout">
              <LocationRail
                locations={locations}
                activeId={focusedId}
                hoverId={hoverId}
                onHover={setHoverId}
                onSelect={select}
              />
              <div className="map-stage">
                <WorldMap
                  locations={locations}
                  activeId={focusedId}
                  hoverId={hoverId}
                  onHover={setHoverId}
                  onSelect={select}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── การ์ดสถานที่ทั้งหมด ───────────────────────────── */}
        <section id="locations" className="section section--tint">
          <div className="wrap">
            <SectionHead
              label="ส่วนที่ 2"
              title="รายละเอียดสถานที่ศึกษา"
              description="แต่ละรายการประกอบด้วยภาพประกอบ คำอธิบายลักษณะทางภูมิศาสตร์ การประยุกต์ใช้การสำรวจระยะไกล และระบบดาวเทียมนำทางโลก พร้อมพิกัดอ้างอิง"
            />

            <div className="entries">
              {locations.map((loc, i) => (
                <LocationCard key={loc.id} location={loc} index={i + 1} onOpen={openFromAnywhere} />
              ))}
            </div>
          </div>
        </section>

        <TechSection />
        <TeamSection onOpen={openFromAnywhere} />
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
