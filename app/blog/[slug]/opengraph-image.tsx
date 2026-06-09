import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/blog-posts";

export const alt = "Compliflow Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  const title = post?.title ?? "Compliflow Blog";
  const category = post?.category ?? "DSGVO";
  const readingTime = post?.readingTime ?? 5;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "#F6F2EA",
          color: "#15171B",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-sans-serif, system-ui",
            fontSize: 13,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#1F3D2F",
          }}
        >
          <span>{category}</span>
          <span style={{ color: "#8B8E94" }}>{readingTime} Min. Lesezeit</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: "90%",
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? 52 : title.length > 40 ? 60 : 68,
              fontWeight: 500,
              letterSpacing: -1.5,
              lineHeight: 1.06,
              color: "#15171B",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #C9C3B3",
            paddingTop: 22,
            fontFamily: "ui-sans-serif, system-ui",
            color: "#4F5359",
            fontSize: 15,
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              color: "#15171B",
              fontWeight: 600,
            }}
          >
            Compliflow
          </span>
          <span>compliflow.de/blog · DSGVO-Wissen für Selbstständige</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
