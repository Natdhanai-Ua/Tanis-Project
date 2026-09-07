import type { GeoLocation } from '../data/types';
import { formatCoords, pad2 } from '../lib/format';

interface Props {
  locations: GeoLocation[];
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/** รายการสถานที่ข้างแผนที่ — ซิงก์การไฮไลต์กับหมุดบนแผนที่ */
export function LocationRail({ locations, activeId, hoverId, onHover, onSelect }: Props) {
  return (
    <div className="rail">
      <div className="rail__head">
        <h3>สถานที่ทั้งหมด</h3>
        <span className="rail__count mono">{pad2(locations.length)}</span>
      </div>

      <ul className="rail__list">
        {locations.map((loc, i) => {
          const state =
            activeId === loc.id ? ' is-active' : hoverId === loc.id ? ' is-hover' : '';
          return (
            <li key={loc.id}>
              <button
                type="button"
                className={`rail__item${state}`}
                onMouseEnter={() => onHover(loc.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(loc.id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(loc.id)}
              >
                <span className="rail__thumb">
                  <img src={loc.image.src} alt="" loading="lazy" />
                  <span className="rail__idx mono">{pad2(i + 1)}</span>
                </span>
                <span className="rail__body">
                  <span className="rail__name">{loc.name}</span>
                  <span className="rail__country">
                    {loc.flag} {loc.country} · {loc.continent}
                  </span>
                  <span className="rail__coords mono">{formatCoords(loc.coordinates)}</span>
                </span>
                <svg className="rail__arrow" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M7 4l6 6-6 6" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="rail__foot">เลือกสถานที่เพื่อซูมแผนที่และเปิดข้อมูลโดยละเอียด</p>
    </div>
  );
}
