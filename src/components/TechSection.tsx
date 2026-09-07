import { SectionHead } from './SectionHead';

const TECHS = [
  {
    key: 'rs',
    abbr: 'RS',
    title: 'การสำรวจระยะไกล',
    en: 'Remote Sensing',
    lead: 'การเก็บข้อมูลพื้นผิวโลกด้วยเซนเซอร์ที่ติดตั้งบนดาวเทียม เครื่องบิน หรืออากาศยานไร้คนขับ โดยไม่ต้องสัมผัสวัตถุโดยตรง อาศัยการตรวจวัดคลื่นแม่เหล็กไฟฟ้าที่วัตถุสะท้อนหรือแผ่ออกมา',
    points: [
      { label: 'หลักการทำงาน', value: 'เซนเซอร์รับคลื่นแม่เหล็กไฟฟ้าที่พื้นผิวโลกสะท้อนหรือแผ่ออกมา แล้วแปลงเป็นภาพและค่าตัวเลข' },
      { label: 'ประเภทของระบบ', value: 'ระบบพาสซีฟ (อาศัยแสงอาทิตย์) เช่น กล้องถ่ายภาพ และระบบแอกทีฟ (ส่งสัญญาณเอง) เช่น เรดาร์และ LiDAR' },
      { label: 'ประโยชน์ทางภูมิศาสตร์', value: 'ทำแผนที่การใช้ที่ดิน ติดตามการเปลี่ยนแปลงของป่าไม้และชายฝั่ง เฝ้าระวังภัยพิบัติ และศึกษาการเปลี่ยนแปลงภูมิอากาศ' },
    ],
  },
  {
    key: 'gnss',
    abbr: 'GNSS',
    title: 'ระบบดาวเทียมนำทางโลก',
    en: 'Global Navigation Satellite System',
    lead: 'ระบบดาวเทียมที่ส่งสัญญาณเวลาที่แม่นยำมายังเครื่องรับบนพื้นโลก เพื่อคำนวณตำแหน่ง ความเร็ว และเวลา โดยต้องรับสัญญาณจากดาวเทียมอย่างน้อย 4 ดวงพร้อมกัน',
    points: [
      { label: 'หลักการทำงาน', value: 'คำนวณระยะทางจากเวลาที่สัญญาณเดินทาง แล้วหาจุดตัดของทรงกลมจากดาวเทียมหลายดวงเพื่อระบุพิกัด' },
      { label: 'ระบบหลักของโลก', value: 'GPS (สหรัฐอเมริกา), GLONASS (รัสเซีย), Galileo (สหภาพยุโรป), BeiDou (จีน) และระบบเสริมภูมิภาคอย่าง QZSS และ NavIC' },
      { label: 'ประโยชน์ทางภูมิศาสตร์', value: 'งานรังวัดและทำแผนที่ ระบุพิกัดจุดเก็บข้อมูลภาคสนาม ติดตามการเคลื่อนตัวของเปลือกโลก และการนำทาง' },
    ],
  },
] as const;

export function TechSection() {
  return (
    <section id="technology" className="section section--tech">
      <div className="wrap">
        <SectionHead
          index={3}
          eyebrow="เทคโนโลยีภูมิสารสนเทศ"
          title="RS และ GNSS คืออะไร"
          description="ทั้งสองเทคโนโลยีเป็นเครื่องมือสำคัญของการศึกษาภูมิศาสตร์สมัยใหม่ RS ตอบคำถามว่า “พื้นที่นั้นมีอะไรและเปลี่ยนแปลงอย่างไร” ส่วน GNSS ตอบคำถามว่า “สิ่งนั้นอยู่ที่ตำแหน่งใดอย่างแม่นยำ”"
        />

        <div className="tech-grid">
          {TECHS.map((t) => (
            <article key={t.key} className={`tech tech--${t.key} reveal`}>
              <div className="tech__head">
                <span className="tech__badge mono">{t.abbr}</span>
                <span className="tech__icon" aria-hidden="true">
                  {t.key === 'rs' ? <IconSensor /> : <IconSignal />}
                </span>
              </div>
              <h3 className="tech__title">{t.title}</h3>
              <p className="tech__en mono">{t.en}</p>
              <p className="tech__lead">{t.lead}</p>
              <dl className="tech__points">
                {t.points.map((p) => (
                  <div key={p.label}>
                    <dt>{p.label}</dt>
                    <dd>{p.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconSensor() {
  return (
    <svg viewBox="0 0 40 40">
      <path d="M6 30h28" />
      <path d="M20 6l-9 18h18L20 6Z" />
      <path d="M13.5 19h13" />
      <circle cx="20" cy="13" r="1.6" />
    </svg>
  );
}

function IconSignal() {
  return (
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="24" r="3" />
      <path d="M13.5 30.5a9 9 0 0 1 0-13M26.5 17.5a9 9 0 0 1 0 13" />
      <path d="M9 35a15 15 0 0 1 0-22M31 13a15 15 0 0 1 0 22" />
      <path d="M20 21V8" />
    </svg>
  );
}
