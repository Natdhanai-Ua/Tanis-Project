import { projectInfo } from '../data/team';
import { NAV_ITEMS } from '../navigation';
import { LOCATION_COUNT } from '../data/locations';
import { toThaiDigits } from '../lib/format';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <p className="footer__logo">TANIS ATLAS</p>
          <p className="footer__tagline">
            {projectInfo.titleTh} · {projectInfo.tagline}
          </p>
          <p className="footer__note">
            เว็บไซต์นำเสนอ {toThaiDigits(LOCATION_COUNT)} สถานที่สำคัญทั่วโลก
            พร้อมการประยุกต์ใช้ RS และ GNSS ในการศึกษาภูมิศาสตร์
          </p>
        </div>

        <div className="footer__col">
          <h4>เมนู</h4>
          <ul>
            {NAV_ITEMS.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`}>{i.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>ข้อมูลโครงงาน</h4>
          <dl className="footer__meta">
            <div><dt>รายวิชา</dt><dd>{projectInfo.subject}</dd></div>
            <div><dt>ระดับชั้น</dt><dd>{projectInfo.level}</dd></div>
            <div><dt>โรงเรียน</dt><dd>{projectInfo.school}</dd></div>
            <div><dt>ครูผู้สอน</dt><dd>{projectInfo.teacher}</dd></div>
            <div><dt>กำหนดส่ง</dt><dd>{projectInfo.dueDate}</dd></div>
          </dl>
        </div>
      </div>

      <div className="wrap footer__bar">
        <p>© {projectInfo.academicYear} · {projectInfo.title}</p>
        <p className="mono">แผนที่ฐาน: Natural Earth (สาธารณสมบัติ)</p>
      </div>
    </footer>
  );
}
