import { ImageResponse } from "next/og";

// Node-Runtime für Hetzner/Coolify-Kompatibilität.
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
          padding: "72px 80px",
          background: "#F6F2EA",
          color: "#15171B",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-sans-serif, system-ui",
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8B8E94",
          }}
        >
          <span>Compliflow · DSGVO-Suite</span>
          <span>Tool 1 + 2 jetzt live</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: "85%",
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 500,
              letterSpacing: -2,
              lineHeight: 1.05,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <span>Compliance, in Stunden statt</span>
            <span style={{ color: "#1F3D2F", fontStyle: "italic" }}>
              Anwaltstagen.
            </span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#4F5359",
              fontFamily: "ui-sans-serif, system-ui",
              lineHeight: 1.4,
              maxWidth: 800,
            }}
          >
            AVV-Generator · Verarbeitungsverzeichnis · Cookie-Banner — drei
            Tools, eine Suite, alle Pflichtfelder nach Art. 28 & 30 DSGVO.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #C9C3B3",
            paddingTop: 24,
            fontFamily: "ui-sans-serif, system-ui",
            color: "#4F5359",
            fontSize: 16,
          }}
        >
          <span style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#15171B", fontWeight: 600 }}>
            Compliflow
          </span>
          <span>Stuttgart · Frankfurt · DSGVO-konform</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
