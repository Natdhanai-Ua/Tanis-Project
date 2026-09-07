import { locations, LOCATION_COUNT, COUNTRY_COUNT, CONTINENT_COUNT } from '../data/locations';
import { projectInfo } from '../data/team';
import { formatCoords, pad2 } from '../lib/format';

interface Props {
  onOpen: (id: string) => void;
}

/**
 * หน้าปกของโครงงาน — จัดวางตามแบบหน้าชื่อเรื่องและสารบัญของหนังสืออ้างอิง
 * ด้านซ้ายเป็นชื่อเรื่องกับข้อมูลบรรณานุกรม ด้านขวาเป็นสารบัญสถานที่
 */
export function Hero({ onOpen }: Props) {
  return (
    <section id="home" className="title-plate">
      <div className="wrap title-plate__inner">
        <div className="title-plate__main">
          <p className="title-plate__kicker label label--wide">Atlas of Seven Places</p>

          <h1 className="title-plate__title">
            แผนที่ภูมิศาสตร์
            <br />
            เจ็ดสถานที่ทั่วโลก
          </h1>

          <hr className="rule title-plate__rule" />

          <p className="title-plate__abstract">
            เอกสารประกอบการศึกษาภูมิศาสตร์กายภาพและภูมิศาสตร์มนุษย์
            ผ่านกรณีศึกษา {LOCATION_COUNT} แห่งใน {CONTINENT_COUNT} ทวีป
            แต่ละแห่งอธิบายลักษณะภูมิประเทศและภูมิอากาศ ควบคู่กับการประยุกต์ใช้
            การสำรวจระยะไกล (Remote Sensing) และระบบดาวเทียมนำทางโลก (GNSS)
            ในการศึกษาพื้นที่นั้น
          </p>

          <dl className="colophon">
            <div><dt>รายวิชา</dt><dd>{projectInfo.subject}</dd></div>
            <div><dt>ระดับชั้น</dt><dd>{projectInfo.level}</dd></div>
            <div><dt>สถานศึกษา</dt><dd>{projectInfo.school}</dd></div>
            <div><dt>ครูผู้สอน</dt><dd>{projectInfo.teacher}</dd></div>
            <div><dt>ปีการศึกษา</dt><dd>{projectInfo.academicYear}</dd></div>
            <div><dt>กำหนดส่ง</dt><dd>{projectInfo.dueDate}</dd></div>
          </dl>

          <p className="title-plate__tally">
            <span>{LOCATION_COUNT} สถานที่</span>
            <span>{COUNTRY_COUNT} ประเทศ</span>
            <span>{CONTINENT_COUNT} ทวีป</span>
          </p>

          <div className="title-plate__actions">
            <a href="#map" className="btn btn--solid">ไปยังแผนที่โลก</a>
            <a href="#locations" className="btn btn--line">อ่านรายละเอียดสถานที่</a>
          </div>
        </div>

        <nav className="contents" aria-label="สารบัญสถานที่">
          <p className="contents__head label label--wide">สารบัญสถานที่</p>
          <ol className="contents__list">
            {locations.map((loc, i) => (
              <li key={loc.id}>
                <button type="button" className="contents__row" onClick={() => onOpen(loc.id)}>
                  <span className="contents__no mono">{pad2(i + 1)}</span>
                  <span className="contents__text">
                    <span className="contents__name">{loc.name}</span>
                    <span className="contents__sub">{loc.country} · {loc.continent}</span>
                  </span>
                  <span className="contents__coords mono">{formatCoords(loc.coordinates)}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
