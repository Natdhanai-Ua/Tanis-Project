import type { GeoLocation } from '../data/types';
import { formatCoords, pad2 } from '../lib/format';

interface Props {
  location: GeoLocation;
  index: number;
  onOpen: (id: string) => void;
}

/** รายการสถานที่แบบแผ่นภาพประกอบในหนังสืออ้างอิง — ภาพ คำบรรยายใต้ภาพ และข้อมูลกำกับ */
export function LocationCard({ location, index, onOpen }: Props) {
  return (
    <article className="entry">
      <button type="button" className="entry__btn" onClick={() => onOpen(location.id)}>
        <figure className="entry__figure">
          <img src={location.image.src} alt={location.image.alt} loading="lazy" />
          {location.isPlaceholder && <span className="flag-note">ข้อมูลตัวอย่าง</span>}
        </figure>

        <div className="entry__body">
          <p className="entry__no mono">
            สถานที่ {pad2(index)}
            <span className="entry__country">{location.country}</span>
          </p>

          <h3 className="entry__title">{location.name}</h3>
          <p className="entry__official">{location.officialName}</p>
          <p className="entry__summary">{location.summary}</p>

          <dl className="entry__facts">
            <div>
              <dt>พิกัด</dt>
              <dd className="mono">{formatCoords(location.coordinates)}</dd>
            </div>
            <div>
              <dt>ทวีป</dt>
              <dd>{location.continent}</dd>
            </div>
            <div>
              <dt>ผู้รับผิดชอบ</dt>
              <dd>{location.owner}</dd>
            </div>
          </dl>

          <span className="entry__more">อ่านรายละเอียด →</span>
        </div>
      </button>
    </article>
  );
}
