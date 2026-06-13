import type { CSSProperties } from "react";

// Seeded starfield for the dark-mode header/hero bands. Deterministic LCG so
// server + client markup match (no 'use client' needed — twinkle is pure CSS).
// Hidden in light mode and under reduced-motion / coarse pointers (globals.css).
type Star = {
  x: number;
  fy: number; // vertical position as a 0..1 fraction of the field's reach
  size: number;
  base: number;
  dur: number;
  delay: number;
  glow: boolean;
};

// Seeded LCG (module scope so the RNG never lives in render). Same seed means
// a larger count is a denser *superset* of the same field — the first N stars
// are identical, so bumping the home hero just adds stars rather than reshuffling.
function buildStars(count: number): Star[] {
  const out: Star[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const x = rand() * 100;
    const fy = rand();
    const size = 1 + Math.floor(rand() * 3);
    const base = 0.35 + rand() * 0.55;
    const dur = 2 + rand() * 4;
    const delay = rand() * 5;
    const glow = rand() > 0.88;
    out.push({ x, fy, size, base, dur, delay, glow });
  }
  return out;
}

// `spread` = how far down the band the stars reach (% of band height), set so
// the field comes down to the divider on every band (curve on interior/post,
// reeds on home). `count` = number of stars — the tall home hero bumps it so
// the field doesn't read sparse over its larger area. Server-rendered static
// HTML, so computing per render is fine (no hydration concern).
export function Stars({ spread = 90, count = 55 }: { spread?: number; count?: number }) {
  const stars = buildStars(count);
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`star${s.glow ? " glow" : ""}`}
          style={
            {
              left: `${s.x}%`,
              top: `${s.fy * spread}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--base": s.base,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}