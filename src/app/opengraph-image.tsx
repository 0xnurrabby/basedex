import { ImageResponse } from "next/og";

export const alt = "Base Dex | Minimalist On-Chain Terminal for Base Chain";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050608",
          color: "#ffffff",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "40px",
        }}
      >
        {/* Soft Ambient Radial Glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            left: "300px",
            top: "15px",
            display: "flex",
            background: "radial-gradient(circle, rgba(0, 82, 255, 0.18) 0%, rgba(5, 6, 8, 0) 70%)",
          }}
        />

        {/* Minimal Inner Frame */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "50px 60px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            backgroundColor: "rgba(10, 11, 15, 0.6)",
          }}
        >
          {/* Top Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "flex" }} />
              <span
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  letterSpacing: "0.5px",
                }}
              >
                BASE NETWORK (8453)
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              <span>AERODROME V2 ROUTING</span>
            </div>
          </div>

          {/* Center Brand Identity */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Dual Swap Mark */}
            <div style={{ display: "flex", marginBottom: "24px" }}>
              <svg width="72" height="72" viewBox="0 0 40 40" fill="none">
                <path
                  d="M 6 14 H 32 M 24 7 L 32 14 L 24 21"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 34 26 H 8 M 16 19 L 8 26 L 16 33"
                  stroke="#0052FF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Brand Title */}
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "800",
                letterSpacing: "-1.5px",
                margin: "0 0 14px 0",
                color: "#FFFFFF",
              }}
            >
              Base Dex
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                margin: "0 0 28px 0",
                fontWeight: "400",
                letterSpacing: "-0.2px",
              }}
            >
              The minimalist on-chain swap terminal for Base.
            </p>

            {/* Minimal Pills */}
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "13px",
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                }}
              >
                Sub-Second Execution
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "13px",
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                }}
              >
                Zero Protocol Fees
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "13px",
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                }}
              >
                100% Non-Custodial
              </div>
            </div>
          </div>

          {/* Bottom Watermark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#64748b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#38bdf8" }}>basedex.lol</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Open Source · @nurlab_dev</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
