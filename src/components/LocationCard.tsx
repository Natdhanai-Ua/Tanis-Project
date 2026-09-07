import type { GeoLocation } from '../data/types';
import { formatCoords, pad2 } from '../lib/format';

interface Props {
  location: GeoLocation;
  index: number;
  onOpen: (id: string) => void;
}

export function LocationCard({ location, index, onOpen }: Props) {
  return (
    <article className="card reveal">
      <button type="button" className="card__btn" onClick={() => onOpen(location.id)}>
        <div className="card__media">
          <img src={location.image.src} alt={location.image.alt} loading="lazy" />
          <span className="card__idx mono">{pad2(index)}</span>
          {location.isPlaceholder && <span className="chip chip--warn card__chip">ข้อมูลตัวอย่าง</span>}
        </div>

        <div className="card__body">
          <p className="card__country">
            <span aria-hidden="true">{location.flag}</span> {location.country} · {location.continent}
          </p>
          <h3 className="card__title">{location.name}</h3>
          <p className="card__official">{location.officialName}</p>
          <p className="card__summary">{location.summary}</p>

          <div className="card__tags">
            <span className="tag tag--rs">RS</span>
            <span className="tag tag--gnss">GNSS</span>
            <span className="tag tag--coords mono">{formatCoords(location.coordinates)}</span>
          </div>

          <span className="card__more">
            ดูรายละเอียด
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </span>
        </div>
      </button>
    </article>
  );
}
