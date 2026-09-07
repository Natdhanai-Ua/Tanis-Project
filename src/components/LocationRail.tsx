import type { GeoLocation } from '../data/types';
import { formatCoords, pad2 } from '../lib/format';

interface Props {
  locations: GeoLocation[];
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/** ดัชนีสถานที่ข้างแผนที่ — ทำงานร่วมกับหมายเลขบนแผ่นแผนที่ */
export function LocationRail({ locations, activeId, hoverId, onHover, onSelect }: Props) {
  return (
    <nav className="index" aria-label="ดัชนีสถานที่บนแผนที่">
      <p className="index__head label label--wide">ดัชนีสถานที่</p>

      <ol className="index__list">
        {locations.map((loc, i) => {
          const state = activeId === loc.id ? ' is-active' : hoverId === loc.id ? ' is-hover' : '';
          return (
            <li key={loc.id}>
              <button
                type="button"
                className={`index__row${state}`}
                onMouseEnter={() => onHover(loc.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(loc.id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(loc.id)}
              >
                <span className="index__no mono">{pad2(i + 1)}</span>
                <span className="index__text">
                  <span className="index__name">{loc.name}</span>
                  <span className="index__sub">{loc.country}</span>
                  <span className="index__coords mono">{formatCoords(loc.coordinates)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
