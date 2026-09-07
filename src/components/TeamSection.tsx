import { SectionHead } from './SectionHead';
import { teamWithLocations, projectInfo } from '../data/team';
import { pad2 } from '../lib/format';
import { locations } from '../data/locations';

interface Props {
  onOpen: (id: string) => void;
}

export function TeamSection({ onOpen }: Props) {
  return (
    <section id="team" className="section section--team">
      <div className="wrap">
        <SectionHead
          index={4}
          eyebrow="คณะผู้จัดทำ"
          title="ผู้รับผิดชอบแต่ละสถานที่"
          description="รายชื่อสมาชิกในกลุ่มและสถานที่ที่แต่ละคนรับผิดชอบค้นคว้าและเรียบเรียงข้อมูล"
        />

        <div className="team-grid">
          {teamWithLocations.map((m, i) => (
            <article key={`${m.name}-${i}`} className="member reveal">
              <div className="member__top">
                <span className="member__avatar" aria-hidden="true">
                  {m.name.trim().charAt(0)}
                </span>
                <span className="member__no mono">{pad2(i + 1)}</span>
              </div>
              <h3 className="member__name">{m.name}</h3>
              <p className="member__role">{m.role}</p>
              {m.classInfo && <p className="member__class mono">{m.classInfo}</p>}
              <ul className="member__places">
                {m.places.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => onOpen(p.id)}>
                      <span aria-hidden="true">{p.flag}</span> {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="table-card reveal">
          <div className="table-card__head">
            <h3>ตารางสรุปความรับผิดชอบ</h3>
            <p>{projectInfo.subject} · {projectInfo.academicYear}</p>
          </div>
          <div className="table-scroll">
            <table className="table">
              <caption className="visually-hidden">
                ตารางแสดงลำดับ ผู้รับผิดชอบ สถานที่ และประเทศ
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="mono">ลำดับ</th>
                  <th scope="col">ผู้รับผิดชอบ</th>
                  <th scope="col">สถานที่</th>
                  <th scope="col">ประเทศ</th>
                  <th scope="col">ทวีป</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc, i) => (
                  <tr key={loc.id}>
                    <td className="mono">{pad2(i + 1)}</td>
                    <td>{loc.owner}</td>
                    <td>
                      <button type="button" className="table__link" onClick={() => onOpen(loc.id)}>
                        {loc.name}
                      </button>
                    </td>
                    <td>
                      <span aria-hidden="true">{loc.flag}</span> {loc.country}
                    </td>
                    <td>{loc.continent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
