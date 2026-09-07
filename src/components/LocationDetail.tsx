import { useEffect, useRef, useState } from 'react';
import type { GeoLocation, TechBlock } from '../data/types';
import { formatLat, formatLng, pad2 } from '../lib/format';

type TabKey = 'overview' | 'rs' | 'gnss' | 'geo';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'ภาพรวม' },
  { key: 'rs', label: 'การสำรวจระยะไกล (RS)' },
  { key: 'gnss', label: 'ระบบนำทางด้วยดาวเทียม (GNSS)' },
  { key: 'geo', label: 'ข้อมูลภูมิศาสตร์' },
];

interface Props {
  location: GeoLocation | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** แผงรายละเอียดสถานที่ — เลื่อนเข้าจากด้านขวา (มือถือ: เลื่อนขึ้นจากด้านล่าง) */
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
    <div className="detail" role="dialog" aria-modal="true" aria-label={`รายละเอียดของ ${location.name}`}>
      <button type="button" className="detail__scrim" onClick={onClose} aria-label="ปิดหน้าต่างรายละเอียด" />

      <div className="detail__panel" ref={panelRef}>
        <div className="detail__hero">
          <img src={location.image.src} alt={location.image.alt} />
          <div className="detail__hero-scrim" aria-hidden="true" />

          <button type="button" className="detail__close" onClick={onClose} ref={closeRef}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
            <span>กลับสู่แผนที่</span>
          </button>

          <div className="detail__hero-body">
            <div className="detail__meta">
              <span className="detail__idx mono">
                {pad2(index)} / {pad2(total)}
              </span>
              <span className="chip">
                <span aria-hidden="true">{location.flag}</span> {location.country}
              </span>
              <span className="chip chip--ghost">{location.continent}</span>
              {location.isPlaceholder && <span className="chip chip--warn">ข้อมูลตัวอย่าง</span>}
            </div>
            <h2 className="detail__title">{location.name}</h2>
            <p className="detail__official">{location.officialName}</p>
          </div>
        </div>

        <div className="detail__coords">
          <Coord label="ละติจูด" value={formatLat(location.coordinates.lat)} />
          <Coord label="ลองจิจูด" value={formatLng(location.coordinates.lng)} />
          <Coord label="ทวีป" value={location.continent} />
        </div>

        <div className="detail__tabs" role="tablist" aria-label="หัวข้อข้อมูล">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`}
              className={`detail__tab${tab === t.key ? ' is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="detail__content" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'overview' && (
            <>
              <Block title="สรุปโดยย่อ">
                <p>{location.summary}</p>
              </Block>
              <Block title="คำอธิบายทางภูมิศาสตร์">
                <p>{location.geography.description}</p>
              </Block>
              <div className="detail__preview-grid">
                <TechPanel kind="rs" block={location.remoteSensing} compact />
                <TechPanel kind="gnss" block={location.gnss} compact />
              </div>
            </>
          )}

          {tab === 'rs' && <TechPanel kind="rs" block={location.remoteSensing} />}
          {tab === 'gnss' && <TechPanel kind="gnss" block={location.gnss} />}

          {tab === 'geo' && (
            <>
              <Block title="คำอธิบายทางภูมิศาสตร์">
                <p>{location.geography.description}</p>
              </Block>
              <dl className="fact-list">
                {location.geography.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              {location.image.credit && <p className="detail__credit">{location.image.credit}</p>}
            </>
          )}
        </div>

        <footer className="detail__foot">
          <p className="detail__owner">
            <span>ผู้รับผิดชอบ</span>
            <strong>{location.owner}</strong>
          </p>
          <div className="detail__nav">
            <button type="button" onClick={onPrev} aria-label="สถานที่ก่อนหน้า">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4l-6 6 6 6" /></svg>
              ก่อนหน้า
            </button>
            <button type="button" onClick={onNext} aria-label="สถานที่ถัดไป">
              ถัดไป
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Coord({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail__coord">
      <span className="detail__coord-label">{label}</span>
      <span className="detail__coord-value mono">{value}</span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="detail__block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function TechPanel({
  kind,
  block,
  compact = false,
}: {
  kind: 'rs' | 'gnss';
  block: TechBlock;
  compact?: boolean;
}) {
  const meta =
    kind === 'rs'
      ? { abbr: 'RS', title: 'การสำรวจระยะไกล', en: 'Remote Sensing' }
      : { abbr: 'GNSS', title: 'ระบบดาวเทียมนำทางโลก', en: 'Global Navigation Satellite System' };

  return (
    <section className={`tpanel tpanel--${kind}${compact ? ' is-compact' : ''}`}>
      <header className="tpanel__head">
        <span className="tpanel__badge mono">{meta.abbr}</span>
        <span className="tpanel__titles">
          <strong>{meta.title}</strong>
          <small className="mono">{meta.en}</small>
        </span>
      </header>
      <p className="tpanel__lead">{block.lead}</p>
      <dl className="tpanel__points">
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
