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
          justifyContent: "space-between",
          padding: "54px 70px",
          backgroundColor: "#07080a",
          color: "#ffffff",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            width: "650px",
            height: "650px",
            right: "-80px",
            top: "-80px",
            background: "radial-gradient(circle, rgba(0, 82, 255, 0.28) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "450px",
            height: "450px",
            left: "-100px",
            bottom: "-100px",
            background: "radial-gradient(circle, rgba(0, 82, 255, 0.12) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />

        {/* Left Column: Branding and Copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            maxWidth: "490px",
          }}
        >
          {/* Logo & Terminal Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
              <path
                d="M 6 14 H 32 M 24 7 L 32 14 L 24 21"
                stroke="#F5F5F5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 34 26 H 8 M 16 19 L 8 26 L 16 33"
                stroke="#0052FF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "-0.5px" }}>
              Base Dex
            </span>
          </div>

          {/* Headline and Features */}
          <div style={{ display: "flex", flexDirection: "column", margin: "auto 0" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "44px",
                fontWeight: "800",
                lineHeight: "1.15",
                letterSpacing: "-1.2px",
                marginBottom: "16px",
              }}
            >
              <span>Ultra-Fast Swaps</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <span>on</span>
                <span style={{ color: "#38bdf8" }}>Base Chain</span>
              </div>
            </div>
            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.55",
                color: "#94a3b8",
                marginBottom: "24px",
              }}
            >
              Minimalist, high-speed DEX terminal directly routed via Aerodrome Finance liquidity.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  background: "rgba(18, 20, 26, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "13px",
                  color: "#e2e8f0",
                }}
              >
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#0052FF" }} />
                <span>Aerodrome Liquidity</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  background: "rgba(18, 20, 26, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "13px",
                  color: "#e2e8f0",
                }}
              >
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} />
                <span>Sub-Second Swaps</span>
              </div>
            </div>
          </div>

          {/* Footer watermark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              color: "#64748b",
              fontFamily: "monospace",
            }}
          >
            <span>Portal:</span>
            <span style={{ color: "#38bdf8", fontWeight: "600" }}>basedex.lol</span>
          </div>
        </div>

        {/* Right Column: Swap Card UI */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
            background: "#0d0f14",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* Card Topbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
              <span
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  fontFamily: "monospace",
                  marginLeft: "8px",
                }}
              >
                terminal://swap
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                padding: "3px 8px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#94a3b8",
              }}
            >
              0.5% slippage
            </span>
          </div>

          {/* YOU PAY */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#13161f",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#64748b",
                fontFamily: "monospace",
                marginBottom: "8px",
              }}
            >
              <span>YOU PAY</span>
              <span>Balance: 1.450 ETH</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "32px", fontWeight: "600", fontFamily: "monospace" }}>1.0</span>
                <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace", marginTop: "2px" }}>
                  ~$2,654.20
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#627EEA" }} />
                <span>ETH</span>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div style={{ display: "flex", justifyContent: "center", margin: "-12px 0" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#181c26",
                border: "2px solid #0d0f14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
              </svg>
            </div>
          </div>

          {/* YOU RECEIVE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#13161f",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#64748b",
                fontFamily: "monospace",
                marginBottom: "8px",
              }}
            >
              <span>YOU RECEIVE</span>
              <span>Balance: 3,420.50 USDC</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "32px", fontWeight: "600", fontFamily: "monospace" }}>2,651.80</span>
                <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace", marginTop: "2px" }}>
                  ~$2,651.80
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#2775CA" }} />
                <span>USDC</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              borderRadius: "14px",
              background: "#0052FF",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Swap ETH for USDC
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
