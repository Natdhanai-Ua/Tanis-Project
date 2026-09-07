import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldTopo from '../data/world-110m.json';
import type { GeoLocation } from '../data/types';
import { formatCoords, pad2 } from '../lib/format';
import { useMediaQuery } from '../hooks/useMediaQuery';

/* แปลง TopoJSON เป็น GeoJSON เพียงครั้งเดียวตอนโหลดโมดูล */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const world = worldTopo as any;
const countries = feature(world, world.objects.countries) as unknown as FeatureCollection<Geometry>;
const graticule = geoGraticule10();

const VIEW_W = 1000;
const VIEW_H = 520;
const MIN_K = 1;
const MAX_K = 9;
const FOCUS_K = 3.6;

interface Transform {
  k: number;
  x: number;
  y: number;
}

const IDENTITY: Transform = { k: 1, x: 0, y: 0 };

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface Props {
  locations: GeoLocation[];
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function WorldMap({ locations, activeId, hoverId, onHover, onSelect }: Props) {
  /* บนจอเล็ก หมุดต้องใหญ่ขึ้นเพื่อให้แตะได้สะดวก */
  const compact = useMediaQuery('(max-width: 640px)');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [transform, setTransformState] = useState<Transform>(IDENTITY);
  /* เก็บค่าล่าสุดไว้ใน ref ด้วย เพื่อให้อนิเมชันอ่านค่าปัจจุบันได้ทันที */
  const tRef = useRef<Transform>(IDENTITY);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);

  const setTransform = useCallback((next: Transform | ((cur: Transform) => Transform)) => {
    const value = typeof next === 'function' ? (next as (c: Transform) => Transform)(tRef.current) : next;
    tRef.current = value;
    setTransformState(value);
  }, []);

  /* เส้นทางแผนที่คำนวณครั้งเดียว — โปรเจกชันคงที่ ส่วนการซูมใช้ transform ของ SVG */
  const { landPaths, graticulePath, spherePath, project } = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent(
      [
        [8, 8],
        [VIEW_W - 8, VIEW_H - 8],
      ],
      { type: 'Sphere' },
    );
    const path = geoPath(projection);
    return {
      landPaths: countries.features.map((f, i) => ({ id: i, d: path(f) ?? '' })),
      graticulePath: path(graticule) ?? '',
      spherePath: path({ type: 'Sphere' }) ?? '',
      project: (lng: number, lat: number) => projection([lng, lat]) ?? [0, 0],
    };
  }, []);

  const points = useMemo(
    () =>
      locations.map((loc, i) => {
        const [x, y] = project(loc.coordinates.lng, loc.coordinates.lat);
        return { loc, x, y, index: i + 1 };
      }),
    [locations, project],
  );

  /* ── การเคลื่อนกล้องแบบนุ่มนวล ─────────────────────────────── */
  const animateTo = useCallback(
    (target: Transform, duration = 700) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || duration === 0) {
        setTransform(target);
        return;
      }
      const from = tRef.current;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOutCubic(t);
        setTransform({
          k: from.k + (target.k - from.k) * e,
          x: from.x + (target.x - from.x) * e,
          y: from.y + (target.y - from.y) * e,
        });
        rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [setTransform],
  );

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const clamp = useCallback((t: Transform): Transform => {
    const k = Math.min(MAX_K, Math.max(MIN_K, t.k));
    const maxX = (k - 1) * VIEW_W;
    const maxY = (k - 1) * VIEW_H;
    return {
      k,
      x: Math.min(0, Math.max(-maxX, t.x)),
      y: Math.min(0, Math.max(-maxY, t.y)),
    };
  }, []);

  /** เลื่อนแผนที่ไปยังสถานที่ที่เลือก */
  const flyTo = useCallback(
    (lng: number, lat: number) => {
      const [px, py] = project(lng, lat);
      const k = FOCUS_K;
      animateTo(clamp({ k, x: VIEW_W / 2 - k * px, y: VIEW_H / 2 - k * py }));
    },
    [project, animateTo, clamp],
  );

  useEffect(() => {
    if (!activeId) return;
    const loc = locations.find((l) => l.id === activeId);
    if (loc) flyTo(loc.coordinates.lng, loc.coordinates.lat);
  }, [activeId, locations, flyTo]);

  const zoomBy = useCallback(
    (factor: number) => {
      setTransform((t) => {
        const k = Math.min(MAX_K, Math.max(MIN_K, t.k * factor));
        const cx = VIEW_W / 2;
        const cy = VIEW_H / 2;
        const ratio = k / t.k;
        return clamp({ k, x: cx - (cx - t.x) * ratio, y: cy - (cy - t.y) * ratio });
      });
    },
    [clamp, setTransform],
  );

  const reset = useCallback(() => animateTo(IDENTITY, 520), [animateTo]);

  /* ── ล้อเมาส์ ─────────────────────────────────────────────── */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * VIEW_W;
      const my = ((e.clientY - rect.top) / rect.height) * VIEW_H;
      setTransform((t) => {
        const k = Math.min(MAX_K, Math.max(MIN_K, t.k * (e.deltaY < 0 ? 1.16 : 1 / 1.16)));
        const ratio = k / t.k;
        return clamp({ k, x: mx - (mx - t.x) * ratio, y: my - (my - t.y) * ratio });
      });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [clamp, setTransform]);

  /* ── ลากเพื่อเลื่อน ───────────────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - d.x) / rect.width) * VIEW_W;
    const dy = ((e.clientY - d.y) / rect.height) * VIEW_H;
    if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 3) d.moved = true;
    d.x = e.clientX;
    d.y = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTransform((t) => clamp({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const endDrag = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.id === e.pointerId) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      dragRef.current = null;
    }
  };

  const zoomPct = Math.round(transform.k * 100);

  return (
    <div className="map">
      <svg
        ref={svgRef}
        className="map__svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="application"
        aria-label="แผนที่โลกแบบอินเทอร์แอกทีฟ แสดงตำแหน่งสถานที่ทั้ง 7 แห่ง"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="42%" r="72%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.09" />
            <stop offset="62%" stopColor="var(--accent)" stopOpacity="0.015" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="pinShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="1.4" stdDeviation="1.6" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
          <path d={spherePath} className="map__ocean" />
          <path d={spherePath} fill="url(#oceanGlow)" />
          <path d={graticulePath} className="map__graticule" vectorEffect="non-scaling-stroke" />

          <g className="map__land">
            {landPaths.map((p) => (
              <path key={p.id} d={p.d} vectorEffect="non-scaling-stroke" />
            ))}
          </g>

          <path d={spherePath} className="map__outline" vectorEffect="non-scaling-stroke" />

          {/* เส้นเชื่อมจากหมุดที่ชี้ ไปยังป้ายชื่อ */}
          <g className="map__pins">
            {points.map(({ loc, x, y, index }) => {
              const isActive = activeId === loc.id;
              const isHover = hoverId === loc.id;
              const s = (compact ? 1.85 : 1) / transform.k;
              return (
                <g
                  key={loc.id}
                  transform={`translate(${x} ${y}) scale(${s})`}
                  className={`pin${isActive ? ' is-active' : ''}${isHover ? ' is-hover' : ''}`}
                  onPointerEnter={() => onHover(loc.id)}
                  onPointerLeave={() => onHover(null)}
                  onClick={() => {
                    if (!dragRef.current?.moved) onSelect(loc.id);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${loc.name} ประเทศ${loc.country}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(loc.id);
                    }
                  }}
                >
                  <circle className="pin__halo" r="17" />
                  <circle className="pin__ring" r="10.5" />
                  <circle className="pin__dot" r="5" filter="url(#pinShadow)" />
                  <text className="pin__num" y="1.6" textAnchor="middle">
                    {index}
                  </text>
                  <g className="pin__tag" transform="translate(0 -20)">
                    <rect x="-46" y="-15" width="92" height="19" rx="9.5" />
                    <text y="-1.4" textAnchor="middle">
                      {loc.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* แผงควบคุมแผนที่ */}
      <div className="map__controls" role="group" aria-label="เครื่องมือควบคุมแผนที่">
        <button type="button" onClick={() => zoomBy(1.35)} aria-label="ขยายแผนที่">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.35)} aria-label="ย่อแผนที่">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12" /></svg>
        </button>
        <button type="button" onClick={reset} className="map__reset">
          รีเซ็ตมุมมอง
        </button>
        <span className="map__zoom mono" aria-live="polite">
          {zoomPct}%
        </span>
      </div>

      <p className="map__hint">
        <span>ลากเพื่อเลื่อน</span>
        <span>เลื่อนล้อเพื่อซูม</span>
        <span>คลิกหมุดเพื่อดูรายละเอียด</span>
      </p>

      {/* การ์ดตัวอย่างเมื่อชี้ที่หมุด */}
      {hoverId && (
        <MapPreview location={locations.find((l) => l.id === hoverId)!} index={locations.findIndex((l) => l.id === hoverId) + 1} />
      )}
    </div>
  );
}

function MapPreview({ location, index }: { location: GeoLocation; index: number }) {
  return (
    <aside className="map-preview" aria-hidden="true">
      <img src={location.image.src} alt="" loading="lazy" />
      <div className="map-preview__body">
        <span className="map-preview__idx mono">{pad2(index)}</span>
        <h4>{location.name}</h4>
        <p className="map-preview__country">
          {location.flag} {location.country}
        </p>
        <p className="map-preview__coords mono">{formatCoords(location.coordinates)}</p>
      </div>
    </aside>
  );
}
