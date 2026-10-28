"use client";

/**
 * WelcomePopup — captura de e-mail estilo editorial.
 * Layout split: foto de campanha à esquerda, oferta à direita.
 * Aparece uma vez por sessão, após 12s ou 35% de scroll.
 * Aba lateral com o desconto reabre o popup depois de fechado.
 * O cadastro (nome, e-mail, WhatsApp, aniversario) vai para o Netlify Forms.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CUPOM_BOAS_VINDAS, DESCONTO_BOAS_VINDAS } from "@/lib/loja";
import { enviarLead } from "@/lib/leads";

const FONT = "'Helvetica Neue', Helvetica, sans-serif";
const STORAGE_SHOWN = "fbg_welcome_seen";
const CUPOM = CUPOM_BOAS_VINDAS;
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const campoStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "13px 14px",
  background: "#F4F3F1",
  border: "1px solid transparent",
  borderRadius: "6px",
  fontFamily: FONT,
  fontSize: "16px", // 16px evita o zoom automatico do iPhone ao focar
  color: "#141414",
  outline: "none",
};

const rotuloStyle: React.CSSProperties = {
  display: "block",
  fontFamily: FONT,
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(20,20,20,0.55)",
  marginBottom: "6px",
};

/** (11) 98765-4321 enquanto digita. */
function mascaraTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [aceite, setAceite] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const seenRef = useRef(false);

  /* gatilho: tempo OU scroll (o que vier primeiro) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_SHOWN)) {
      const id = requestAnimationFrame(() => setDismissed(true));
      return () => cancelAnimationFrame(id);
    }

    const show = () => {
      if (seenRef.current) return;
      seenRef.current = true;
      sessionStorage.setItem(STORAGE_SHOWN, "1");
      setOpen(true);
    };

    const timer = setTimeout(show, 12000);
    const onScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (p > 0.35) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* trava scroll e fecha no ESC */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    setDismissed(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !aceite || enviando) return;
    setEnviando(true);
    try {
      await enviarLead("boas-vindas", {
        nome: nome.trim(),
        email: email.trim(),
        telefone,
        aniversario: dia && mes ? `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}` : "",
        consentimento: "sim",
      });
    } catch (err) {
      console.error("Erro ao salvar o cadastro:", err);
    }
    setSent(true);
  }

  function copyCupom() {
    navigator.clipboard.writeText(CUPOM).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      {/* ── Aba lateral (reabre) ── */}
      {dismissed && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir oferta de boas-vindas"
          className="hidden md:flex"
          style={{
            position: "fixed",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 280,
            alignItems: "center",
            justifyContent: "center",
            writingMode: "vertical-rl",
            padding: "18px 8px",
            background: "rgba(14,14,14,0.88)",
            backdropFilter: "blur(10px)",
            color: "#B0864A",
            border: "none",
            borderRadius: "0 6px 6px 0",
            fontFamily: FONT,
            fontSize: "0.54rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.35)",
          }}
        >
          {DESCONTO_BOAS_VINDAS}% OFF
        </button>
      )}

      {!open ? null : (
        <div style={{ position: "fixed", inset: 0, zIndex: 900 }} role="dialog" aria-modal="true" aria-label="Boas-vindas Freebong">
          {/* backdrop */}
          <div
            onClick={close}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,10,0.6)",
              backdropFilter: "blur(6px)",
              animation: "fbgPopFade 0.4s ease",
            }}
          />

          {/* card */}
          <div
            className="fbg-pop-card"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              width: "min(94vw, 880px)",
              maxHeight: "92dvh",
              background: "#FFFFFF",
              borderRadius: "10px",
              overflowX: "hidden",
              overflowY: "auto",
              display: "grid",
              boxShadow: "0 40px 90px -25px rgba(0,0,0,0.5)",
              animation: "fbgPopIn 0.55s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Foto */}
            <div className="fbg-pop-img" style={{ position: "relative", background: "#6B2033", minHeight: "140px" }}>
              <Image
                src="/images/campaign/dsc01659.jpg"
                alt="Freebong Jeans Wear"
                fill
                sizes="(max-width: 768px) 100vw, 44vw"
                style={{ objectFit: "cover", objectPosition: "center 22%" }}
                priority
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)" }} />
              <span
                style={{
                  position: "absolute",
                  left: "20px",
                  bottom: "18px",
                  fontFamily: FONT,
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Jeans Collection 2026
              </span>
            </div>

            {/* Conteúdo */}
            <div style={{ padding: "clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
              <button
                onClick={close}
                aria-label="Fechar"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#6B2033",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.25s ease, transform 0.25s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#B0864A";
                  (e.currentTarget as HTMLElement).style.transform = "rotate(90deg)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "#6B2033";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {!sent ? (
                <>
                  <span style={{ fontFamily: FONT, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#B0864A", marginBottom: "14px" }}>
                    Primeira compra?
                  </span>

                  <h2
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.08,
                      color: "#141414",
                      margin: "0 0 14px",
                      textWrap: "balance",
                    }}
                  >
                    Ganhe{" "}
                    <span style={{ position: "relative", display: "inline-block" }}>
                      {DESCONTO_BOAS_VINDAS}% OFF
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: "0.08em",
                          height: "0.16em",
                          background: "#B0864A",
                          opacity: 0.5,
                          borderRadius: "2px",
                        }}
                      />
                    </span>{" "}
                    no seu primeiro pedido
                  </h2>

                  <p className="fbg-pop-desc" style={{ fontFamily: FONT, fontSize: "0.88rem", lineHeight: 1.7, color: "rgba(20,20,20,0.55)", margin: "0 0 24px", maxWidth: "42ch" }}>
                    Entre na lista e receba os lançamentos, drops exclusivos e condições
                    que só quem é FBG recebe.
                  </p>

                  <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label htmlFor="fbg-pop-nome" style={rotuloStyle}>Nome</label>
                      <input id="fbg-pop-nome" className="fbg-pop-campo" type="text" required autoComplete="name"
                        value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={campoStyle} />
                    </div>
                    <div>
                      <label htmlFor="fbg-pop-email" style={rotuloStyle}>E-mail</label>
                      <input id="fbg-pop-email" className="fbg-pop-campo" type="email" required autoComplete="email"
                        value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" style={campoStyle} />
                    </div>
                    <div className="fbg-pop-linha">
                      <div>
                        <label htmlFor="fbg-pop-tel" style={rotuloStyle}>WhatsApp</label>
                        <input id="fbg-pop-tel" className="fbg-pop-campo" type="tel" inputMode="numeric" autoComplete="tel-national"
                          required pattern="\(\d{2}\) \d{4,5}-\d{4}" title="DDD + número, ex.: (31) 98765-4321"
                          value={telefone} onChange={e => setTelefone(mascaraTelefone(e.target.value))} placeholder="(31) 98765-4321" style={campoStyle} />
                      </div>
                      <div>
                        <span style={rotuloStyle}>Aniversário</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <select aria-label="Dia do aniversário" className="fbg-pop-campo" value={dia} onChange={e => setDia(e.target.value)} style={campoStyle}>
                            <option value="">Dia</option>
                            {Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i + 1)}>{i + 1}</option>)}
                          </select>
                          <select aria-label="Mês do aniversário" className="fbg-pop-campo" value={mes} onChange={e => setMes(e.target.value)} style={campoStyle}>
                            <option value="">Mês</option>
                            {MESES.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer", fontFamily: FONT, fontSize: "0.7rem", lineHeight: 1.5, color: "rgba(20,20,20,0.55)" }}>
                      <input type="checkbox" required checked={aceite} onChange={e => setAceite(e.target.checked)}
                        style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#6B2033", flexShrink: 0 }} />
                      <span>
                        Quero receber novidades e ofertas da Freebong por e-mail e WhatsApp. Veja a{" "}
                        <a href="/privacidade" target="_blank" style={{ color: "inherit" }}>Política de Privacidade</a>.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={enviando}
                      style={{
                        padding: "16px",
                        background: "#6B2033",
                        border: "none",
                        borderRadius: "6px",
                        color: "#FFFFFF",
                        cursor: enviando ? "wait" : "pointer",
                        fontFamily: FONT,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        transition: "background 0.25s ease",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#B0864A")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#6B2033")}
                    >
                      {enviando ? "Enviando..." : `Quero meus ${DESCONTO_BOAS_VINDAS}% OFF`}
                    </button>
                  </form>

                  <button
                    onClick={close}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: FONT,
                      fontSize: "0.7rem",
                      color: "rgba(20,20,20,0.35)",
                      textAlign: "left",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Agora não, obrigado
                  </button>
                </>
              ) : (
                <div style={{ animation: "fbgPopIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
                  <span style={{ fontFamily: FONT, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#B0864A", display: "block", marginBottom: "14px" }}>
                    Bem-vindo à FBG
                  </span>
                  <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(1.4rem, 2.6vw, 2rem)", letterSpacing: "-0.03em", color: "#141414", margin: "0 0 16px" }}>
                    Seu cupom está pronto
                  </h2>
                  <button
                    onClick={copyCupom}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      width: "100%",
                      padding: "18px 20px",
                      background: "transparent",
                      border: "1.5px dashed #B0864A",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginBottom: "16px",
                    }}
                  >
                    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.3rem", letterSpacing: "0.1em", color: "#141414" }}>
                      {CUPOM}
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0864A" }}>
                      {copied ? "Copiado!" : "Copiar"}
                    </span>
                  </button>
                  <p style={{ fontFamily: FONT, fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(20,20,20,0.55)", margin: "0 0 22px" }}>
                    Use no fechamento do pedido e ganhe {DESCONTO_BOAS_VINDAS}% na primeira compra.
                  </p>
                  <a
                    href="/colecao"
                    onClick={close}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "16px 30px",
                      background: "#6B2033",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontFamily: FONT,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    Ver a coleção
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes fbgPopIn {
              from { opacity: 0; transform: translate(-50%,-46%) scale(0.97); }
              to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
            }
            @keyframes fbgPopFade { from { opacity: 0; } to { opacity: 1; } }
            .fbg-pop-card { grid-template-columns: 1fr; grid-template-rows: 140px auto; }
            .fbg-pop-campo:focus { border-color: #B0864A !important; background: #FFFFFF !important; }
            @media (max-width: 479px) { .fbg-pop-desc { display: none; } }
            .fbg-pop-linha { display: grid; grid-template-columns: 1fr; gap: 12px; }
            @media (min-width: 480px) { .fbg-pop-linha { grid-template-columns: 1fr 1fr; } }
            .fbg-pop-card > div:last-of-type { animation: none; }
            @media (min-width: 760px) {
              .fbg-pop-card { grid-template-columns: 44% 1fr; grid-template-rows: auto; min-height: 460px; }
              .fbg-pop-img { min-height: 100% !important; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
