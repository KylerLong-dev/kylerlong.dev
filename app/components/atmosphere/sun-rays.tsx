"use client";

import { useEffect, useMemo, useRef } from "react";

// Warm sun in the hero's top-right corner that fans rows of small golden DASH
// segments down toward the lower-left. Each dash pivots toward the cursor when
// it's nearby (iron-filings style) — no elongation. Light mode, home hero only.
// Geometry is seeded (deterministic) so the SSR'd markup matches the client and
// there's no hydration mismatch. Honors reduced-motion / coarse pointers; the
// rAF loop only runs when interactive. Pointer-events: none.
type Seg = {
  ang: number;
  dash: number;
  thick: number;
  dist: number;
  dx: number;
  dy: number;
  t: number;
};

// Seeded fan geometry (module scope so the mutable RNG never lives in the
// component render — and so SSR + client produce identical markup).
function buildSegs(rayCount: number): Seg[] {
  const out: Seg[] = [];
  let seed = 21;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const a0 = 92;
  const a1 = 240; // fan spread (deg, down-left)
  for (let i = 0; i < rayCount; i++) {
    const t = rayCount > 1 ? i / (rayCount - 1) : 0.5;
    const ang = a0 + (a1 - a0) * t;
    const rad = (ang * Math.PI) / 180;
    const n = 5 + Math.floor(rand() * 3); // dashes on this ray
    const dash = 11 + rand() * 5;
    const thick = 4 + rand() * 2.5;
    const step = dash + 15 + rand() * 9;
    const start = 52 + rand() * 14; // first dash sits in the glow
    for (let k = 0; k < n; k++) {
      const dist = start + k * step;
      out.push({
        ang,
        dash,
        thick,
        dist,
        dx: Math.cos(rad) * dist,
        dy: Math.sin(rad) * dist,
        t: n > 1 ? k / (n - 1) : 0, // 0 = nearest core, 1 = tip
      });
    }
  }
  return out;
}

export function SunRays({ rayCount = 15 }: { rayCount?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const segs = useMemo<Seg[]>(() => buildSegs(rayCount), [rayCount]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".sun-dash"));
    const cur = segs.map((s) => s.ang); // eased absolute rotation
    const warmCur = new Array<number>(els.length).fill(0);

    // Sun origin in viewport coords (the dash field's anchor).
    const field = root.querySelector<HTMLElement>(".sun-dash-field");
    let cx = 0;
    let cy = 0;
    function anchor() {
      if (!field) return;
      const f = field.getBoundingClientRect();
      cx = f.left;
      cy = f.top;
    }
    anchor();

    let mx = -9999;
    let my = -9999;
    let inside = false;
    let raf = 0;
    let last = 0;

    function render(dt: number) {
      const ease = Math.min(1, dt * 9);
      for (let i = 0; i < els.length; i++) {
        const s = segs[i];
        const sx = cx + s.dx;
        const sy = cy + s.dy; // this dash's center
        // Rest orientation = its ray angle. With a pointer present, the dash
        // pivots toward the cursor, strongest nearby and easing out with dist.
        let target = s.ang;
        let warm = 0;
        if (inside && !coarse) {
          const ca = (Math.atan2(my - sy, mx - sx) * 180) / Math.PI;
          const dd = Math.hypot(mx - sx, my - sy);
          const reach = 360; // px falloff
          const k = Math.max(0, 1 - dd / reach); // 1 near cursor → 0 far
          const rel = (((ca - s.ang + 540) % 360) - 180);
          target = s.ang + rel * (0.25 + 0.75 * k); // fuller turn up close
          warm = Math.max(0, 1 - dd / 150);
        }
        // shortest-path ease of the absolute rotation
        const diff = (((target - cur[i] + 540) % 360) - 180);
        cur[i] += diff * ease;
        warmCur[i] += (warm - warmCur[i]) * ease;
        const w = warmCur[i];
        // base color: pale near the core (melts into the glow) → amber at tip
        const t = s.t;
        const rampIn = Math.min(1, t / 0.16);
        const tipFade = 1 - 0.42 * t;
        const baseOp = 0.92 * rampIn * tipFade;
        const cr = Math.round(255 - 10 * t + w * 4);
        const cg = Math.round(234 - 64 * t - w * 18);
        const cb = Math.round(170 - 104 * t + w * 6);
        const el = els[i];
        el.style.transform = `translate(${s.dx.toFixed(1)}px, ${s.dy.toFixed(
          1,
        )}px) rotate(${cur[i].toFixed(2)}deg)`;
        el.style.opacity = Math.min(1, baseOp + w * 0.4 * rampIn).toFixed(3);
        el.style.background = `rgb(${cr}, ${cg}, ${cb})`;
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      render(dt);
      raf = requestAnimationFrame(frame);
    }
    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      inside = true;
    }
    function onLeave() {
      inside = false;
    }

    const ro = new ResizeObserver(anchor);
    ro.observe(root);
    window.addEventListener("scroll", anchor, { passive: true });
    window.addEventListener("resize", anchor);
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("blur", onLeave);
    }
    render(0.016);
    if (!reduce && !coarse) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", anchor);
      window.removeEventListener("resize", anchor);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
    };
  }, [segs]);

  return (
    <div className="sun-rays" aria-hidden="true" ref={ref}>
      <div className="sun-core" />
      <div className="sun-dash-field">
        {segs.map((s, i) => (
          <div
            key={i}
            className="sun-dash"
            style={{
              width: `${s.dash.toFixed(2)}px`,
              height: `${s.thick.toFixed(2)}px`,
              marginLeft: `${(-s.dash / 2).toFixed(2)}px`,
              marginTop: `${(-s.thick / 2).toFixed(2)}px`,
              transform: `translate(${s.dx.toFixed(2)}px, ${s.dy.toFixed(
                2,
              )}px) rotate(${s.ang.toFixed(2)}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}