import { projectInfo } from '../data/team';
import { NAV_ITEMS } from '../navigation';

/** ท้ายเล่ม — บันทึกที่มาของข้อมูลและตัวอักษรตามธรรมเนียมหนังสืออ้างอิง */
export function SiteFooter() {
  return (
    <footer className="colophon-foot">
      <div className="wrap">
        <hr className="rule" />
        <div className="colophon-foot__grid">
          <div>
            <p className="label label--wide">โครงงาน</p>
            <p className="colophon-foot__title">แผนที่ภูมิศาสตร์เจ็ดสถานที่ทั่วโลก</p>
            <p className="colophon-foot__sub">
              {projectInfo.subject} · {projectInfo.academicYear}
            </p>
          </div>

          <div>
            <p className="label label--wide">สารบัญ</p>
            <ul className="colophon-foot__links">
              {NAV_ITEMS.map((i) => (
                <li key={i.id}><a href={`#${i.id}`}>{i.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label label--wide">ที่มาของข้อมูลแผนที่</p>
            <p className="colophon-foot__note">
              ขอบเขตประเทศจากชุดข้อมูล Natural Earth มาตราส่วน 1:110,000,000 (สาธารณสมบัติ)
              แสดงผลด้วยเส้นโครงแผนที่แบบ Natural Earth
            </p>
          </div>

          <div>
            <p className="label label--wide">ตัวอักษร</p>
            <p className="colophon-foot__note">
              Noto Serif Thai · Sarabun · IBM Plex Mono
              <br />
              เผยแพร่ภายใต้ SIL Open Font License 1.1
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
