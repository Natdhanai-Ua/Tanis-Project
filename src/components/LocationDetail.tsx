import { useEffect, useRef, useState } from 'react';
import type { GeoLocation, TechBlock } from '../data/types';
import { formatLat, formatLng, pad2 } from '../lib/format';

type TabKey = 'overview' | 'rs' | 'gnss' | 'geo';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'ภาพรวม' },
  { key: 'geo', label: 'ลักษณะภูมิศาสตร์' },
  { key: 'rs', label: 'การสำรวจระยะไกล' },
  { key: 'gnss', label: 'ระบบดาวเทียมนำทาง' },
];

interface Props {
  location: GeoLocation | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** แผ่นข้อมูลสถานที่ — เลื่อนเข้าจากขวา (จอเล็ก: เลื่อนขึ้นจากด้านล่าง) */
export function LocationDetail({ location, index, total, onClose, onPrev, onNext }: Props) {
  const [tab, setTab] = useState<TabKey>('overview');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setTab('overview');
    panelRef.current?.scrollTo({ top: 0 });
  }, [location?.id]);

  useEffect(() => {
    if (!location) return;
    document.body.classList.add('is-locked');
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [location, onClose, onNext, onPrev]);

  if (!location) return null;

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={`ข้อมูลสถานที่ ${location.name}`}>
      <button type="button" className="sheet__scrim" onClick={onClose} aria-label="ปิดแผ่นข้อมูล" />

      <article className="sheet__panel" ref={panelRef}>
        <header className="sheet__head">
          <button type="button" className="sheet__close" onClick={onClose} ref={closeRef}>
            ← กลับสู่แผนที่
          </button>
          <p className="sheet__no mono">
            สถานที่ {pad2(index)} / {pad2(total)}
          </p>
        </header>

        <div className="sheet__title-block">
          <h2 className="sheet__title">{location.name}</h2>
          <p className="sheet__official mono">{location.officialName}</p>
          <p className="sheet__place">
            {location.country} · ทวีป{location.continent}
            {location.isPlaceholder && <span className="flag-note flag-note--inline">ข้อมูลตัวอย่าง</span>}
          </p>
        </div>

        <figure className="sheet__figure">
          <img src={location.image.src} alt={location.image.alt} />
          <figcaption>
            <span className="mono">ภาพที่ {pad2(index)}</span> {location.name} · {location.country}
            {location.image.credit && <em> — {location.image.credit}</em>}
          </figcaption>
        </figure>

        <dl className="coord-strip">
          <div>
            <dt>ละติจูด</dt>
            <dd className="mono">{formatLat(location.coordinates.lat)}</dd>
          </div>
          <div>
            <dt>ลองจิจูด</dt>
            <dd className="mono">{formatLng(location.coordinates.lng)}</dd>
          </div>
          <div>
            <dt>ผู้รับผิดชอบ</dt>
            <dd>{location.owner}</dd>
          </div>
        </dl>

        <div className="sheet__tabs" role="tablist" aria-label="หัวข้อข้อมูล">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`}
              className={`sheet__tab${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sheet__body" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'overview' && (
            <>
              <p className="sheet__standfirst">{location.summary}</p>
              <p className="sheet__prose">{location.geography.description}</p>
              <dl className="deflist deflist--tight">
                {location.geography.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {tab === 'geo' && (
            <>
              <p className="sheet__prose">{location.geography.description}</p>
              <table className="table table--facts">
                <caption className="visually-hidden">ข้อมูลภูมิศาสตร์ของ {location.name}</caption>
                <tbody>
                  {location.geography.facts.map((f) => (
                    <tr key={f.label}>
                      <th scope="row">{f.label}</th>
                      <td>{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === 'rs' && <TechPanel kind="rs" block={location.remoteSensing} />}
          {tab === 'gnss' && <TechPanel kind="gnss" block={location.gnss} />}
        </div>

        <footer className="sheet__foot">
          <button type="button" onClick={onPrev}>← สถานที่ก่อนหน้า</button>
          <button type="button" onClick={onNext}>สถานที่ถัดไป →</button>
        </footer>
      </article>
    </div>
  );
}

function TechPanel({ kind, block }: { kind: 'rs' | 'gnss'; block: TechBlock }) {
  const meta =
    kind === 'rs'
      ? { abbr: 'RS', title: 'การสำรวจระยะไกล', en: 'Remote Sensing' }
      : { abbr: 'GNSS', title: 'ระบบดาวเทียมนำทางโลก', en: 'Global Navigation Satellite System' };

  return (
    <section className={`tpanel tpanel--${kind}`}>
      <p className="tpanel__abbr mono">{meta.abbr}</p>
      <h3 className="tpanel__title">{meta.title}</h3>
      <p className="tpanel__en mono">{meta.en}</p>
      <p className="sheet__standfirst">{block.lead}</p>
      <dl className="deflist deflist--tight">
        {block.points.map((p) => (
          <div key={p.label}>
            <dt>{p.label}</dt>
            <dd>{p.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
