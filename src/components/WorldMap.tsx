import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldTopo from '../data/world-110m.json';
import type { GeoLocation } from '../data/types';
import { formatCoords, pad2 } from '../lib/format';
import { useMediaQuery } from '../hooks/useMediaQuery';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const world = worldTopo as any;
const countries = feature(world, world.objects.countries) as unknown as FeatureCollection<Geometry>;
const graticule = geoGraticule10();

const VIEW_W = 1000;
const VIEW_H = 505;
const MIN_K = 1;
const MAX_K = 9;
const FOCUS_K = 3.6;

/** เส้นขนานสำคัญที่สอนในวิชาภูมิศาสตร์ — วาดและกำกับชื่อไว้บนแผนที่ */
const PARALLELS = [
  { lat: 23.4366, name: 'เส้นทรอปิกออฟแคนเซอร์', short: '23°26′ N', dashed: true },
  { lat: 0, name: 'เส้นศูนย์สูตร', short: '0°', dashed: false },
  { lat: -23.4366, name: 'เส้นทรอปิกออฟแคปริคอร์น', short: '23°26′ S', dashed: true },
];

const parallelLine = (lat: number) => ({
  type: 'LineString' as const,
  coordinates: Array.from({ length: 181 }, (_, i) => [-180 + i * 2, lat] as [number, number]),
});

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
  const compact = useMediaQuery('(max-width: 640px)');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [transform, setTransformState] = useState<Transform>(IDENTITY);
  const tRef = useRef<Transform>(IDENTITY);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);

  const setTransform = useCallback((next: Transform | ((cur: Transform) => Transform)) => {
    const value = typeof next === 'function' ? (next as (c: Transform) => Transform)(tRef.current) : next;
    tRef.current = value;
    setTransformState(value);
  }, []);

  const { landPaths, graticulePath, spherePath, parallelPaths, project } = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent(
      [
        [10, 10],
        [VIEW_W - 10, VIEW_H - 10],
      ],
      { type: 'Sphere' },
    );
    const path = geoPath(projection);
    return {
      landPaths: countries.features.map((f, i) => ({ id: i, d: path(f) ?? '' })),
      graticulePath: path(graticule) ?? '',
      spherePath: path({ type: 'Sphere' }) ?? '',
      parallelPaths: PARALLELS.map((p) => ({
        ...p,
        d: path(parallelLine(p.lat)) ?? '',
        labelAt: projection([-166, p.lat]) ?? [0, 0],
      })),
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

  const animateTo = useCallback(
    (target: Transform, duration = 620) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || duration === 0) {
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
    return {
      k,
      x: Math.min(0, Math.max(-(k - 1) * VIEW_W, t.x)),
      y: Math.min(0, Math.max(-(k - 1) * VIEW_H, t.y)),
    };
  }, []);

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
        const ratio = k / t.k;
        return clamp({ k, x: VIEW_W / 2 - (VIEW_W / 2 - t.x) * ratio, y: VIEW_H / 2 - (VIEW_H / 2 - t.y) * ratio });
      });
    },
    [clamp, setTransform],
  );

  const reset = useCallback(() => animateTo(IDENTITY, 480), [animateTo]);

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

  const pinScale = (compact ? 1.75 : 1) / transform.k;
  const hovered = hoverId ? locations.find((l) => l.id === hoverId) ?? null : null;

  return (
    <figure className="plate">
      <div className="plate__frame">
        <svg
          ref={svgRef}
          className="plate__svg"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="application"
          aria-label="แผนที่โลกแบบอินเทอร์แอกทีฟ แสดงตำแหน่งสถานที่ทั้งเจ็ดแห่ง"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            <path d={spherePath} className="mp-water" />
            <path d={graticulePath} className="mp-graticule" vectorEffect="non-scaling-stroke" />

            <g className="mp-land">
              {landPaths.map((p) => (
                <path key={p.id} d={p.d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>

            {/* เส้นขนานสำคัญ พร้อมชื่อกำกับตามธรรมเนียมแผนที่ */}
            <g className="mp-parallels">
              {parallelPaths.map((p) => (
                <g key={p.name}>
                  <path
                    d={p.d}
                    className={p.dashed ? 'mp-parallel mp-parallel--dashed' : 'mp-parallel'}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={p.labelAt[0]}
                    y={p.labelAt[1] - 3}
                    className="mp-parallel-label"
                    style={{ fontSize: `${7 / transform.k}px` }}
                  >
                    {p.name} {p.short}
                  </text>
                </g>
              ))}
            </g>

            <path d={spherePath} className="mp-limb" vectorEffect="non-scaling-stroke" />

            <g className="mp-stations">
              {points.map(({ loc, x, y, index }) => {
                const isActive = activeId === loc.id;
                const isHover = hoverId === loc.id;
                return (
                  <g
                    key={loc.id}
                    transform={`translate(${x} ${y}) scale(${pinScale})`}
                    className={`station${isActive ? ' is-active' : ''}${isHover ? ' is-hover' : ''}`}
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
                    <circle className="station__hit" r="13" />
                    <circle className="station__disc" r="7.2" />
                    <text className="station__num" y="2.5" textAnchor="middle">
                      {index}
                    </text>
                    <g className="station__label">
                      <rect x="-44" y="-25.5" width="88" height="13" />
                      <text y="-16" textAnchor="middle">
                        {loc.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        <div className="plate__controls" role="group" aria-label="เครื่องมือควบคุมแผนที่">
          <button type="button" onClick={() => zoomBy(1.35)} aria-label="ขยายแผนที่">
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 3v12M3 9h12" /></svg>
          </button>
          <button type="button" onClick={() => zoomBy(1 / 1.35)} aria-label="ย่อแผนที่">
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9h12" /></svg>
          </button>
          <button type="button" onClick={reset} className="plate__reset">
            คืนมาตราส่วนเดิม
          </button>
          <span className="plate__zoom mono" aria-live="polite">
            ×{(transform.k).toFixed(1)}
          </span>
        </div>

        {hovered && <StationPreview location={hovered} index={locations.indexOf(hovered) + 1} />}
      </div>

      {/* คำอธิบายสัญลักษณ์ — องค์ประกอบมาตรฐานของแผนที่ทุกฉบับ */}
      <figcaption className="plate__caption">
        <div className="key">
          <span className="key__title label">คำอธิบายสัญลักษณ์</span>
          <span className="key__item">
            <span className="key__station" aria-hidden="true">1</span>
            สถานที่ศึกษา ({locations.length} แห่ง)
          </span>
          <span className="key__item">
            <svg viewBox="0 0 22 6" aria-hidden="true" className="key__line"><path d="M0 3h22" /></svg>
            เส้นศูนย์สูตร
          </span>
          <span className="key__item">
            <svg viewBox="0 0 22 6" aria-hidden="true" className="key__line key__line--dashed"><path d="M0 3h22" /></svg>
            เส้นทรอปิก
          </span>
          <span className="key__item">
            <span className="key__swatch key__swatch--land" aria-hidden="true" />
            พื้นดิน
          </span>
          <span className="key__item">
            <span className="key__swatch key__swatch--water" aria-hidden="true" />
            พื้นน้ำ
          </span>
        </div>
        <p className="plate__meta">
          เส้นโครงแผนที่แบบ Natural Earth · เส้นโครงพิกัดทุก 10 องศา · ข้อมูลขอบเขต Natural Earth (สาธารณสมบัติ)
        </p>
        <p className="plate__usage">
          ลากเพื่อเลื่อน · เลื่อนล้อหรือใช้ปุ่มเพื่อปรับมาตราส่วน · คลิกหมายเลขสถานที่เพื่อเปิดข้อมูล
        </p>
      </figcaption>
    </figure>
  );
}

function StationPreview({ location, index }: { location: GeoLocation; index: number }) {
  return (
    <aside className="station-card" aria-hidden="true">
      <img src={location.image.src} alt="" loading="lazy" />
      <div className="station-card__body">
        <p className="station-card__no mono">สถานที่ {pad2(index)}</p>
        <h4>{location.name}</h4>
        <p className="station-card__country">{location.country} · {location.continent}</p>
        <p className="station-card__coords mono">{formatCoords(location.coordinates)}</p>
      </div>
    </aside>
  );
}
