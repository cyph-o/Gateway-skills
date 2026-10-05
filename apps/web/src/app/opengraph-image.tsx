import { ImageResponse } from "next/og";
import { brand } from "@/content/brand";

export const alt = `${brand.legalName} — ${brand.strapline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded share card. Drawn with layout primitives and inline SVG rather than
 * a bitmap or a remote font fetch, so it renders deterministically at build
 * time and has nothing to download or go stale.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#123D2D",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
            <g stroke="#7FD4A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 12v18M33 12v18" opacity="0.4" />
              <path d="M7 12 14 26 20 8 26 26 33 12" />
              <path d="M14 26 7 30M26 26 33 30" />
            </g>
            <g fill="#7FD4A3">
              <circle cx="7" cy="12" r="3.2" />
              <circle cx="33" cy="12" r="3.2" />
              <circle cx="7" cy="30" r="3.2" />
              <circle cx="33" cy="30" r="3.2" />
              <circle cx="20" cy="8" r="2.6" />
              <circle cx="14" cy="26" r="2.4" />
              <circle cx="26" cy="26" r="2.4" />
              <circle cx="20" cy="20" r="4" />
            </g>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 4,
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {brand.wordmarkPrimary}
            </span>
            <span
              style={{
                color: "#B7CDBE",
                fontSize: 15,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {brand.wordmarkSecondary}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#FFFFFF", fontSize: 76, lineHeight: 1.1, letterSpacing: -2 }}>
            {brand.strapline}
          </div>
          <div style={{ color: "#B7CDBE", fontSize: 26, marginTop: 28 }}>
            {brand.disciplines}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid #2B5742",
            paddingTop: 24,
            color: "#7FD4A3",
            fontSize: 19,
            letterSpacing: 2,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          FULLY FUNDED PROGRAMMES FOR UK CARE ORGANISATIONS
        </div>
      </div>
    ),
    size,
  );
}
