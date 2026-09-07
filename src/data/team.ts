import type { TeamMember } from './types';
import { locations } from './locations';

/* ══════════════════════════════════════════════════════════════════════════
   ⚠️  รายชื่อผู้รับผิดชอบ — แก้ไขที่นี่
   ──────────────────────────────────────────────────────────────────────────
   • name        : ชื่อ–นามสกุลจริง
   • role        : บทบาทในโครงงาน
   • classInfo   : ชั้น/เลขที่ (ใส่หรือไม่ใส่ก็ได้ ลบบรรทัดทิ้งได้)
   • locationIds : id ของสถานที่ที่รับผิดชอบ (ดู id ได้จาก src/data/locations.ts)
                   หนึ่งคนรับผิดชอบได้มากกว่าหนึ่งสถานที่

   ⚠️ อย่าลืมแก้ฟิลด์  owner  ในไฟล์ locations.ts ให้ตรงกับชื่อในนี้ด้วย
   ══════════════════════════════════════════════════════════════════════════ */

export const projectInfo = {
  /** ชื่อโครงงาน */
  title: 'TANIS ATLAS',
  /** ชื่อโครงงานภาษาไทย */
  titleTh: 'แผนที่ภูมิศาสตร์ดิจิทัล',
  /** คำโปรย */
  tagline: 'สำรวจโลกผ่านสายตาดาวเทียม',
  /** วิชา — ⬅️ แก้ไข */
  subject: 'รายวิชาภูมิศาสตร์',
  /** ระดับชั้น — ⬅️ แก้ไข */
  level: 'ชั้นมัธยมศึกษาปีที่ —',
  /** โรงเรียน — ⬅️ แก้ไข */
  school: 'ชื่อโรงเรียน',
  /** ครูผู้สอน — ⬅️ แก้ไข */
  teacher: 'ชื่อครูผู้สอน',
  /** ปีการศึกษา — ⬅️ แก้ไข */
  academicYear: 'ปีการศึกษา ๒๕๖๘',
  /** กำหนดส่ง */
  dueDate: '16 กันยายน',
};

export const team: TeamMember[] = [
  {
    name: 'ชื่อผู้รับผิดชอบ 1', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['tokyo-disneyland'],
  },
  {
    name: 'ชื่อผู้รับผิดชอบ 2', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['giza-pyramids'],
  },
  {
    name: 'ชื่อผู้รับผิดชอบ 3', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['great-barrier-reef'],
  },
  {
    name: 'ชื่อผู้รับผิดชอบ 4', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['amazon-rainforest'],
  },
  {
    name: 'ชื่อผู้รับผิดชอบ 5', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['grand-canyon'],
  },
  {
    name: 'ชื่อผู้รับผิดชอบ 6', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['eiffel-tower'],
  },
  {
    name: 'ชื่อผู้รับผิดชอบ 7', // ⬅️ แก้ไข
    role: 'ผู้จัดทำข้อมูลสถานที่',
    classInfo: 'ชั้น — เลขที่ —',
    locationIds: ['mount-everest'],
  },
];

/** รวมข้อมูลสมาชิกเข้ากับสถานที่ที่รับผิดชอบ — ใช้สร้างทั้งการ์ดและตาราง */
export const teamWithLocations = team.map((member) => ({
  ...member,
  places: member.locationIds
    .map((id) => locations.find((l) => l.id === id))
    .filter((l): l is (typeof locations)[number] => Boolean(l)),
}));
