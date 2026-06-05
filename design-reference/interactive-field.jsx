/* global React */
/* Interactive atmospheric field — a decorative canvas for blank spaces.
   Desktop, pointer-driven. Two theme skins:
     dark  → stars that brighten + link into constellations near the cursor,
             plus warm fireflies that scatter from the pointer and regroup.
     light → pale pollen / cattail-fluff that drifts and is pushed by the
             cursor like a breeze (no glow, no links — daytime).
   Honors prefers-reduced-motion (static) and pointer:coarse (no cursor FX).
   Pointer-events: none — never blocks clicks beneath it. */
const { useRef, useEffect } = React;

function InteractiveField({
  dotDensity = 0.00016,  // dots per px² of the field
  moteCount = 7,         // fireflies (dark) / sunlit pollen (light) — fixed count
  moteDensity = 0,       // if >0, derive mote count from height (motes per px)
  moteMax = 8,           // cap when using moteDensity
  cursorR = 150,         // cursor influence radius
  link = 132,            // max constellation link distance
  dotField = true,       // render the dense star / dust layer
  constellation = true,  // link nearby stars near the cursor (dark)
  cloudShadow = false,   // light mode: drifting soft cloud shadows
  parallax = false,      // drift the whole field with the cursor
  minWidth = 0,          // don't draw if the field is narrower than this (px)
  style,
  className,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const interactive = !reduce && !coarse;

    const st = {
      w: 0, h: 0, dpr: Math.min(2, window.devicePixelRatio || 1),
      dots: [], motes: [], clouds: [],
      mx: -9999, my: -9999, inside: false,
      px: 0, py: 0,            // eased parallax offset
      theme: themeNow(), t: 0, last: 0, raf: 0,
    };

    function themeNow() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
    const rnd = (a, b) => a + Math.random() * (b - a);

    function mkDot() {
      return {
        x: Math.random() * st.w, y: Math.random() * st.h,
        r: rnd(0.6, 1.9), tw: rnd(0, Math.PI * 2), tws: rnd(0.5, 1.3),
        base: rnd(0.28, 0.7),
        vx: rnd(-6, 6), vy: rnd(2, 14),   // used by the light "pollen" skin
      };
    }
    function mkMote(i, total) {
      // Stratify vertically: place each mote in its own horizontal band so
      // they spread evenly down the strip instead of clustering up top.
      const band = total > 0 ? (i + Math.random()) / total : Math.random();
      return {
        x: Math.random() * st.w, y: band * st.h,
        r: rnd(1.6, 2.8), ph: rnd(0, Math.PI * 2), sp: rnd(0.5, 1.1),
        dx: rnd(-10, 10), dy: rnd(-10, 10),
        ax: 0, ay: 0,            // velocity from cursor pushes
        drift: rnd(8, 22),
      };
    }
    function mkCloud(i, total) {
      // soft shadow of a passing cloud — large, faint, slow, ambient
      const band = total > 0 ? (i + Math.random()) / total : Math.random();
      return {
        x: rnd(st.w * 0.18, st.w * 0.82),
        y: band * st.h,
        rx: rnd(72, 132),                 // ellipse radii (squashed)
        ry: rnd(40, 74),
        vy: rnd(5, 11),                   // slow downward drift
        sway: rnd(8, 20), ph: rnd(0, Math.PI * 2), sp: rnd(0.05, 0.12),
        op: rnd(0.13, 0.22),              // faint, but visible
      };
    }
    function build() {
      const n = Math.max(12, Math.round(st.w * st.h * dotDensity));
      st.dots = Array.from({ length: n }, mkDot);
      // mote count: density-driven (consistent spacing across pages of
      // different heights) or a fixed count as fallback.
      let mc = moteDensity > 0
        ? Math.max(2, Math.min(moteMax, Math.round(st.h * moteDensity)))
        : moteCount;
      if (coarse) mc = Math.round(mc / 2);
      st.motes = Array.from({ length: mc }, (_, i) => mkMote(i, mc));
      // cloud shadows: a few big soft blobs (light mode only)
      if (cloudShadow) {
        const cc = Math.max(1, Math.min(3, Math.round(st.h / 430)));
        st.clouds = Array.from({ length: cc }, (_, i) => mkCloud(i, cc));
      }
    }

    function resize() {
      const r = wrap.getBoundingClientRect();
      st.w = Math.max(1, r.width); st.h = Math.max(1, r.height);
      canvas.width = Math.round(st.w * st.dpr);
      canvas.height = Math.round(st.h * st.dpr);
      canvas.style.width = st.w + 'px';
      canvas.style.height = st.h + 'px';
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      build();
      if (reduce) draw(0); // static single paint
    }

    // ---- update ----
    function update(dt) {
      st.t += dt;
      // ease parallax toward cursor offset (dark)
      const tx = st.inside ? (st.mx - st.w / 2) : 0;
      const ty = st.inside ? (st.my - st.h / 2) : 0;
      st.px += (tx - st.px) * Math.min(1, dt * 3);
      st.py += (ty - st.py) * Math.min(1, dt * 3);

      if (st.theme === 'light') {
        if (cloudShadow) {
          // cloud shadows drift slowly downward with a gentle sway
          for (const c of st.clouds) {
            c.y += c.vy * dt;
            c.x += Math.sin(st.t * c.sp + c.ph) * c.sway * dt;
            const mg = c.ry + 50;
            if (c.y > st.h + mg) { c.y = -mg; c.x = rnd(st.w * 0.18, st.w * 0.82); }
          }
        } else {
          // pollen drifts down-ish; cursor pushes it away like a breeze
          for (const d of st.dots) {
            d.x += d.vx * dt; d.y += d.vy * dt;
            if (st.inside) {
              const ddx = d.x - st.mx, ddy = d.y - st.my;
              const dist = Math.hypot(ddx, ddy);
              if (dist < cursorR && dist > 0.01) {
                const f = (1 - dist / cursorR) * 60 * dt;
                d.x += (ddx / dist) * f; d.y += (ddy / dist) * f;
              }
            }
            // wrap
            if (d.x < -8) d.x = st.w + 8; else if (d.x > st.w + 8) d.x = -8;
            if (d.y > st.h + 8) { d.y = -8; d.x = Math.random() * st.w; }
            else if (d.y < -8) d.y = st.h + 8;
          }
        }
      }

      // motes (fireflies / fluff)
      for (const m of st.motes) {
        const idle = m.drift;
        m.x += (Math.cos(st.t * m.sp + m.ph) * idle + m.dx) * dt;
        m.y += (Math.sin(st.t * m.sp * 0.8 + m.ph) * idle + m.dy) * dt;
        // cursor push (repel)
        if (interactive && st.inside) {
          const ddx = m.x - st.mx, ddy = m.y - st.my;
          const dist = Math.hypot(ddx, ddy);
          const R = st.theme === 'light' ? cursorR : 100;
          if (dist < R && dist > 0.01) {
            const f = (1 - dist / R) * (st.theme === 'light' ? 90 : 140);
            m.ax += (ddx / dist) * f * dt;
            m.ay += (ddy / dist) * f * dt;
          }
        }
        m.x += m.ax * dt; m.y += m.ay * dt;
        m.ax *= 0.90; m.ay *= 0.90;   // ease back to drift
        // Horizontal: keep motes off the side walls so their glow never
        // smears into a vertical line at the canvas edge. Reflect within
        // a padded band; only wrap vertically (top/bottom go fully off-screen).
        const pad = 22;
        if (m.x < pad) { m.x = pad; m.dx = Math.abs(m.dx); m.ax = Math.abs(m.ax); }
        else if (m.x > st.w - pad) { m.x = st.w - pad; m.dx = -Math.abs(m.dx); m.ax = -Math.abs(m.ax); }
        const mg = 30;
        if (m.y < -mg) m.y = st.h + mg; else if (m.y > st.h + mg) m.y = -mg;
      }
    }

    // ---- draw ----
    function draw() {
      ctx.clearRect(0, 0, st.w, st.h);
      if (st.w < minWidth) return;       // strip too narrow → would smear into a band
      if (st.theme === 'light') { if (cloudShadow) drawClouds(); return; }
      drawDark();
    }

    function drawClouds() {
      for (const c of st.clouds) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(1, c.ry / c.rx);       // squash the disc into a soft ellipse
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx);
        g.addColorStop(0, `rgba(78,98,132,${c.op.toFixed(3)})`);
        g.addColorStop(0.55, `rgba(78,98,132,${(c.op * 0.5).toFixed(3)})`);
        g.addColorStop(1, 'rgba(78,98,132,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, c.rx, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    function drawDark() {
      const ox = parallax ? st.px * 0.02 : 0, oy = parallax ? st.py * 0.02 : 0;
      const near = [];
      if (dotField) {
        for (const d of st.dots) {
          const x = d.x + ox, y = d.y + oy;
          let a = d.base * (0.6 + 0.4 * Math.sin(st.t * d.tws + d.tw));
          let r = d.r, accent = 0;
          if (interactive && st.inside) {
            const dist = Math.hypot(x - st.mx, y - st.my);
            if (dist < cursorR) {
              const k = 1 - dist / cursorR;
              a = Math.min(1, a + k * 0.6);
              r = d.r * (1 + k * 0.8);
              accent = k;
              near.push({ x, y, k });
            }
          }
          const cr = Math.round(216 + accent * (56 - 216));
          const cg = Math.round(232 + accent * (189 - 232));
          const cb = Math.round(255);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        // constellation links among dots near the cursor
        if (constellation) {
          for (let i = 0; i < near.length; i++) {
            for (let j = i + 1; j < near.length; j++) {
              const a0 = near[i], b0 = near[j];
              const d = Math.hypot(a0.x - b0.x, a0.y - b0.y);
              if (d < link) {
                const a = (1 - d / link) * Math.min(a0.k, b0.k) * 0.55;
                if (a > 0.02) {
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(56,189,248,${a.toFixed(3)})`;
                  ctx.lineWidth = 1;
                  ctx.moveTo(a0.x, a0.y); ctx.lineTo(b0.x, b0.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }
      // fireflies — warm glow
      for (const m of st.motes) {
        const pulse = 0.5 + 0.5 * Math.sin(st.t * (1.2 + m.sp) + m.ph);
        const R = m.r * 6;
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R);
        g.addColorStop(0, `rgba(255,225,150,${(0.55 * (0.5 + pulse * 0.5)).toFixed(3)})`);
        g.addColorStop(0.4, `rgba(255,210,120,${(0.18 * pulse).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255,210,120,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x, m.y, R, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,244,214,${(0.7 * (0.4 + pulse * 0.6)).toFixed(3)})`;
        ctx.arc(m.x, m.y, m.r * 0.8, 0, Math.PI * 2); ctx.fill();
      }
    }

    function frame(now) {
      const dt = Math.min(0.05, st.last ? (now - st.last) / 1000 : 0.016);
      st.last = now;
      update(dt);
      draw();
      st.raf = requestAnimationFrame(frame);
    }

    // ---- listeners ----
    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      st.mx = x; st.my = y;
      st.inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    }
    function onLeave() { st.inside = false; }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const mo = new MutationObserver(() => { st.theme = themeNow(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (interactive) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onMove, { passive: true });
      window.addEventListener('blur', onLeave);
    }
    if (!reduce) st.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(st.raf);
      ro.disconnect(); mo.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('blur', onLeave);
    };
  }, [dotDensity, moteCount, moteDensity, moteMax, cursorR, link, minWidth, cloudShadow]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true" style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style,
    }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

Object.assign(window, { InteractiveField });

/* ============================================
   MarginField — atmospheric fill for the side gutters beside a centered
   content column (never behind the text). Fireflies in dark mode, soft
   drifting cloud shadows in light mode. Renders nothing when the gutter
   is too narrow. Drop inside a position:relative wrapper around content.
   ============================================ */
function MarginField({ maxWidth = 1080, density = 0.0045, maxCount = 5 }) {
  const gutter = `calc((100% - ${maxWidth}px) / 2)`;
  // Fade the inner edge (toward the content column) so things dissolve
  // gracefully instead of hard-clipping against the text block.
  const strip = (side) => {
    const horiz = side === 'left'
      ? 'linear-gradient(to right, #000 0%, #000 62%, transparent 100%)'
      : 'linear-gradient(to left, #000 0%, #000 62%, transparent 100%)';
    // Vertical fade so things dissolve under the header divider (top) and
    // above the footer reeds (bottom) instead of hard-clipping.
    const vert = 'linear-gradient(to bottom, transparent 0, #000 90px, #000 calc(100% - 90px), transparent 100%)';
    const mask = `${horiz}, ${vert}`;
    return (
      <div style={{
        position: 'absolute', top: 0, bottom: 0, [side]: 0, width: gutter,
        overflow: 'hidden', pointerEvents: 'none',
        WebkitMaskImage: mask, maskImage: mask,
        WebkitMaskComposite: 'source-in', maskComposite: 'intersect',
      }}>
        <InteractiveField dotField={false} constellation={false} moteDensity={density} moteMax={maxCount} minWidth={96} />
      </div>
    );
  };
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {strip('left')}
      {strip('right')}
    </div>
  );
}
const MarginFireflies = MarginField;

Object.assign(window, { MarginFireflies, MarginField });
