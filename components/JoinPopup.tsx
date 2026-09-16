"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "fbg_join_shown";
const WHATSAPP = "https://wa.me/message/3ROGXK7TIP7TC1";

export default function JoinPopup() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 350);
  };

  const handleSim = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    window.open(WHATSAPP, "_blank");
    close();
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 800,
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.35s ease",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: leaving
            ? "translate(-50%,-50%) scale(0.94)"
            : "translate(-50%,-50%) scale(1)",
          zIndex: 810,
          background: "#FAF9F7",
          border: "1px solid rgba(10,10,10,0.1)",
          width: "min(480px, calc(100vw - 40px))",
          padding: "clamp(28px,4vw,44px)",
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Fechar */}
        <button
          onClick={close}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "rgba(10,10,10,0.3)",
            cursor: "pointer",
            padding: "4px",
            lineHeight: 1.04,
            fontSize: "1.1rem",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#0E0E0E")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.3)")}
        >
          ✕
        </button>

        {/* Logo */}
        <div style={{ marginBottom: "24px" }}>
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "2rem",
              letterSpacing: "-0.04em",
              color: "#0E0E0E",
            }}
          >
            FBG
            <span style={{ color: "#B0864A", fontSize: "0.5em", verticalAlign: "super", fontStyle: "normal" }}>›</span>
          </span>
        </div>

        {/* Título */}
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(1.3rem,2.4vw,1.7rem)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            color: "#0E0E0E",
            lineHeight: 1.1,
            marginBottom: "14px",
          }}
        >
          Junte-se a nós
        </h2>

        <p
          style={{
            fontSize: "0.84rem",
            color: "rgba(10,10,10,0.45)",
            lineHeight: 1.75,
            marginBottom: "28px",
          }}
        >
          Quer ficar por dentro dos lançamentos exclusivos,
          descontos especiais e novidades da FBG?
        </p>

        {/* Botões */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={close}
            style={{
              flex: 1,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              padding: "14px",
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
            Não, obrigado
          </button>

          <button
            onClick={handleSim}
            className="group relative overflow-hidden"
            style={{
              flex: 1,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              padding: "14px",
              border: "none",
              background: "#6B2033",
              color: "#FFFFFF",
              cursor: "pointer",
              position: "relative",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#B0864A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#6B2033";
            }}
          >
            Sim
          </button>
        </div>

        {/* Linha decorativa */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #B0864A, #6B2033)",
          }}
        />
      </div>
    </>
  );
}
