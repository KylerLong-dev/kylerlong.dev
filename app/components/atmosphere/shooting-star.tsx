"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

// Periodic streak across the dark sky. State starts null (renders nothing on
// SSR + first paint → no hydration mismatch); the streak is scheduled after
// mount. No-ops under reduced-motion / coarse pointers (CSS also hides it).
type Shot = {
  startX: number;
  startY: number;
  angle: number;
  dur: number;
  k: number;
};

export function ShootingStar() {
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let timer: ReturnType<typeof setTimeout>;
    const fire = () => {
      const startX = 38 + Math.random() * 24;
      const startY = 4 + Math.random() * 10;
      const angle = 22 + Math.random() * 18;
      const dur = 1.6 + Math.random() * 0.8;
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
      aria-hidden="true"
      style={
        {
          left: `${shot.startX}%`,
          top: `${shot.startY}%`,
          "--angle": `${shot.angle}deg`,
          "--dur": `${shot.dur}s`,
        } as CSSProperties
      }
    />
  );
}