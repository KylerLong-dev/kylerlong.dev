import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: same mark, sized for home-screen bookmarks.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 30,
          backgroundColor: "#0B1628",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontSize: 128,
            fontWeight: 700,
            color: "#E2E8F0",
            lineHeight: 1,
          }}
        >
          <span>k</span>
          <span style={{ color: "#38BDF8" }}>.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
