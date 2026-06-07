import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0906",
          borderRadius: 40,
        }}
      >
        <svg viewBox="0 0 256 256" width="130" height="130" fill="none">
          <path
            d="M203.37 75.23 A 92 92 0 1 0 203.37 180.77"
            stroke="#FF4D00"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M173.88 95.88 A 56 56 0 1 0 173.88 160.12"
            stroke="#F4EFE8"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
