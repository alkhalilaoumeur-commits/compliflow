import { ImageResponse } from "next/og";

export const alt = "Compliflow Verarbeitungsverzeichnis — Art. 30 DSGVO in 10 Minuten";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "#0A0906",
          color: "#F4EFE8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg viewBox="0 0 256 256" width="56" height="56" fill="none">
            <path
              d="M203.37 75.23 A 92 92 0 1 0 203.37 180.77"
              stroke="#FF4D00"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M173.88 95.88 A 56 56 0 1 0 173.88 160.12"
              stroke="#F4EFE8"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#F4EFE8",
              display: "flex",
            }}
          >
            compli<span style={{ color: "#FF4D00" }}>fl</span>ow
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#FF4D00",
              fontWeight: 600,
              display: "flex",
            }}
          >
            Tool 02 · DSGVO Art. 30
          </div>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#F4EFE8",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Verarbeitungs-</div>
            <div style={{ display: "flex" }}>verzeichnis</div>
            <div style={{ display: "flex", color: "#A89F92", fontSize: "44px", marginTop: "16px", fontWeight: 500 }}>
              10 Vorlagen. Sofort compliant.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #2A241D",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: "18px", color: "#A89F92", display: "flex" }}>
            compliflow.de/vvt · DACH-Markt
          </div>
          <div
            style={{
              fontSize: "16px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#5C5447",
              display: "flex",
            }}
          >
            Kostenlos starten
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
