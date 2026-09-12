"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ModelViewer3D = dynamic(() => import("@/components/ModelViewer3D"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F3F0" }}>
      <div style={{ width: "36px", height: "36px", border: "2px solid #e8e3dc", borderTopColor: "#A67C3D", borderRadius: "50%", animation: "fbg3d-spin 1s linear infinite" }} />
    </div>
  ),
});

export default function VistaEm3D() {
  return (
    <section style={{ background: "#F8F5F0", borderTop: "1px solid #e8e3dc", borderBottom: "1px solid #e8e3dc" }}>
      <div className="container-fbg" style={{ padding: "clamp(72px,10vw,120px) 1.5rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: "clamp(48px,8vw,96px)" }}>

          {/* Viewer 3D */}
          <div style={{ position: "relative", minHeight: "clamp(360px,52vw,540px)", borderRadius: "2px", overflow: "hidden", background: "#EFECE7", border: "1px solid #e0dbd3" }}>
            <ModelViewer3D src="/models/Ch36_nonPBR.fbx" />
            <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
                <path d="M4.5 7 L7 4.5 L9.5 7" stroke="rgba(0,0,0,0.25)" strokeWidth="1" fill="none" />
                <path d="M4.5 7 L7 9.5 L9.5 7" stroke="rgba(0,0,0,0.25)" strokeWidth="1" fill="none" />
              </svg>
              <span style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", fontWeight: 600, fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                Arraste para girar
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A67C3D", marginBottom: "12px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
              Experiência 3D
            </p>
            <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "clamp(2rem,4.5vw,3.6rem)", letterSpacing: "-0.03em", lineHeight: 1.02, textTransform: "uppercase", color: "#141414", marginBottom: "20px" }}>
              KIT FBG<br />
              <span style={{ color: "#A67C3D" }}>COMPLETO</span>
            </h2>

            <div style={{ width: "32px", height: "2px", background: "#A67C3D", marginBottom: "20px" }} />

            <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "rgba(0,0,0,0.5)", maxWidth: "380px", marginBottom: "24px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
              Calça, jaqueta, blusa e cueca FBG: o outfit completo em visualização 3D interativa. Arraste para ver cada detalhe do tecido, costura e acabamento premium.
            </p>

            {/* Itens do kit */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "24px" }}>
              {[
                { label: "Calça Slim Premium Índigo", price: "R$ 349,90" },
                { label: "Jaqueta FBG Black Edition", price: "R$ 479,90" },
                { label: "Blusa Basic Off-White", price: "R$ 149,90" },
                { label: "Cueca FBG Urban", price: "R$ 69,90" },
              ].map(({ label, price }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e8e3dc", padding: "12px 0" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.6)", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>{label}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#141414", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>{price}</span>
                </div>
              ))}
            </div>

            {/* Preço do kit */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: "4px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>Kit completo por</p>
              <p style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontSize: "2.2rem", letterSpacing: "-0.03em", color: "#141414", lineHeight: 1 }}>
                R$ 899<span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.4)" }}>,90</span>
              </p>
              <p style={{ fontSize: "0.68rem", color: "#A67C3D", fontWeight: 600, marginTop: "4px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>Economize R$ 149,60 no kit</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/colecao"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 32px", background: "#F1EFEA", color: "#0E0E0E", border: "1px solid #F1EFEA", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Helvetica Neue', Helvetica, sans-serif", transition: "background 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#A67C3D"; (e.currentTarget as HTMLElement).style.borderColor = "#A67C3D"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F1EFEA"; (e.currentTarget as HTMLElement).style.borderColor = "#F1EFEA"; }}
              >
                Montar meu Kit →
              </Link>
              <Link
                href="/revendedores"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 28px", color: "rgba(0,0,0,0.5)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", border: "1px solid #e8e3dc", fontFamily: "'Helvetica Neue', Helvetica, sans-serif", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#F1EFEA"; (e.currentTarget as HTMLElement).style.color = "#F1EFEA"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e3dc"; (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.5)"; }}
              >
                Seja Revendedor
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes fbg3d-spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
