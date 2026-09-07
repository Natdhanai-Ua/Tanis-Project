import { useEffect, useMemo, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldTopo from '../data/world-110m.json';
import type { GeoLocation } from '../data/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const world = worldTopo as any;
const land = feature(world, world.objects.countries) as unknown as FeatureCollection<Geometry>;
const graticule = geoGraticule10();
const SIZE = 460;

/** ลูกโลกเส้นสายในส่วนหัวของหน้าแรก หมุนช้า ๆ พร้อมจุดของทั้ง 7 สถานที่ */
export function HeroGlobe({ locations }: { locations: GeoLocation[] }) {
  const [lambda, setLambda] = useState(-40);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setLambda((l) => (l + dt * 0.0055) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { landPath, gratPath, spherePath, dots } = useMemo(() => {
    const projection = geoOrthographic()
      .scale(SIZE / 2 - 6)
      .translate([SIZE / 2, SIZE / 2])
      .rotate([lambda, -14]);
    const path = geoPath(projection);
    const clipTest = (lng: number, lat: number) => {
      const c = projection.rotate();
      const [l0, p0] = [(-c[0] * Math.PI) / 180, (-c[1] * Math.PI) / 180];
      const l = (lng * Math.PI) / 180;
      const p = (lat * Math.PI) / 180;
      return Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0) > 0;
    };
    return {
      landPath: path(land) ?? '',
      gratPath: path(graticule) ?? '',
      spherePath: path({ type: 'Sphere' }) ?? '',
      dots: locations
        .map((loc) => {
          const pos = projection([loc.coordinates.lng, loc.coordinates.lat]);
          return pos && clipTest(loc.coordinates.lng, loc.coordinates.lat)
            ? { id: loc.id, x: pos[0], y: pos[1] }
            : null;
        })
        .filter((d): d is { id: string; x: number; y: number } => Boolean(d)),
    };
  }, [lambda, locations]);

  return (
    <div className="globe" aria-hidden="true">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="globe__svg">
        <defs>
          <radialGradient id="globeFill" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 6} className="globe__atmos" />
        <path d={spherePath} fill="url(#globeFill)" />
        <path d={gratPath} className="globe__grat" />
        <path d={landPath} className="globe__land" />
        <path d={spherePath} className="globe__edge" />
        {dots.map((d, i) => (
          <g key={d.id} className="globe__dot" style={{ animationDelay: `${i * 0.28}s` }}>
            <circle cx={d.x} cy={d.y} r="8" className="globe__dot-halo" />
            <circle cx={d.x} cy={d.y} r="3.2" className="globe__dot-core" />
          </g>
        ))}
      </svg>
    </div>
  );
}
