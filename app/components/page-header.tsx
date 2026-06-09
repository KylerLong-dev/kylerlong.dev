import { CurveDivider } from "./curve-divider";

// Interior page header band (mono eyebrow + dot, title, sub) ending in the
// curved divider. Atmosphere layers (stars/clouds) are added in Phase 5.
export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="j-header page-band">
      <div className="journal-shell">
        <div className="j-header-inner">
          <div className="j-eyebrow">
            <span className="dot" />
            {eyebrow}
          </div>
          <h1 className="j-page-title">{title}</h1>
          {sub ? <p className="j-page-sub">{sub}</p> : null}
        </div>
      </div>
      <CurveDivider />
    </header>
  );
}