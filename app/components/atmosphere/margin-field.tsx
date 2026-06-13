import type { CSSProperties } from "react";
import { InteractiveField } from "./interactive-field";

// Atmospheric fill for the side gutters beside a centered content column (never
// behind the text). Dark-mode fireflies; renders nothing when the gutter is too
// narrow (InteractiveField minWidth gate). Drop inside a position:relative
// wrapper around the content. Ported from the prototype (MarginField).

// Vertical fade so motes dissolve under the header divider (top) and above the
// footer reeds (bottom) instead of hard-clipping.
const VERT =
  "linear-gradient(to bottom, transparent 0, #000 90px, #000 calc(100% - 90px), transparent 100%)";

function Strip({
  side,
  maxWidth,
  density,
  maxCount,
}: {
  side: "left" | "right";
  maxWidth: number;
  density: number;
  maxCount: number;
}) {
  // Fade the inner edge (toward the content column) so motes dissolve rather
  // than hard-clip against the text block. Intersect with the vertical fade.
  const horiz =
    side === "left"
      ? "linear-gradient(to right, #000 0%, #000 62%, transparent 100%)"
      : "linear-gradient(to left, #000 0%, #000 62%, transparent 100%)";
  const mask = `${horiz}, ${VERT}`;
  const style = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: side === "left" ? 0 : undefined,
    right: side === "right" ? 0 : undefined,
    width: `calc((100% - ${maxWidth}px) / 2)`,
    overflow: "hidden",
    pointerEvents: "none",
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  } as CSSProperties;
  return (
    <div style={style}>
      <InteractiveField
        dotField={false}
        constellation={false}
        moteDensity={density}
        moteMax={maxCount}
        minWidth={96}
      />
    </div>
  );
}

export function MarginField({
  maxWidth = 1080,
  density = 0.0045,
  maxCount = 5,
}: {
  maxWidth?: number;
  density?: number;
  maxCount?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Strip side="left" maxWidth={maxWidth} density={density} maxCount={maxCount} />
      <Strip
        side="right"
        maxWidth={maxWidth}
        density={density}
        maxCount={maxCount}
      />
    </div>
  );
}