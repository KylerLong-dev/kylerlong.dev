import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: dark tile with the wordmark's "k" + accent dot.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 5,
          backgroundColor: "#0B1628",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontSize: 23,
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
