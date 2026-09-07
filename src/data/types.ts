/**
 * โครงสร้างข้อมูลกลางของเว็บไซต์ TANIS ATLAS
 * ไฟล์นี้เป็น "สัญญา" ของข้อมูล — ไม่ต้องแก้ไขเวลาเปลี่ยนเนื้อหา
 * ต้องการเปลี่ยนเนื้อหา ให้ไปที่ src/data/locations.ts และ src/data/team.ts
 */

/** คู่ป้ายกำกับ–ค่า ใช้แสดงข้อมูลเป็นแถวในการ์ด */
export interface FactRow {
  label: string;
  value: string;
}

/** บล็อกเนื้อหาเทคโนโลยี (ใช้ร่วมกันทั้ง RS และ GNSS) */
export interface TechBlock {
  /** ประโยคนำ 1–3 บรรทัด อธิบายภาพรวม */
  lead: string;
  /** รายการหัวข้อย่อย แนะนำ 3 แถว */
  points: FactRow[];
}

export interface LocationImage {
  /** พาธของรูป เช่น "images/tokyo-disneyland.jpg" (วางไฟล์ไว้ในโฟลเดอร์ public/images) */
  src: string;
  /** คำอธิบายรูปสำหรับผู้ใช้โปรแกรมอ่านหน้าจอ */
  alt: string;
  /** แหล่งที่มาของภาพ — ควรใส่เสมอเมื่อใช้ภาพจริง */
  credit?: string;
}

export interface GeoLocation {
  /** รหัสเฉพาะ ใช้ทำลิงก์ ห้ามซ้ำ และควรเป็นตัวอักษรภาษาอังกฤษ */
  id: string;
  /** ชื่อสถานที่ (ภาษาไทย) */
  name: string;
  /** ชื่อทางการ/ชื่อสากล แสดงเป็นบรรทัดรอง */
  officialName: string;
  /** ประเทศ (ภาษาไทย) */
  country: string;
  /** ธงประเทศแบบอิโมจิ เช่น "🇯🇵" */
  flag: string;
  /** ทวีป (ภาษาไทย) */
  continent: string;
  /** พิกัดภูมิศาสตร์ — ใช้วางหมุดบนแผนที่โลก ต้องถูกต้อง */
  coordinates: { lat: number; lng: number };
  /** สรุปสั้น 1 ประโยค แสดงบนการ์ดตัวอย่างและบนแผนที่ */
  summary: string;
  /** ภาพประกอบสถานที่ */
  image: LocationImage;
  /** คำอธิบายทางภูมิศาสตร์ */
  geography: {
    description: string;
    facts: FactRow[];
  };
  /** Remote Sensing — การสำรวจระยะไกล */
  remoteSensing: TechBlock;
  /** GNSS — ระบบดาวเทียมนำทางโลก */
  gnss: TechBlock;
  /** ชื่อผู้รับผิดชอบสถานที่นี้ (ต้องตรงกับชื่อใน team.ts) */
  owner: string;
  /**
   * true = ยังเป็นข้อมูลตัวอย่าง เว็บไซต์จะขึ้นป้าย "ข้อมูลตัวอย่าง"
   * เปลี่ยนเป็น false เมื่อใส่ข้อมูลจริงครบแล้ว
   */
  isPlaceholder: boolean;
}

export interface TeamMember {
  /** ชื่อ–นามสกุล */
  name: string;
  /** บทบาทในโครงงาน เช่น "หัวหน้ากลุ่ม", "ผู้จัดทำข้อมูล" */
  role: string;
  /** ชั้น/เลขที่ (ถ้ามี) */
  classInfo?: string;
  /** id ของสถานที่ที่รับผิดชอบ อ้างอิงจาก locations.ts */
  locationIds: string[];
}
