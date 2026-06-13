// Light-mode drifting clouds for the header/hero bands. Pure markup; the drift
// is a CSS animation and the dissolve-into-the-sun-corner is a CSS mask. Hidden
// in dark mode and under reduced-motion / coarse pointers (globals.css).
export function Clouds() {
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