import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

// Shared 1200×630 social card. One dark, atmospheric layout reused by the root
// card and every journal post so shares stay on-brand without image assets.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Geist ships TTFs in the installed package; read once at module load (build
// time — every card is statically generated, so this never runs per request).
const FONT_DIR = path.join(process.cwd(), "node_modules/geist/dist/fonts");
const read = (file: string) => fs.readFileSync(path.join(FONT_DIR, file));
const geistRegular = read("geist-sans/Geist-Regular.ttf");
const geistSemiBold = read("geist-sans/Geist-SemiBold.ttf");
const geistMono = read("geist-mono/GeistMono-Medium.ttf");

type Card = { eyebrow: string; title: string; meta: string };

export function ogImage({ eyebrow, title, meta }: Card) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0B1628",
          color: "#E2E8F0",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        {/* Accent glow in the top-right, echoing the site's atmosphere. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: 9999,
            backgroundImage:
              "radial-gradient(circle, rgba(56,189,248,0.22), rgba(56,189,248,0) 70%)",
          }}
        />

        {/* Top row: wordmark + eyebrow. */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 26,
              color: "#94A3B8",
            }}
          >
            <span>kylerlong</span>
            <span style={{ color: "#38BDF8" }}>.</span>
            <span>dev</span>
          </div>
          <div
            style={{
              fontFamily: "Geist Mono",
              fontSize: 18,
              letterSpacing: 4,
              color: "#64748B",
            }}
          >
            {eyebrow.toUpperCase()}
          </div>
        </div>

        {/* Title block. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 84,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#38BDF8",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              fontWeight: 600,
              fontSize: 60,
              lineHeight: 1.12,
              maxWidth: 940,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, color: "#94A3B8", marginTop: 22 }}>
            {meta}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: geistMono, weight: 500, style: "normal" },
      ],
    },
  );
}
