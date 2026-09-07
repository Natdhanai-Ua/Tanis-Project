import { SectionHead } from './SectionHead';
import { teamWithLocations } from '../data/team';
import { pad2 } from '../lib/format';
import { locations } from '../data/locations';

interface Props {
  onOpen: (id: string) => void;
}

export function TeamSection({ onOpen }: Props) {
  return (
    <section id="team" className="section">
      <div className="wrap">
        <SectionHead
          label="ภาคผนวก ข"
          title="ผู้รับผิดชอบแต่ละสถานที่"
          description="รายชื่อสมาชิกในกลุ่มและขอบเขตความรับผิดชอบในการค้นคว้าและเรียบเรียงข้อมูล"
        />

        <div className="roster">
          <table className="table">
            <caption className="visually-hidden">
              ตารางแสดงลำดับ สถานที่ ประเทศ ทวีป และผู้รับผิดชอบ
            </caption>
            <thead>
              <tr>
                <th scope="col" className="table__num">ลำดับ</th>
                <th scope="col">สถานที่</th>
                <th scope="col">ประเทศ</th>
                <th scope="col">ทวีป</th>
                <th scope="col">ผู้รับผิดชอบ</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc, i) => (
                <tr key={loc.id}>
                  <td className="mono table__num">{pad2(i + 1)}</td>
                  <td>
                    <button type="button" className="table__link" onClick={() => onOpen(loc.id)}>
                      {loc.name}
                    </button>
                  </td>
                  <td>{loc.country}</td>
                  <td>{loc.continent}</td>
                  <td>{loc.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="members">
          {teamWithLocations.map((m, i) => (
            <li key={`${m.name}-${i}`} className="member">
              <p className="member__no mono">{pad2(i + 1)}</p>
              <p className="member__name">{m.name}</p>
              <p className="member__role">{m.role}</p>
              {m.classInfo && <p className="member__class">{m.classInfo}</p>}
              <ul className="member__places">
                {m.places.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => onOpen(p.id)}>{p.name}</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
