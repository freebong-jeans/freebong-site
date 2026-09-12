"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const STORAGE_KEY = "fbg_discount_shown";
const COUPON = "BEMVINDO10";

export default function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
    }, 380);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSuccess(true);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText(COUPON).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.65)",
          zIndex: 850,
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.38s ease",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal split */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: leaving
            ? "translate(-50%,-50%) scale(0.93)"
            : "translate(-50%,-50%) scale(1)",
          zIndex: 860,
          width: "min(840px, calc(100vw - 32px))",
          maxHeight: "calc(100svh - 40px)",
          display: "flex",
          overflow: "hidden",
          opacity: leaving ? 0 : 1,
          transition: "opacity 0.38s ease, transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Lado esquerdo — foto do produto */}
        <div
          className="hidden md:block"
          style={{ width: "42%", flexShrink: 0, position: "relative", background: "#F1EFEA" }}
        >
          <Image
            src="/images/products/DSC01208.jpg"
            alt="FBG Jeans"
            fill
            sizes="360px"
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
          {/* Gradiente para texto */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          }} />
          <div style={{ position: "absolute", bottom: "24px", left: "20px" }}>
            <span style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900, fontStyle: "italic",
              fontSize: "1.5rem", letterSpacing: "-0.03em",
              color: "#0E0E0E", textTransform: "uppercase",
            }}>FBG</span>
            <p style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(10,10,10,0.5)", textTransform: "uppercase" }}>
              Jeans Wear
            </p>
          </div>
        </div>

        {/* Lado direito — formulário */}
        <div
          style={{
            flex: 1,
            background: "#FAF9F7",
            padding: "clamp(28px,4vw,48px) clamp(24px,3vw,40px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflowY: "auto",
          }}
        >
          {/* Fechar */}
          <button
            onClick={close}
            aria-label="Fechar"
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "none", border: "none",
              color: "rgba(10,10,10,0.3)", cursor: "pointer",
              fontSize: "1rem", lineHeight: 1, padding: "4px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#0E0E0E")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.3)")}
          >
            ✕
          </button>

          {/* Linha dourada no topo */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #A67C3D, #6B2033)",
          }} />

          {!success ? (
            <>
              <span style={{
                fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "#A67C3D",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                display: "block", marginBottom: "14px",
              }}>
                Oferta exclusiva
              </span>

              <h2 style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 900, fontStyle: "italic",
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                textTransform: "uppercase",
                letterSpacing: "-0.03em", color: "#0E0E0E", lineHeight: 1.05,
                marginBottom: "12px",
              }}>
                Você Ganhou<br />
                <span style={{ color: "#A67C3D" }}>10% OFF</span>
              </h2>

              <p style={{
                fontSize: "0.8rem", color: "rgba(10,10,10,0.4)", lineHeight: 1.75,
                marginBottom: "28px",
              }}>
                Cadastre seu e-mail e receba o cupom de 10% de desconto
                exclusivo na sua primeira compra.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@email.com"
                  required
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(10,10,10,0.2)",
                    color: "#0E0E0E",
                    padding: "14px 16px",
                    fontSize: "0.84rem",
                    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                    outline: "none",
                    width: "100%",
                  }}
                />

                <label style={{
                  display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ marginTop: "2px", accentColor: "#A67C3D", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.72rem", color: "rgba(10,10,10,0.35)", lineHeight: 1.6 }}>
                    Li e aceito os{" "}
                    <a href="/termos" style={{ color: "#A67C3D", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                      Termos de Uso
                    </a>{" "}
                    e estou ciente da{" "}
                    <a href="/privacidade" style={{ color: "#A67C3D", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                      Política de Privacidade
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!agreed || !email}
                  style={{
                    background: agreed && email ? "#6B2033" : "rgba(10,10,10,0.15)",
                    color: agreed && email ? "#FFFFFF" : "rgba(10,10,10,0.3)",
                    border: "none",
                    padding: "15px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                    cursor: agreed && email ? "pointer" : "not-allowed",
                    transition: "background 0.25s ease, color 0.25s ease",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (agreed && email) (e.currentTarget as HTMLButtonElement).style.background = "#A67C3D";
                  }}
                  onMouseLeave={(e) => {
                    if (agreed && email) (e.currentTarget as HTMLButtonElement).style.background = "#6B2033";
                  }}
                >
                  Cadastrar E-mail
                </button>
              </form>
            </>
          ) : (
            /* ── Sucesso ── */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                border: "1.5px solid #A67C3D",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#A67C3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h3 style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 900, fontStyle: "italic",
                fontSize: "clamp(1.3rem,2.5vw,1.9rem)",
                textTransform: "uppercase", letterSpacing: "-0.03em",
                color: "#0E0E0E", lineHeight: 1.1, marginBottom: "10px",
              }}>
                Seu cupom está aqui
              </h3>

              <p style={{
                fontSize: "0.8rem", color: "rgba(10,10,10,0.4)", lineHeight: 1.75, marginBottom: "24px",
              }}>
                Use o código abaixo no checkout e ganhe 10% OFF na sua primeira compra.
              </p>

              {/* Cupom */}
              <button
                onClick={copyCoupon}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%",
                  border: "1.5px dashed rgba(166,124,61,0.5)",
                  background: "rgba(166,124,61,0.06)",
                  padding: "14px 20px",
                  cursor: "pointer",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <span style={{
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 900, fontStyle: "italic",
                  fontSize: "1.4rem", letterSpacing: "0.12em",
                  color: "#A67C3D",
                }}>
                  {COUPON}
                </span>
                <span style={{
                  fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: copied ? "#A67C3D" : "rgba(10,10,10,0.35)",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  transition: "color 0.2s ease",
                }}>
                  {copied ? "Copiado!" : "Copiar"}
                </span>
              </button>

              <button
                onClick={close}
                style={{
                  width: "100%", background: "#6B2033", border: "none",
                  padding: "14px",
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em",
                  textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  color: "#FFFFFF", cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#A67C3D")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#6B2033")}
              >
                Ver Coleção →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
