/* global React */
/* Shared atmospheric components — reeds separator, starfield, shooting star, clouds.
   Used by Home, Journal, and any other page that wants the sky/horizon motif. */

/* ============================================
   Horizon separator — Orlando wetlands variants
   ============================================ */
function Separator({ variant, position }) {
  if (variant === 'none') return null;
  // Reeds is rendered purely via CSS mask-image (no SVG content)
  if (variant === 'reeds') {
    return <div className={`separator ${position} reeds`} />;
  }
  const cls = `separator ${position} ${variant}`;
  const heights = {
    wetlands: 140, sparse: 140, mossy: 140,
    hills: 110, pines: 120, wave: 80,
  };
  const h = heights[variant] || 120;
  const paths = {
    wetlands: <WetlandsPath dense />,
    sparse:   <WetlandsPath sparse />,
    mossy:    <WetlandsPath mossy />,
    hills:    <HillsPath />,
    pines:    <PinesPath />,
    wave:     <WavePath />,
  };
  const flip = position === 'footer-top';
  const transform = flip ? `scale(1, -1) translate(0, -${h})` : '';
  return (
    <div className={cls}>
      <svg viewBox={`0 0 1440 ${h}`} preserveAspectRatio="none">
        <g transform={transform}>
          {paths[variant]}
        </g>
      </svg>
    </div>
  );
}

/* ============================================
   CYPRESS — Florida bald cypress silhouettes.
   ============================================ */
const CYPRESS_TREES = [
  [38,  88, -0.04, 1.05, 1.0],
  [72,  74,  0.06, 0.92, 0.8],
  [102, 102,-0.02, 1.18, 1.2],
  [172, 56,  0.10, 0.85, 0.6],
  [262, 120,-0.04, 1.22, 1.3],
  [358, 60,  0.08, 0.85, 0.7],
  [392, 92, -0.05, 1.05, 1.0],
  [505, 78,  0.0,  1.0,  0.9],
  [612, 108, 0.02, 1.15, 1.15],
  [654, 82, -0.06, 0.98, 0.9],
  [762, 54,  0.10, 0.80, 0.6],
  [840, 96, -0.04, 1.08, 1.05],
  [878, 72,  0.07, 0.92, 0.85],
  [912, 88, -0.02, 1.02, 1.0],
  [1020,114, 0.04, 1.20, 1.2],
  [1132, 72, 0.08, 0.92, 0.85],
  [1168, 90,-0.05, 1.05, 1.0],
  [1252, 58, 0.06, 0.85, 0.7],
  [1305,102,-0.03, 1.12, 1.1],
  [1372, 78, 0.05, 0.95, 0.9],
  [1410, 88,-0.04, 1.02, 1.0],
];

const GRASS_TUFTS = [
  [18, 5], [48, 4], [84, 6], [118, 4], [148, 5], [188, 4], [218, 6],
  [252, 5], [292, 4], [328, 6], [368, 5], [402, 4], [438, 6], [478, 5],
  [518, 4], [552, 6], [588, 5], [628, 4], [672, 6], [708, 5], [748, 4],
  [782, 6], [822, 5], [856, 4], [898, 6], [938, 5], [978, 4], [1015, 6],
  [1058, 5], [1098, 4], [1142, 6], [1178, 5], [1218, 4], [1262, 6],
  [1298, 5], [1338, 4], [1378, 6], [1418, 5],
];

function rseed(idx, salt) {
  const v = Math.sin(idx * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function CypressTree({ cx, height, baseline = 132, lean = 0, crownScale = 1, mossDensity = 0, idx = 0 }) {
  const trunkH       = height * 0.55;
  const trunkBaseW   = Math.max(7, height * 0.10);
  const trunkTopW    = Math.max(2, height * 0.030);
  const crownH       = height * 0.55;
  const crownW       = height * 0.65 * crownScale;

  const baseY      = baseline;
  const trunkTopY  = baseline - trunkH;
  const crownTopY  = baseline - height;
  const cxTop      = cx + lean * height * 0.15;

  const trunkPath =
    `M ${cx - trunkBaseW * 0.50},${baseY}` +
    ` C ${cx - trunkBaseW * 0.40},${baseY - 3}` +
    `   ${cx - trunkBaseW * 0.28},${baseY - 8}` +
    `   ${cx - trunkBaseW * 0.20},${baseY - trunkH * 0.22}` +
    ` L ${cxTop - trunkTopW / 2},${trunkTopY}` +
    ` L ${cxTop + trunkTopW / 2},${trunkTopY}` +
    ` L ${cx + trunkBaseW * 0.20},${baseY - trunkH * 0.22}` +
    ` C ${cx + trunkBaseW * 0.28},${baseY - 8}` +
    `   ${cx + trunkBaseW * 0.40},${baseY - 3}` +
    `   ${cx + trunkBaseW * 0.50},${baseY}` +
    ` Z`;

  const blobs = [];
  const N = 7;
  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    const arch = Math.sin(f * Math.PI);
    const bx = cxTop + (f - 0.5) * crownW * (0.95 + rseed(idx, i) * 0.15);
    const by = crownTopY + crownH * 0.5 - arch * crownH * 0.28 + (rseed(idx, i + 10) - 0.5) * 6;
    const rx = crownW * (0.16 + rseed(idx, i + 20) * 0.06);
    const ry = crownH * (0.22 + rseed(idx, i + 30) * 0.10);
    blobs.push({ bx, by, rx, ry });
  }
  for (let i = 0; i < 2; i++) {
    const side = i === 0 ? -1 : 1;
    const bx = cxTop + side * crownW * (0.55 + rseed(idx, 40 + i) * 0.15);
    const by = crownTopY + crownH * (0.55 + rseed(idx, 41 + i) * 0.2);
    const rx = crownW * (0.10 + rseed(idx, 42 + i) * 0.05);
    const ry = crownH * (0.14 + rseed(idx, 43 + i) * 0.06);
    blobs.push({ bx, by, rx, ry });
  }

  const branches = [];
  const bCount = 2 + Math.floor(rseed(idx, 50) * 2);
  for (let i = 0; i < bCount; i++) {
    const branchY = trunkTopY + trunkH * 0.05 + i * trunkH * 0.18;
    const side = rseed(idx, 60 + i) > 0.5 ? 1 : -1;
    const len = crownW * (0.22 + rseed(idx, 70 + i) * 0.18);
    const endY = branchY + (rseed(idx, 80 + i) - 0.5) * 6;
    branches.push({ x1: cxTop, y1: branchY, x2: cxTop + side * len, y2: endY });
  }

  const moss = [];
  if (mossDensity > 0) {
    const mossCount = Math.floor(3 + mossDensity * 4);
    for (let i = 0; i < mossCount; i++) {
      const blob = blobs[(i * 2) % blobs.length];
      const len = 6 + rseed(idx, 90 + i) * 14;
      moss.push({
        x: blob.bx + (rseed(idx, 100 + i) - 0.5) * blob.rx,
        y1: blob.by + blob.ry * 0.7,
        y2: blob.by + blob.ry * 0.7 + len,
      });
    }
  }

  return (
    <g>
      {branches.map((b, i) => (
        <line key={`br${i}`}
          x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        />
      ))}
      <path d={trunkPath} fill="currentColor" />
      {blobs.map((b, i) => (
        <ellipse key={`bl${i}`} cx={b.bx} cy={b.by} rx={b.rx} ry={b.ry} fill="currentColor" />
      ))}
      {moss.length > 0 && (
        <g opacity="0.65" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round">
          {moss.map((m, i) => (
            <line key={`mo${i}`} x1={m.x} y1={m.y1} x2={m.x + (rseed(idx, 110 + i) - 0.5) * 2} y2={m.y2} />
          ))}
        </g>
      )}
    </g>
  );
}

function WetlandsPath({ dense, sparse, mossy }) {
  let trees = CYPRESS_TREES;
  if (sparse) trees = trees.filter((_, i) => i % 2 === 0);
  return (
    <>
      <rect x="0" y="135" width="1440" height="5" fill="currentColor" />
      {GRASS_TUFTS.map(([x, h], i) => {
        const w = 5 + (i % 3);
        return (
          <path
            key={`g${i}`}
            d={`M ${x - w},135 Q ${x - w * 0.5},${135 - h + 1} ${x - 1},${135 - h * 0.4} Q ${x},${135 - h} ${x + 1},${135 - h * 0.4} Q ${x + w * 0.5},${135 - h + 1} ${x + w},135 Z`}
            fill="currentColor"
          />
        );
      })}
      {trees.map(([x, h, lean, cs, md], i) => (
        <CypressTree
          key={i}
          idx={i + 1}
          cx={x}
          height={h}
          lean={lean}
          crownScale={cs}
          mossDensity={mossy ? Math.max(0.8, md) : (md * 0.4)}
        />
      ))}
    </>
  );
}

function HillsPath() {
  return (
    <>
      <path
        d="M0,58 C140,32 280,52 420,42 C560,32 700,62 840,46 C980,30 1120,58 1260,44 C1340,36 1400,52 1440,46 L1440,110 L0,110 Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M0,78 C180,62 360,88 540,72 C720,58 900,90 1080,76 C1240,64 1360,84 1440,74 L1440,110 L0,110 Z"
        fill="currentColor"
      />
    </>
  );
}

const PINES = [
  [38,  88, 22], [82,  56, 16], [128, 100, 24], [178, 64, 18],
  [220, 44, 14], [262, 92, 22], [310, 72, 20], [354, 50, 15],
  [398, 84, 22], [445, 60, 17], [490, 108, 26],[542, 70, 19],
  [588, 48, 14], [628, 96, 23], [678, 64, 18], [722, 80, 21],
  [768, 52, 16], [810, 88, 22], [858, 68, 19], [900, 46, 14],
  [944, 100, 24],[995, 60, 17], [1038, 76, 20],[1085, 54, 16],
  [1128, 92, 22],[1178, 66, 18],[1222, 48, 15],[1268, 84, 21],
  [1318, 72, 19],[1362, 56, 16],[1408, 88, 22],
];
function PinesPath() {
  return (
    <>
      <rect x="0" y="118" width="1440" height="2" fill="currentColor" />
      {PINES.map(([cx, h, hw], i) => {
        const base = 120;
        const trunkH = Math.max(6, h * 0.12);
        const trunkW = 3;
        const tier1Top = base - h * 0.42;
        const tier2Top = base - h * 0.68;
        const tier3Top = base - h;
        const tier1W = hw;
        const tier2W = hw * 0.78;
        const tier3W = hw * 0.5;
        return (
          <g key={i}>
            <rect x={cx - trunkW / 2} y={base - trunkH} width={trunkW} height={trunkH} fill="currentColor" />
            <polygon points={`${cx - tier1W},${base - trunkH + 2} ${cx + tier1W},${base - trunkH + 2} ${cx},${tier1Top}`} fill="currentColor" />
            <polygon points={`${cx - tier2W},${tier1Top + 6} ${cx + tier2W},${tier1Top + 6} ${cx},${tier2Top}`} fill="currentColor" />
            <polygon points={`${cx - tier3W},${tier2Top + 5} ${cx + tier3W},${tier2Top + 5} ${cx},${tier3Top}`} fill="currentColor" />
          </g>
        );
      })}
    </>
  );
}

function WavePath() {
  return (
    <>
      <path d="M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,80 L0,80 Z" fill="currentColor" opacity="0.5"/>
      <path d="M0,60 C240,30 480,90 720,55 C960,20 1200,80 1440,55 L1440,80 L0,80 Z" fill="currentColor"/>
    </>
  );
}

/* ============================================
   Starfield — after-dark vibe (dark mode only)
   ============================================ */
function Stars() {
  const stars = React.useMemo(() => {
    const out = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 55; i++) {
      const x = rand() * 100;
      const y = rand() * 72;
      const size = 1 + Math.floor(rand() * 3);
      const base = 0.35 + rand() * 0.55;
      const dur  = 2 + rand() * 4;
      const delay = rand() * 5;
      const glow = rand() > 0.88;
      out.push({ x, y, size, base, dur, delay, glow });
    }
    return out;
  }, []);

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`star ${s.glow ? 'glow' : ''}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--base': s.base,
            '--dur': `${s.dur}s`,
            '--delay': `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================
   Shooting star — periodic streak across the sky
   ============================================ */
function ShootingStar() {
  const [shot, setShot] = React.useState(null);
  React.useEffect(() => {
    let timer;
    const fire = () => {
      const startX = 38 + Math.random() * 24;
      const startY = 4  + Math.random() * 10;
      const angle  = 22 + Math.random() * 18;
      const dur    = 1.6 + Math.random() * 0.8;
      setShot({ startX, startY, angle, dur, k: Date.now() });
      const wait = 12000 + Math.random() * 14000;
      timer = setTimeout(fire, wait);
    };
    timer = setTimeout(fire, 1500 + Math.random() * 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!shot) return null;
  return (
    <div
      key={shot.k}
      className="shooting-star"
      style={{
        left: `${shot.startX}%`,
        top:  `${shot.startY}%`,
        '--angle': `${shot.angle}deg`,
        '--dur':   `${shot.dur}s`,
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   Clouds — slow-drifting silhouettes (light mode only)
   ============================================ */
function Clouds() {
  return (
    <div className="clouds" aria-hidden="true">
      <div className="cloud cloud-1">
        <svg viewBox="0 0 140 64" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="38" cy="40" rx="22" ry="18" fill="white" />
          <ellipse cx="65" cy="28" rx="28" ry="22" fill="white" />
          <ellipse cx="92" cy="32" rx="22" ry="18" fill="white" />
          <ellipse cx="110" cy="42" rx="18" ry="14" fill="white" />
          <ellipse cx="70" cy="50" rx="58" ry="13" fill="white" />
        </svg>
      </div>
      <div className="cloud cloud-2">
        <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="28" cy="30" rx="18" ry="14" fill="white" />
          <ellipse cx="52" cy="22" rx="22" ry="17" fill="white" />
          <ellipse cx="74" cy="28" rx="18" ry="14" fill="white" />
          <ellipse cx="52" cy="38" rx="42" ry="10" fill="white" />
        </svg>
      </div>
      <div className="cloud cloud-3">
        <svg viewBox="0 0 80 40" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="22" cy="24" rx="14" ry="11" fill="white" />
          <ellipse cx="42" cy="18" rx="18" ry="14" fill="white" />
          <ellipse cx="60" cy="22" rx="14" ry="11" fill="white" />
          <ellipse cx="42" cy="30" rx="34" ry="8" fill="white" />
        </svg>
      </div>
    </div>
  );
}

Object.assign(window, { Separator, Stars, ShootingStar, Clouds });

/* ============================================
   SunRays — a warm sun in the top-right corner that fans rows of small
   golden DASH segments down toward the lower-left across the hero.
   Light mode only. Each dash pivots only when the cursor is right on it
   (local hover) — no elongation. Honors reduced-motion / coarse pointers.
   Pointer-events: none.
   ============================================ */
function SunRays({ rayCount = 15 }) {
  const ref = React.useRef(null);
  const segs = React.useMemo(() => {
    const out = [];
    const a0 = 92, a1 = 240;                 // fan spread (deg, down-left)
    for (let i = 0; i < rayCount; i++) {
      const t = rayCount > 1 ? i / (rayCount - 1) : 0.5;
      const ang = a0 + (a1 - a0) * t;
      const rad = ang * Math.PI / 180;
      const n = 5 + Math.floor(Math.random() * 3);   // dashes on this ray
      const dash = 11 + Math.random() * 5;
      const thick = 4 + Math.random() * 2.5;
      const step = dash + 15 + Math.random() * 9;
      const start = 52 + Math.random() * 14;          // first dash sits in the glow
      for (let k = 0; k < n; k++) {
        const dist = start + k * step;
        out.push({
          ang, dash, thick, dist,
          dx: Math.cos(rad) * dist,
          dy: Math.sin(rad) * dist,
          t: n > 1 ? k / (n - 1) : 0,                 // 0 = nearest core, 1 = tip
        });
      }
    }
    return out;
  }, [rayCount]);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const els = Array.from(root.querySelectorAll('.sun-dash'));
    const cur = segs.map((s) => s.ang);          // eased absolute rotation (starts at rest)
    const warmCur = new Array(els.length).fill(0);

    // Sun origin in viewport coords (the dash field's anchor).
    let cx = 0, cy = 0;
    function anchor() {
      const f = root.querySelector('.sun-dash-field').getBoundingClientRect();
      cx = f.left; cy = f.top;
    }
    anchor();

    let mx = -9999, my = -9999, inside = false, raf = 0, last = 0;

    function render(dt) {
      const ease = Math.min(1, dt * 9);
      for (let i = 0; i < els.length; i++) {
        const s = segs[i];
        const sx = cx + s.dx, sy = cy + s.dy;        // this dash's center
        // Rest orientation = its ray angle. When the pointer is present,
        // the dash pivots to point toward the cursor (iron-filings style),
        // with the effect strongest nearby and easing out with distance.
        let target = s.ang, warm = 0;
        if (inside && !coarse) {
          const ca = Math.atan2(my - sy, mx - sx) * 180 / Math.PI;
          const dd = Math.hypot(mx - sx, my - sy);
          const reach = 360;                          // px falloff
          const k = Math.max(0, 1 - dd / reach);      // 1 near cursor → 0 far
          // blend from rest angle toward the cursor bearing
          let rel = (((ca - s.ang + 540) % 360) - 180);
          target = s.ang + rel * (0.25 + 0.75 * k);   // fuller turn up close
          warm = Math.max(0, 1 - dd / 150);
        }
        // shortest-path ease of the absolute rotation
        let diff = (((target - cur[i] + 540) % 360) - 180);
        cur[i] += diff * ease;
        warmCur[i] += (warm - warmCur[i]) * ease;
        const w = warmCur[i];
        const el = els[i];
        // base color: pale (blends into the glow) near the core → amber at the tip
        const t = s.t;
        const rampIn = Math.min(1, t / 0.16);        // innermost dashes melt into the glow
        const tipFade = 1 - 0.42 * t;                // outer dashes a touch fainter
        const baseOp = 0.92 * rampIn * tipFade;
        const cr = Math.round(255 - 10 * t + w * 4);
        const cg = Math.round(234 - 64 * t - w * 18);
        const cb = Math.round(170 - 104 * t + w * 6);
        el.style.transform = `translate(${s.dx.toFixed(1)}px, ${s.dy.toFixed(1)}px) rotate(${cur[i].toFixed(2)}deg)`;
        el.style.opacity = Math.min(1, baseOp + w * 0.4 * rampIn).toFixed(3);
        el.style.background = `rgb(${cr}, ${cg}, ${cb})`;
      }
    }

    function frame(now) {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      render(dt);
      raf = requestAnimationFrame(frame);
    }
    function onMove(e) { mx = e.clientX; my = e.clientY; inside = true; }
    function onLeave() { inside = false; }

    const ro = new ResizeObserver(anchor);
    ro.observe(root);
    window.addEventListener('scroll', anchor, { passive: true });
    window.addEventListener('resize', anchor);
    if (!coarse) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('blur', onLeave);
    }
    render(0.016);
    if (!reduce && !coarse) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', anchor);
      window.removeEventListener('resize', anchor);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onLeave);
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
              width: s.dash + 'px',
              height: s.thick + 'px',
              marginLeft: (-s.dash / 2) + 'px',
              marginTop: (-s.thick / 2) + 'px',
              transform: `translate(${s.dx}px, ${s.dy}px) rotate(${s.ang}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SunRays });

