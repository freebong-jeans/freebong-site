"use client";

import Link from "next/link";

export default function RecuperarPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F8F5F0 0%, #faf9f7 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "clamp(80px,12vw,120px) clamp(24px,5vw,48px)",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>

        <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "40px" }}>
          <span style={{
            fontWeight: 900, fontStyle: "italic", fontSize: "1.6rem",
            letterSpacing: "-0.04em", color: "#141414",
          }}>
            FBG<span style={{ color: "#B0864A" }}>›</span>
          </span>
        </Link>

        {/* Icon */}
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          border: "1.5px solid rgba(176,134,74,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          background: "rgba(176,134,74,0.06)",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B0864A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B0864A", display: "block", marginBottom: "12px" }}>
          Em breve
        </span>

        <h1 style={{
          fontWeight: 900, fontStyle: "italic",
          fontSize: "clamp(1.6rem,4vw,2.4rem)",
          letterSpacing: "-0.03em", textTransform: "uppercase",
          color: "#141414", lineHeight: 1.1, marginBottom: "16px", margin: "0 0 16px",
        }}>
          Recuperar Senha
        </h1>

        <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.7, marginBottom: "32px", margin: "0 0 32px" }}>
          Esta funcionalidade está em desenvolvimento. Por enquanto, entre em contato pelo WhatsApp e nossa equipe vai te ajudar.
        </p>

        <a
          href="https://wa.me/message/3ROGXK7TIP7TC1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "16px 32px",
            background: "#6B2033", color: "#FFFFFF",
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", textDecoration: "none",
            borderRadius: "4px",
            transition: "background 0.2s ease",
            marginBottom: "20px",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#B0864A"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#F1EFEA"}
        >
          Falar no WhatsApp
        </a>

        <div style={{ marginTop: "16px" }}>
          <Link href="/conta" style={{ fontSize: "0.72rem", color: "#B0864A", textDecoration: "none", fontWeight: 600 }}>
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
