import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon. Drawn rather than shipped as a bitmap so it stays in sync
 *  with the brand mark and needs no binary asset in the repo. */
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
          background: "#046A38",
        }}
      >
        <svg width="124" height="124" viewBox="0 0 40 40" fill="none">
          <g stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 13v14M31 13v14" opacity="0.45" />
            <path d="M9 13 15 26 20 10 25 26 31 13" />
          </g>
          <g fill="#ffffff">
            <circle cx="9" cy="13" r="2.9" />
            <circle cx="31" cy="13" r="2.9" />
            <circle cx="9" cy="27" r="2.9" />
            <circle cx="31" cy="27" r="2.9" />
            <circle cx="20" cy="10" r="2.3" />
            <circle cx="20" cy="20" r="3.4" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
