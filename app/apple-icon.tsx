import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Geist ships TTFs in the installed package; read once at module load. Satori
// ignores fontWeight without real font data, so load Black for a heavy mark.
const geistBlack = fs.readFileSync(
  path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf"),
);

// Apple touch icon: same mark, sized for home-screen bookmarks.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1628",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            fontSize: 120,
            fontWeight: 900,
            color: "#38BDF8",
            lineHeight: 1,
          }}
        >
          K
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: geistBlack, weight: 900, style: "normal" }],
    },
  );
}
