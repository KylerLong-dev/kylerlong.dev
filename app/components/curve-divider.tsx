// Elliptical divider at the bottom of the page-header band. `currentColor` (set
// to the page bg via .curve-divider) makes the curve "cut" the tinted band into
// the content below; the thin stroke uses --curve-line per theme.
export function CurveDivider() {
  return (
    <div className="curve-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
        <path d="M0,18 Q720,82 1440,18 L1440,70 L0,70 Z" fill="currentColor" />
        <path
          d="M0,18 Q720,82 1440,18"
          fill="none"
          stroke="var(--curve-line, transparent)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}