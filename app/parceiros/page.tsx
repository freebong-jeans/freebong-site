"use client";

/**
 * Parceiros FBG — mapa de presença + localizador de loja.
 * O localizador não inventa endereços: coleta cidade/estado e leva
 * o cliente direto pro WhatsApp comercial, que confirma a loja mais próxima.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

const FONT = "'Helvetica Neue', Helvetica, sans-serif";
const WHATSAPP = "https://wa.me/message/3ROGXK7TIP7TC1";

const ESTADOS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB",
  "PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

/* Regiões com presença consolidada (dados institucionais da marca) */
const REGIOES = [
  { nome: "Sudeste",     estados: ["MG", "SP", "RJ", "ES"],                   destaque: "Sede em Minas Gerais" },
  { nome: "Nordeste",    estados: ["BA", "PE", "CE", "PB", "RN", "AL", "SE", "PI", "MA"], destaque: "Expansão acelerada" },
  { nome: "Sul",         estados: ["PR", "SC", "RS"],                          destaque: "Rede consolidada" },
  { nome: "Centro-Oeste",estados: ["GO", "MT", "MS", "DF"],                    destaque: "Atacado forte" },
  { nome: "Norte",       estados: ["PA", "AM", "TO", "RO", "AC", "AP", "RR"],  destaque: "Novos parceiros" },
];

const BENEFICIOS = [
  {
    num: "01",
    title: "Margem real",
    body: "Tabela de atacado com condições por volume e política clara de preço sugerido. Sem concorrência interna desleal.",
  },
  {
    num: "02",
    title: "Pronta entrega",
    body: "Estoque ativo das principais referências. Você repõe o que gira sem esperar programação de coleção.",
  },
  {
    num: "03",
    title: "Suporte de marketing",
    body: "Fotos em alta, vídeos de campanha, catálogo digital e material de PDV. Você vende com a mesma cara da marca.",
  },
  {
    num: "04",
    title: "Time direto",
    body: "Atendimento humano no WhatsApp, sem intermediário. Do primeiro pedido à reposição semanal.",
  },
];

export default function ParceirosPage() {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [heroReady, setHeroReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setHeroReady(true), 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = heroRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0) return;
        setScrollY(-r.top);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const buscarLink = useMemo(() => {
    const local = [cidade.trim(), uf].filter(Boolean).join(" / ");
    const msg = local
      ? `Olá! Quero saber qual a loja FBG mais próxima de ${local}.`
      : "Olá! Quero saber qual a loja FBG mais próxima de mim.";
    return `${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }, [cidade, uf]);

  return (
    <div style={{ background: "#FAF9F7", color: "#141414", minHeight: "100vh", fontFamily: FONT }}>

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{ position: "relative", height: "clamp(420px,62vh,620px)", overflow: "hidden", background: "#0E0E0E" }}>
        <Image
          src="/images/campaign/dsc01536.jpg"
          alt="Parceiros FBG pelo Brasil"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center 30%",
            transform: `scale(1.08) translateY(${scrollY * 0.12}px)`,
            filter: "brightness(0.6)",
            willChange: "transform",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.5) 100%)" }} />

        <div className="container-fbg" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "clamp(36px,6vw,72px)", zIndex: 2 }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A67C3D", marginBottom: "16px", opacity: heroReady ? 1 : 0, transition: "opacity 0.8s ease 0.1s" }}>
            Parceiros FBG
          </span>

          <h1 style={{ fontWeight: 900, fontSize: "clamp(2.2rem,6.5vw,5rem)", letterSpacing: "-0.04em", lineHeight: 1.02, textTransform: "uppercase", color: "#FFFFFF", margin: 0, maxWidth: "17ch", textWrap: "balance" }}>
            <MaskLine shown={heroReady} delay={200}>A FBG está</MaskLine>
            <MaskLine shown={heroReady} delay={320} color="#A67C3D">mais perto do que</MaskLine>
            <MaskLine shown={heroReady} delay={440}>você imagina.</MaskLine>
          </h1>

          <p style={{ fontSize: "clamp(0.88rem,1.6vw,1.02rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.68)", maxWidth: "48ch", marginTop: "clamp(18px,2.5vw,26px)", opacity: heroReady ? 1 : 0, transform: heroReady ? "none" : "translateY(14px)", transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s" }}>
            Mais de 200 lojas parceiras em 27 estados vendendo FBG Jeans Wear.
            Encontre a sua ou traga a marca pra sua cidade.
          </p>
        </div>
      </section>

      {/* ══ LOCALIZADOR ══ */}
      <section style={{ borderBottom: "1px solid rgba(10,10,10,0.08)", padding: "clamp(48px,7vw,88px) 0" }}>
        <div className="container-fbg">
          <div className="fbg-loc-grid">
            <div>
              <span style={{ display: "block", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#A67C3D", marginBottom: "12px" }}>
                Localizador
              </span>
              <h2 style={{ fontWeight: 900, fontSize: "clamp(1.7rem,3.6vw,2.8rem)", letterSpacing: "-0.035em", lineHeight: 1.04, textTransform: "uppercase", color: "#141414", margin: "0 0 16px", textWrap: "balance" }}>
                Veja uma loja<br />perto de você
              </h2>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(20,20,20,0.55)", maxWidth: "40ch", margin: 0 }}>
                Diga onde você está. Nosso time confirma na hora qual parceiro
                tem a coleção FBG mais perto de você.
              </p>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(10,10,10,0.09)",
                borderRadius: "8px",
                padding: "clamp(24px,3vw,36px)",
                boxShadow: "0 24px 60px -30px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "10px", marginBottom: "14px" }}>
                <select
                  value={uf}
                  onChange={e => setUf(e.target.value)}
                  aria-label="Estado"
                  style={{
                    padding: "16px 12px",
                    background: "#F4F3F1",
                    border: "1px solid transparent",
                    borderRadius: "6px",
                    fontFamily: FONT,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: uf ? "#141414" : "rgba(20,20,20,0.4)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="">UF</option>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>

                <input
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                  placeholder="Sua cidade"
                  aria-label="Cidade"
                  style={{
                    padding: "16px 18px",
                    background: "#F4F3F1",
                    border: "1px solid transparent",
                    borderRadius: "6px",
                    fontFamily: FONT,
                    fontSize: "0.9rem",
                    color: "#141414",
                    outline: "none",
                    minWidth: 0,
                    transition: "border-color 0.25s ease, background 0.25s ease",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#A67C3D"; e.currentTarget.style.background = "#FFFFFF"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#F4F3F1"; }}
                />
              </div>

              <a
                href={buscarLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "18px",
                  background: "#6B2033",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  transition: "background 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#A67C3D";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#6B2033";
                  el.style.transform = "none";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Encontrar loja
              </a>

              <p style={{ fontSize: "0.72rem", lineHeight: 1.6, color: "rgba(20,20,20,0.38)", margin: "14px 0 0", textAlign: "center" }}>
                Resposta em minutos, direto no WhatsApp da FBG.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRESENÇA NACIONAL ══ */}
      <section style={{ padding: "clamp(48px,7vw,88px) 0", borderBottom: "1px solid rgba(10,10,10,0.08)" }}>
        <div className="container-fbg">
          <span style={{ display: "block", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#A67C3D", marginBottom: "12px" }}>
            Presença nacional
          </span>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(1.6rem,3.4vw,2.6rem)", letterSpacing: "-0.035em", textTransform: "uppercase", color: "#141414", margin: "0 0 clamp(28px,4vw,44px)" }}>
            Onde a FBG já chegou
          </h2>

          <div className="fbg-regioes">
            {REGIOES.map((r, i) => (
              <RegiaoCard key={r.nome} {...r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ SEJA PARCEIRO ══ */}
      <section style={{ padding: "clamp(48px,7vw,88px) 0", background: "#FFFFFF" }}>
        <div className="container-fbg">
          <div style={{ maxWidth: "56ch", marginBottom: "clamp(32px,4vw,52px)" }}>
            <span style={{ display: "block", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#A67C3D", marginBottom: "12px" }}>
              Seja parceiro
            </span>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(1.7rem,3.6vw,2.8rem)", letterSpacing: "-0.035em", lineHeight: 1.05, textTransform: "uppercase", color: "#141414", margin: "0 0 16px", textWrap: "balance" }}>
              Traga a FBG pra sua loja
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(20,20,20,0.55)", margin: 0 }}>
              Marca com demanda no digital, produto que gira e suporte de verdade.
              É assim que o parceiro FBG vende mais sem aumentar risco de estoque.
            </p>
          </div>

          <div className="fbg-benef">
            {BENEFICIOS.map((b, i) => (
              <BeneficioCard key={b.num} {...b} index={i} />
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "clamp(32px,4vw,48px)" }}>
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Olá! Quero ser parceiro FBG e receber a tabela de atacado.")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "18px clamp(28px,4vw,44px)",
                background: "#6B2033",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                transition: "background 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#A67C3D";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#6B2033";
                el.style.transform = "none";
              }}
            >
              Pedir tabela de atacado
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <Link
              href="/revendedores"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "18px clamp(28px,4vw,44px)",
                background: "transparent",
                border: "1.5px solid rgba(10,10,10,0.18)",
                color: "#141414",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "#A67C3D")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(10,10,10,0.18)")}
            >
              Programa de revenda
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .fbg-loc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(28px,4vw,56px);
          align-items: center;
        }
        .fbg-regioes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1px;
          background: rgba(10,10,10,0.09);
          border: 1px solid rgba(10,10,10,0.09);
        }
        .fbg-benef {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: clamp(16px,2.5vw,28px);
        }
        @media (min-width: 900px) {
          .fbg-loc-grid { grid-template-columns: 1fr 460px; }
        }
      `}</style>
    </div>
  );
}

/* ── Linha com máscara ── */
function MaskLine({ children, shown, delay = 0, color }: { children: React.ReactNode; shown: boolean; delay?: number; color?: string }) {
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
      <span
        style={{
          display: "block",
          color: color ?? "inherit",
          transform: shown ? "translateY(0)" : "translateY(106%)",
          transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ── Card de região ── */
function RegiaoCard({ nome, estados, destaque, index }: { nome: string; estados: string[]; destaque: string; index: number }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "#FFFFFF",
        padding: "clamp(22px,3vw,32px)",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(20px)",
        transition: `opacity 0.7s ease ${index * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 90}ms, background 0.3s ease`,
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#FAF9F7")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "#141414" }}>
          {nome}
        </span>
        <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#A67C3D" }}>
          {estados.length}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
        {estados.map(e => (
          <span
            key={e}
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "4px 8px",
              background: "rgba(166,124,61,0.12)",
              color: "#8B6F47",
              borderRadius: "3px",
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <span style={{ fontSize: "0.72rem", color: "rgba(20,20,20,0.42)", letterSpacing: "0.04em" }}>
        {destaque}
      </span>
    </div>
  );
}

/* ── Card de benefício ── */
function BeneficioCard({ num, title, body, index }: { num: string; title: string; body: string; index: number }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        paddingTop: "20px",
        borderTop: "2px solid #141414",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(22px)",
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
      }}
    >
      <span style={{ display: "block", fontWeight: 900, fontSize: "0.85rem", color: "#A67C3D", marginBottom: "12px", letterSpacing: "0.06em" }}>
        {num}
      </span>
      <h3 style={{ fontWeight: 900, fontSize: "1.05rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "#141414", margin: "0 0 10px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "rgba(20,20,20,0.55)", margin: 0 }}>
        {body}
      </p>
    </div>
  );
}
