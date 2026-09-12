"use client";

import { useState, useId } from "react";
import Link from "next/link";

type Mode = "login" | "register";

function FloatInput({
  label,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "22px 16px 8px",
          border: `1.5px solid ${focused ? "#A67C3D" : "rgba(0,0,0,0.12)"}`,
          borderRadius: "6px",
          fontSize: "0.93rem",
          background: "#FFFFFF",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: focused ? "0 0 0 3px rgba(166,124,61,0.12)" : "none",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: "#141414",
        }}
      />
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: "16px",
          top: raised ? "7px" : "50%",
          transform: raised ? "none" : "translateY(-50%)",
          fontSize: raised ? "0.6rem" : "0.88rem",
          fontWeight: raised ? 700 : 400,
          letterSpacing: raised ? "0.1em" : "normal",
          textTransform: raised ? "uppercase" : "none",
          color: focused ? "#A67C3D" : "rgba(0,0,0,0.38)",
          transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {label}
      </label>
    </div>
  );
}

const BENEFITS = [
  "Cupons e promoções exclusivas",
  "Acesso antecipado a novos drops",
  "Frete grátis em compras recorrentes",
  "Programa de pontos e recompensas FBG",
];

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirm, setConfirm] = useState("");
  const [news, setNews] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function switchMode(m: Mode) {
    if (m === mode) return;
    setSwitching(true);
    setTimeout(() => { setMode(m); setSwitching(false); }, 220);
  }

  return (
    /* Cobre Navbar e todo o site — página independente */
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#F8F5F0",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Topo da página — logo + voltar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(20px,3vw,32px) clamp(24px,5vw,56px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "#FFFFFF",
        flexShrink: 0,
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "1.5rem",
            color: "#141414",
            letterSpacing: "-0.04em",
            lineHeight: 1.04,
          }}>
            FBG
          </span>
          <span style={{ color: "#A67C3D", fontSize: "0.85rem", marginLeft: "1px" }}>›</span>
        </Link>

        <Link href="/" style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)",
          textDecoration: "none",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "color 0.2s ease",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F1EFEA")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.4)")}
        >
          ← Voltar à loja
        </Link>
      </div>

      {/* Corpo — duas colunas em desktop, uma em mobile */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "stretch",
      }}>
        {/* Coluna esquerda — só desktop */}
        <div
          className="hidden md:flex flex-col justify-center"
          style={{
            flex: "0 0 42%",
            padding: "clamp(40px,5vw,72px) clamp(32px,4vw,60px)",
            borderRight: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <p className="type-eyebrow" style={{ marginBottom: "24px" }}>Por que criar uma conta</p>
          <h2 style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(1.8rem,3vw,2.8rem)",
            letterSpacing: "-0.03em",
            color: "#141414",
            lineHeight: 1.05,
            marginBottom: "32px",
            textTransform: "uppercase",
          }}>
            Faça parte<br />da comunidade<br />
            <span style={{ color: "#6B2033" }}>FBG.</span>
          </h2>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            {BENEFITS.map((b) => (
              <li key={b} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ color: "#A67C3D", fontSize: "0.55rem", flexShrink: 0 }}>✦</span>
                <span style={{
                  fontSize: "0.82rem",
                  color: "rgba(0,0,0,0.6)",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "40px", fontSize: "0.72rem", color: "rgba(0,0,0,0.3)", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Comunidade de <strong style={{ color: "#141414" }}>31.000+</strong> originais desde 2013.
          </div>
        </div>

        {/* Coluna direita — formulário */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(32px,5vw,72px) clamp(24px,5vw,60px)",
        }}>
          <div style={{ width: "100%", maxWidth: "400px" }}>

            {/* Tabs */}
            <div style={{
              display: "flex",
              gap: "0",
              borderBottom: "1.5px solid rgba(0,0,0,0.08)",
              marginBottom: "36px",
            }}>
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    border: "none",
                    background: "transparent",
                    borderBottom: `2px solid ${mode === m ? "#F1EFEA" : "transparent"}`,
                    marginBottom: "-1.5px",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: mode === m ? "#F1EFEA" : "rgba(0,0,0,0.28)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {m === "login" ? "Entrar" : "Criar Conta"}
                </button>
              ))}
            </div>

            {/* Headline */}
            <div style={{
              marginBottom: "28px",
              opacity: switching ? 0 : 1,
              transform: switching ? "translateY(6px)" : "none",
              transition: "all 0.22s ease",
            }}>
              <h2 style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                color: "#141414",
                lineHeight: 1.1,
                marginBottom: "8px",
              }}>
                {mode === "login" ? "Bem-vindo de volta." : "Seja um original."}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.45)", lineHeight: 1.6, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                {mode === "login"
                  ? "Entre na sua conta FBG e acesse tudo que é exclusivo."
                  : "Crie sua conta agora. Promoções exclusivas te esperam."}
              </p>
            </div>

            {/* Em breve */}
            {submitted && (
              <div style={{
                padding: "28px 24px", textAlign: "center",
                border: "1px solid rgba(166,124,61,0.25)",
                borderRadius: "8px", background: "rgba(166,124,61,0.04)",
                marginBottom: "20px",
              }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1.5px solid #A67C3D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A67C3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#141414", marginBottom: "8px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  Área em desenvolvimento
                </p>
                <p style={{ fontSize: "0.72rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.7, marginBottom: "20px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  Nosso sistema de contas está sendo preparado. Por enquanto, fale com a gente pelo WhatsApp.
                </p>
                <a
                  href="https://wa.me/message/3ROGXK7TIP7TC1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "12px 24px", background: "#6B2033", color: "#FFFFFF",
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em",
                    textTransform: "uppercase", textDecoration: "none",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    borderRadius: "4px",
                  }}
                >
                  Falar no WhatsApp
                </a>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              style={{
                opacity: switching ? 0 : 1,
                transform: switching ? "translateY(6px)" : "none",
                transition: "all 0.22s ease",
                display: submitted ? "none" : "block",
              }}
            >
              {mode === "register" && (
                <FloatInput label="Nome completo" value={name} onChange={setName} required autoComplete="name" />
              )}

              <FloatInput label="E-mail" type="email" value={email} onChange={setEmail} required autoComplete="email" />

              {mode === "register" && (
                <FloatInput label="Celular (com DDD)" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
              )}

              <FloatInput
                label="Senha"
                type="password"
                value={password}
                onChange={setPassword}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              {mode === "register" && (
                <FloatInput label="Confirmar senha" type="password" value={confirm} onChange={setConfirm} required autoComplete="new-password" />
              )}

              {mode === "login" && (
                <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "20px" }}>
                  <Link href="/conta/recuperar" style={{
                    fontSize: "0.7rem", color: "#A67C3D", textDecoration: "none",
                    fontWeight: 600, letterSpacing: "0.06em",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}>
                    Esqueceu a senha?
                  </Link>
                </div>
              )}

              {mode === "register" && (
                <label style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  marginBottom: "20px", cursor: "pointer",
                  padding: "12px", borderRadius: "6px",
                  background: "rgba(0,0,0,0.03)",
                }}>
                  <input
                    type="checkbox"
                    checked={news}
                    onChange={(e) => setNews(e.target.checked)}
                    style={{ width: "15px", height: "15px", accentColor: "#A67C3D", cursor: "pointer", marginTop: "1px", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.72rem", lineHeight: 1.6, color: "rgba(0,0,0,0.55)", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    Quero receber cupons, promoções e novidades exclusivas da FBG
                  </span>
                </label>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#F1EFEA",
                  color: "#0E0E0E",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  cursor: "pointer",
                  transition: "background 0.2s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2D3748")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#F1EFEA")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {mode === "login" ? "Entrar na conta →" : "Criar minha conta →"}
              </button>

              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                margin: "24px 0", color: "rgba(0,0,0,0.2)",
                fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
                ou
                <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
              </div>

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(0,0,0,0.4)", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                {mode === "login" ? "Ainda não tem conta? " : "Já tem uma conta? "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "login" ? "register" : "login")}
                  style={{
                    background: "none", border: "none", padding: 0,
                    color: "#A67C3D", fontWeight: 700, fontSize: "0.75rem",
                    cursor: "pointer", textDecoration: "underline",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {mode === "login" ? "Criar agora" : "Entrar"}
                </button>
              </p>

              {mode === "register" && (
                <p style={{
                  marginTop: "20px", fontSize: "0.6rem", color: "rgba(0,0,0,0.28)",
                  textAlign: "center", lineHeight: 1.7,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}>
                  Ao criar sua conta você concorda com os{" "}
                  <Link href="/termos" style={{ color: "#A67C3D", textDecoration: "underline" }}>Termos de Uso</Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" style={{ color: "#A67C3D", textDecoration: "underline" }}>Política de Privacidade</Link>.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
