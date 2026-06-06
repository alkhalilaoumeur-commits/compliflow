import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Compliflow — DSGVO-Tools für deutsche Selbstständige";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% -10%, rgba(255,77,0,0.18), transparent 50%), radial-gradient(circle at 90% 100%, rgba(255,77,0,0.10), transparent 50%), #0A0906",
          color: "#F4EFE8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#FF4D00",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FF4D00",
            }}
          />
          DSGVO Stack · Launch 17. Juni 2026
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.0,
          }}
        >
          <span>DSGVO ohne</span>
          <span style={{ color: "#A89F92" }}>Anwaltshonorar.</span>
          <span>
            Compliance{" "}
            <span style={{ color: "#FF4D00" }}>automatisiert</span>.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#A89F92",
            borderTop: "1px solid #2A241D",
            paddingTop: 28,
          }}
        >
          <div style={{ fontWeight: 800, color: "#F4EFE8", fontSize: 36 }}>
            Compli<span style={{ color: "#FF4D00" }}>flow</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <span>AVV</span>
            <span>VVT</span>
            <span>Cookie-Banner</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
