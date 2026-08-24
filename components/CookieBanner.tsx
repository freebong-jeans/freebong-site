"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "fbg_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss(choice: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, choice);
    setClosing(true);
    setTimeout(() => { setVisible(false); setClosing(false); }, 500);
  }

  if (!visible && !closing) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: "rgba(10,10,10,0.97)",
        borderTop: "1px solid rgba(10,10,10,0.08)",
        backdropFilter: "blur(16px)",
        padding: "clamp(16px,2.5vw,24px) clamp(20px,5vw,80px)",
        transform: (visible && !closing) ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(16px,3vw,40px)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "0.84rem",
              color: "#0E0E0E",
              marginBottom: "6px",
            }}
          >
            Dados de Navegação
          </p>
          <p
            style={{
              fontSize: "0.76rem",
              color: "rgba(10,10,10,0.4)",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            Utilizamos cookies para melhorar sua experiência, personalizar conteúdo
            e analisar nosso tráfego.{" "}
            <Link
              href="/privacidade"
              style={{ color: "#B59672", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              Política de Privacidade
            </Link>
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={() => dismiss("rejected")}
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              padding: "11px 22px",
              border: "1px solid rgba(10,10,10,0.15)",
              background: "transparent",
              color: "rgba(10,10,10,0.45)",
              cursor: "pointer",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(10,10,10,0.35)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(10,10,10,0.15)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.45)";
            }}
          >
            Rejeitar
          </button>
          <button
            onClick={() => dismiss("accepted")}
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              padding: "11px 22px",
              border: "none",
              background: "#0E0E0E",
              color: "#FFFFFF",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#B59672";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#0E0E0E";
            }}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
