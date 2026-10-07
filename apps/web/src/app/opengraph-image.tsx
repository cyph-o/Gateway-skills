import { ImageResponse } from "next/og";
import { NodeMark } from "@/components/brand/NodeMark";
import { brand } from "@/content/brand";

export const alt = `${brand.legalName}: ${brand.strapline}`;
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
          background: "#0A1F52",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <NodeMark style={{ width: 68, height: 56 }} />
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
                color: "#6CC8EF",
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
          <div style={{ color: "#B3C5E0", fontSize: 26, marginTop: 28 }}>
            {brand.disciplines}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid #20397A",
            paddingTop: 24,
            color: "#6CC8EF",
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
