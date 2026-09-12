"use client";

import Link from "next/link";
import { useState } from "react";
import FooterLogo3D from "@/components/FooterLogo3D";

const LINKS = {
  colecao: [
    { label: "Calças Jeans",   href: "/colecao?categoria=calca" },
    { label: "Bermudas",       href: "/colecao?categoria=bermuda" },
    { label: "Jaquetas",       href: "/colecao?categoria=jaqueta" },
    { label: "Kits Completos", href: "/colecao" },
  ],
  marca: [
    { label: "O Movimento",    href: "/movimento" },
    { label: "Nossa História", href: "/movimento" },
    { label: "Parceiros FBG",  href: "/parceiros" },
    { label: "Seja Revendedor",href: "/revendedores" },
    { label: "Comunidade FBG", href: "https://wa.me/message/3ROGXK7TIP7TC1" },
  ],
  suporte: [
    { label: "Tamanhos & Medidas", href: "/tamanhos" },
    { label: "Trocas & Devoluções",href: "/politica-trocas" },
    { label: "Rastrear Pedido",    href: "/rastrear" },
    { label: "Fale Conosco",       href: "https://wa.me/message/3ROGXK7TIP7TC1" },
  ],
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/freebong_/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/message/3ROGXK7TIP7TC1",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@freebong",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSent(true);
    setEmail("");
  }

  return (
    <footer
      style={{
        background: "#6B2033",
        borderTop: "1px solid rgba(0,0,0,0.25)",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      {/* ── Faixa superior — email capture ─────────────────── */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.14)",
          padding: "clamp(32px,5vw,48px) 0",
        }}
      >
        <div
          className="container-fbg"
          style={{
            display: "flex",
            flexDirection: "column" as const,
            gap: "clamp(0px,3vw,32px)",
            alignItems: "flex-start",
          }}
        >
          <div
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full"
            style={{ gap: "clamp(20px,3vw,32px)" }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#E9CFA6",
                  marginBottom: "8px",
                }}
              >
                Novidades & Lançamentos
              </p>
              <p
                style={{
                  fontSize: "clamp(1.1rem,2.2vw,1.4rem)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                }}
              >
                Seja o primeiro a saber.
              </p>
            </div>

            {/* Form de captura */}
            {sent ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 20px",
                  border: "1px solid rgba(233,207,166,0.45)",
                  minWidth: "340px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#E9CFA6" strokeWidth="1"/>
                  <path d="M4.5 7L6.5 9L9.5 5" stroke="#E9CFA6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "#E9CFA6", fontWeight: 600, textTransform: "uppercase" }}>
                  Cadastrado com sucesso!
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  minWidth: "clamp(280px,40vw,420px)",
                  maxWidth: "100%",
                  border: "1px solid rgba(255,255,255,0.28)",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(233,207,166,0.65)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
              >
                <input
                  type="email"
                  className="fbg-rodape-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "14px 16px",
                    fontSize: "0.78rem",
                    color: "#FFFFFF",
                    fontFamily: "inherit",
                    letterSpacing: "0.02em",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#A67C3D",
                    border: "none",
                    padding: "14px 20px",
                    cursor: "pointer",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#0E0E0E",
                    fontFamily: "inherit",
                    transition: "background 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#c8a882")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#A67C3D")}
                >
                  Inscrever
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Corpo principal ─────────────────────────────────── */}
      <div
        className="container-fbg"
        style={{ padding: "clamp(48px,7vw,72px) 1.5rem clamp(32px,5vw,48px)" }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
          style={{ gap: "clamp(32px,5vw,48px)" }}
        >
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  fontSize: "clamp(1.6rem,3.5vw,2.2rem)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  lineHeight: 1.04,
                }}
              >
                FREEBONG
                <span style={{ color: "#E9CFA6" }}>.</span>
              </span>
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.62)",
                maxWidth: "260px",
                marginBottom: "28px",
              }}
            >
              Vestuário premium com identidade brasileira. Seja livre, seja FBG.
            </p>

            {/* Redes sociais */}
            <div style={{ display: "flex", gap: "12px" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.22)",
                    color: "rgba(255,255,255,0.62)",
                    transition: "border-color 0.2s, color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(233,207,166,0.6)";
                    el.style.color = "#E9CFA6";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.22)";
                    el.style.color = "rgba(255,255,255,0.62)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Coleção */}
          <div>
            <p
              style={{
                fontSize: "0.56rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#E9CFA6",
                marginBottom: "16px",
              }}
            >
              Coleção
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {LINKS.colecao.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.74)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.74)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marca */}
          <div>
            <p
              style={{
                fontSize: "0.56rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#E9CFA6",
                marginBottom: "16px",
              }}
            >
              Marca
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {LINKS.marca.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.74)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.74)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <p
              style={{
                fontSize: "0.56rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#E9CFA6",
                marginBottom: "16px",
              }}
            >
              Suporte
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {LINKS.suporte.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.74)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.74)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Rodapé legal ───────────────────────────────────── */}
      <div
        style={{
          borderTop: "none",
          background: "#0E0E0E",
          padding: "20px 0",
        }}
      >
        <div
          className="container-fbg flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{ gap: "10px" }}
        >
          <p
            style={{
              fontSize: "0.62rem",
              color: "rgba(255,255,255,0.42)",
              letterSpacing: "0.06em",
              lineHeight: 1.6,
            }}
          >
            © {new Date().getFullYear()} FREEBONG. Todos os direitos reservados. · CNPJ 41.480.631/0001-32
          </p>
          <div
            className="flex items-center"
            style={{ gap: "20px" }}
          >
            {["Privacidade", "Termos"].map((l) => (
              <Link
                key={l}
                href={`/${l.toLowerCase()}`}
                style={{
                  fontSize: "0.62rem",
                  color: "rgba(255,255,255,0.42)",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.42)")}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sem isto o placeholder fica no cinza padrao do navegador, que
          some sobre o vinho. */}
      <style>{`.fbg-rodape-email::placeholder { color: rgba(255,255,255,0.45); }`}</style>

      {/* ── Assinatura FBG 3D ─────────────────────────────── */}
      <FooterLogo3D />
    </footer>
  );
}
