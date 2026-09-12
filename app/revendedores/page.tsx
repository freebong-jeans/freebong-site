"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import GlobeViz from "@/components/GlobeViz";

/* ── Helpers de animação ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      setVal(Math.round((1 - (1 - p) ** 3) * target));
      if (p >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return val;
}

function SplitChar({
  text, delay = 0, inView, style,
}: { text: string; delay?: number; inView: boolean; style?: React.CSSProperties }) {
  return (
    <span style={{ display: "block", whiteSpace: "nowrap", ...style }}>
      {[...text].map((ch, i) =>
        ch === " " ? (
          <span key={i} style={{ display: "inline-block", width: "0.28em" }} />
        ) : (
          <span key={i} style={{
            display: "inline-block", overflow: "hidden", lineHeight: "inherit",
            paddingTop: "0.14em", paddingBottom: "0.2em",
            marginTop: "-0.14em", marginBottom: "-0.2em", verticalAlign: "bottom",
          }}>
            <span style={{
              display: "inline-block",
              transform: inView ? "translateY(0)" : "translateY(118%)",
              transition: `transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay + i * 22}ms`,
              willChange: "transform",
            }}>
              {ch}
            </span>
          </span>
        )
      )}
    </span>
  );
}

function FadeUp({ children, delay = 0, inView }: { children: React.ReactNode; delay?: number; inView: boolean }) {
  return (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(16px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const hn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
  letterSpacing: "-0.03em",
  lineHeight: 1.04,
  textTransform: "uppercase",
  ...extra,
});

const WHATSAPP_BASE = "https://wa.me/message/3ROGXK7TIP7TC1";

/* ── Dados ── */
const BENEFICIOS = [
  {
    num: "01",
    title: "Margem Competitiva",
    color: "#A67C3D",
    body: "Preços de atacado pensados para que sua margem seja real. Quanto maior o volume, melhor a condição.",
  },
  {
    num: "02",
    title: "Suporte de Marketing",
    color: "#6B2033",
    body: "Artes prontas, fotos de produto e conteúdo para redes sociais. Você vende, a gente te dá munição.",
  },
  {
    num: "03",
    title: "Produto Premium",
    color: "#0E0E0E",
    body: "Tecido selecionado, costura reforçada e acabamento que justifica o preço. Cliente satisfeito volta.",
  },
  {
    num: "04",
    title: "Exclusividade Territorial",
    color: "#A67C3D",
    body: "Para parceiros de maior volume, garantimos exclusividade por região. Sem concorrência interna na sua praça.",
  },
];

const LINHAS = [
  { nome: "Basic",    cor: "#A67C3D", desc: "Entrada premium. Volume e giro rápido para o dia a dia da loja." },
  { nome: "Standard", cor: "#0E0E0E", desc: "Equilíbrio entre estilo e margem. O carro-chefe de quem revende FBG." },
  { nome: "Premium",  cor: "#6B2033", desc: "Linha de alto padrão. Ticket médio maior, cliente fiel à marca." },
];

const PASSOS = [
  { num: "01", title: "Preencha o formulário", body: "Conte sobre sua loja, cidade e como pretende vender: físico, online ou ambos." },
  { num: "02", title: "Conversa com nosso time", body: "Entramos em contato pelo WhatsApp para entender seu perfil e apresentar as condições." },
  { num: "03", title: "Primeiro pedido", body: "Catálogo, tabela de preços e condições de pagamento liberados. Você começa a vender." },
];

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function RevendedoresPage() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const s1 = useInView(0.1);
  const s2 = useInView(0.1);
  const s3 = useInView(0.08);
  const s4 = useInView(0.1);
  const s5 = useInView(0.1);
  const s6 = useInView(0.1);

  const lojas    = useCounter(200, s2.inView, 1500);
  const estados  = useCounter(27,  s2.inView, 1200);
  const seguid   = useCounter(31,  s2.inView, 1500);
  const anos     = useCounter(11,  s2.inView, 1300);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fica ao lado do globo (coluna com ~metade da largura da página),
  // por isso o tamanho usa uma fração menor da viewport: do contrário
  // a frase estoura a coluna e quebra no meio da palavra.
  const DISPLAY = "clamp(1.8rem,3.4vw,3.4rem)";

  return (
    <div className="bg-[#FAF9F7] text-[#141414] overflow-x-hidden">

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", height: "100svh", overflow: "hidden" }}>
        <video
          autoPlay loop muted playsInline
          onCanPlay={() => setHeroLoaded(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `scale(1.08) translateY(${scrollY * 0.22}px)`,
            willChange: "transform",
            opacity: heroLoaded ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.9) 100%)",
          zIndex: 1,
        }} />

        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "clamp(40px,8vw,96px) clamp(20px,5vw,80px)",
        }}>
          <span className="type-eyebrow" style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "none" : "translateY(8px)",
            transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
            display: "block", marginBottom: "20px",
          }}>
            Seja um Revendedor · FBG Jeans Wear
          </span>

          <div style={{ overflow: "hidden", opacity: heroLoaded ? 1 : 0, transition: "opacity 0.1s ease 0.8s" }}>
            <h1 style={hn({ fontSize: "clamp(2.6rem,8vw,7.2rem)", color: "#FFFFFF" })}>
              VISTA O
            </h1>
            <h1 style={hn({
              fontSize: "clamp(2.6rem,8vw,7.2rem)",
              color: "#A67C3D",
              paddingLeft: "clamp(1rem,5vw,6rem)",
            })}>
              FUTURO.
            </h1>
          </div>

          <div style={{
            marginTop: "clamp(20px,2.5vw,32px)",
            display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap",
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "none" : "translateY(12px)",
            transition: "opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s",
          }}>
            <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "360px" }}>
              Mais de 200 lojas em 27 estados já revendem FBG. Produto premium,
              margem real e suporte completo para sua loja crescer.
            </p>
            <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.15)" }} />
            <Link href="#formulario" style={{
              fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#A67C3D",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
            }}>
              Quero ser parceiro
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "bounce-down 1.6s ease-in-out infinite" }}>
                <path d="M8 3v10M3 9l5 5 5-5" stroke="#A67C3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes bounce-down {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
        `}</style>
      </section>

      {/* ══ §1 STATEMENT ══ */}
      <section ref={s1.ref} style={{
        borderTop: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(56px,8vw,96px)",
        paddingBottom: "clamp(40px,5vw,64px)",
      }}>
        <div className="container-fbg" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          alignItems: "center",
          gap: "clamp(40px,6vw,80px)",
        }}>
          {/* Texto — esquerda */}
          <div>
            <FadeUp inView={s1.inView} delay={0}>
              <span className="type-eyebrow">Parceria FBG</span>
            </FadeUp>
            <div style={{ marginTop: "clamp(20px,2.5vw,32px)" }}>
              <SplitChar text="VOCÊ VENDE" delay={60} inView={s1.inView} style={hn({ fontSize: DISPLAY, color: "#0E0E0E" })} />
              <SplitChar text="A IDENTIDADE." delay={160} inView={s1.inView} style={hn({ fontSize: DISPLAY, WebkitTextStroke: "1.5px rgba(10,10,10,0.35)", color: "transparent", paddingLeft: "clamp(0.8rem,1.8vw,2rem)" })} />
              <SplitChar text="A GENTE CUIDA" delay={250} inView={s1.inView} style={hn({ fontSize: DISPLAY, color: "#0E0E0E" })} />
              <SplitChar text="DO RESTO." delay={340} inView={s1.inView} style={hn({ fontSize: DISPLAY, color: "#6B2033", paddingLeft: "clamp(0.8rem,2.5vw,2.8rem)" })} />
            </div>
            <FadeUp inView={s1.inView} delay={560}>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(10,10,10,0.38)", maxWidth: "420px", marginTop: "clamp(24px,3vw,40px)" }}>
                Catálogo completo, tabela de preços, material de divulgação e suporte
                direto. Tudo o que sua loja precisa para vender FBG sem complicação.
              </p>
            </FadeUp>
          </div>

          {/* Globo — direita, centralizado num quadrado responsivo */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: s1.inView ? 1 : 0,
            transition: "opacity 1.2s ease 500ms",
          }}>
            <div style={{ width: "min(100%, 480px)" }}>
              <GlobeViz />
            </div>
          </div>
        </div>
      </section>

      {/* ══ §2 NÚMEROS ══ */}
      <section ref={s2.ref} style={{ borderTop: "1px solid rgba(10,10,10,0.07)", borderBottom: "1px solid rgba(10,10,10,0.07)" }}>
        <div className="container-fbg grid grid-cols-2 md:grid-cols-4" style={{ padding: "clamp(40px,6vw,72px) 1.5rem", gap: "clamp(24px,3vw,0px)" }}>
          {[
            { value: lojas,   suffix: "+", label: "Lojas parceiras",      sub: "Em todo o país" },
            { value: estados, suffix: "+", label: "Estados com presença", sub: "Brasil" },
            { value: seguid,  suffix: "K+", label: "Seguidores",          sub: "Demanda já existe" },
            { value: anos,    suffix: "",  label: "Anos de mercado",      sub: "Desde 2013" },
          ].map((s, i) => (
            <div key={i} style={{
              opacity: s2.inView ? 1 : 0,
              transform: s2.inView ? "none" : "translateY(14px)",
              transition: `opacity 0.7s ease ${i * 110}ms, transform 0.7s ease ${i * 110}ms`,
            }}>
              <p style={hn({
                fontSize: "clamp(2rem,4vw,3.6rem)", color: "#0E0E0E",
                filter: s2.inView ? "blur(0)" : "blur(6px)",
                transition: `filter 0.9s ease ${i * 110 + 250}ms`,
              })}>
                {s.value}{s.suffix}
              </p>
              <p className="type-eyebrow" style={{ marginTop: "8px", color: "rgba(10,10,10,0.6)" }}>{s.label}</p>
              <p style={{ fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(10,10,10,0.22)", marginTop: "4px" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ §3 BENEFÍCIOS ══ */}
      <section ref={s3.ref} style={{ paddingTop: "clamp(56px,8vw,96px)", paddingBottom: "clamp(56px,8vw,96px)" }}>
        <div className="container-fbg" style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          <FadeUp inView={s3.inView} delay={0}>
            <span className="type-eyebrow">Por que revender FBG</span>
            <h3 style={{ ...hn({ fontSize: "clamp(1.6rem,3.4vw,3rem)", color: "#0E0E0E" }), marginTop: "16px" }}>
              Vantagens reais para sua loja
            </h3>
          </FadeUp>
        </div>

        <div className="container-fbg grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(10,10,10,0.05)" }}>
          {BENEFICIOS.map((b, i) => (
            <div key={b.num} style={{
              background: "#FFFFFF", padding: "clamp(24px,3vw,40px)", position: "relative",
              opacity: s3.inView ? 1 : 0,
              transform: s3.inView ? "none" : "translateY(20px)",
              transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "32px", height: "2px", background: b.color }} />
              <span style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 900, fontStyle: "italic",
                fontSize: "1.6rem", letterSpacing: "-0.04em",
                WebkitTextStroke: `1px ${b.color}`, color: "transparent",
                display: "block", marginBottom: "16px", marginTop: "8px",
              }}>{b.num}</span>
              <h4 style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 900, fontStyle: "italic", fontSize: "clamp(1rem,1.6vw,1.3rem)",
                textTransform: "uppercase", letterSpacing: "-0.02em", color: "#0E0E0E", marginBottom: "10px",
              }}>{b.title}</h4>
              <p style={{ fontSize: "0.84rem", lineHeight: 1.75, color: "rgba(10,10,10,0.38)", maxWidth: "420px" }}>{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ §4 LINHAS DE PRODUTO ══ */}
      <section ref={s4.ref} style={{ borderTop: "1px solid rgba(10,10,10,0.07)", paddingTop: "clamp(56px,8vw,96px)", paddingBottom: "clamp(56px,8vw,96px)" }}>
        <div className="container-fbg" style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          <FadeUp inView={s4.inView} delay={0}>
            <span className="type-eyebrow">Catálogo</span>
            <h3 style={{ ...hn({ fontSize: "clamp(1.6rem,3.4vw,3rem)", color: "#0E0E0E" }), marginTop: "16px" }}>
              Três linhas, um padrão
            </h3>
          </FadeUp>
        </div>

        <div className="container-fbg grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(10,10,10,0.05)" }}>
          {LINHAS.map((l, i) => (
            <div key={l.nome} style={{
              background: "#FFFFFF", padding: "clamp(32px,4vw,48px) clamp(24px,3vw,32px)",
              opacity: s4.inView ? 1 : 0,
              transform: s4.inView ? "none" : "translateY(20px)",
              transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms`,
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: l.cor, marginBottom: "20px" }} />
              <h4 style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 900, fontStyle: "italic", fontSize: "clamp(1.4rem,2.2vw,1.9rem)",
                textTransform: "uppercase", letterSpacing: "-0.03em", color: "#0E0E0E", marginBottom: "12px",
              }}>{l.nome}</h4>
              <p style={{ fontSize: "0.84rem", lineHeight: 1.75, color: "rgba(10,10,10,0.38)" }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ §5 COMO FUNCIONA ══ */}
      <section ref={s5.ref} style={{ borderTop: "1px solid rgba(10,10,10,0.07)", paddingTop: "clamp(56px,8vw,96px)", paddingBottom: "clamp(56px,8vw,96px)" }}>
        <div className="container-fbg">
          <FadeUp inView={s5.inView} delay={0}>
            <span className="type-eyebrow">Como Funciona</span>
            <h3 style={{ ...hn({ fontSize: "clamp(1.6rem,3.4vw,3rem)", color: "#0E0E0E" }), marginTop: "16px", marginBottom: "clamp(32px,5vw,56px)" }}>
              Três passos até seu primeiro pedido
            </h3>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "clamp(24px,3vw,40px)" }}>
            {PASSOS.map((p, i) => (
              <div key={p.num} style={{
                opacity: s5.inView ? 1 : 0,
                transform: s5.inView ? "none" : "translateY(20px)",
                transition: `opacity 0.7s ease ${i * 130}ms, transform 0.7s ease ${i * 130}ms`,
              }}>
                <span style={{
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 900, fontStyle: "italic", fontSize: "2.2rem",
                  letterSpacing: "-0.04em", color: "#A67C3D", display: "block", marginBottom: "16px",
                }}>{p.num}</span>
                <h4 style={{
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 900, fontStyle: "italic", fontSize: "1.1rem",
                  textTransform: "uppercase", letterSpacing: "-0.02em", color: "#0E0E0E", marginBottom: "10px",
                }}>{p.title}</h4>
                <p style={{ fontSize: "0.84rem", lineHeight: 1.75, color: "rgba(10,10,10,0.38)" }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ §6 FORMULÁRIO ══ */}
      <section id="formulario" ref={s6.ref} style={{
        borderTop: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(56px,8vw,96px)",
        paddingBottom: "clamp(64px,10vw,120px)",
      }}>
        <div className="container-fbg grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(40px,6vw,80px)" }}>
          <div>
            <FadeUp inView={s6.inView} delay={0}>
              <span className="type-eyebrow">Faça Parte</span>
            </FadeUp>
            <div style={{ marginTop: "clamp(16px,2.5vw,24px)" }}>
              <SplitChar text="VAMOS" delay={100} inView={s6.inView} style={hn({ fontSize: "clamp(2rem,4.5vw,3.6rem)", color: "#0E0E0E" })} />
              <SplitChar text="CONVERSAR?" delay={220} inView={s6.inView} style={hn({ fontSize: "clamp(2rem,4.5vw,3.6rem)", color: "#A67C3D" })} />
            </div>
            <FadeUp inView={s6.inView} delay={420}>
              <p style={{ fontSize: "0.86rem", lineHeight: 1.8, color: "rgba(10,10,10,0.38)", maxWidth: "360px", marginTop: "24px" }}>
                Preencha seus dados e nosso time entra em contato pelo WhatsApp
                em até 24h úteis com catálogo, tabela e condições.
              </p>
            </FadeUp>
          </div>

          <FadeUp inView={s6.inView} delay={300}>
            <RevendedorForm />
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Formulário ── */
function RevendedorForm() {
  const [nome, setNome] = useState("");
  const [loja, setLoja] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !whatsapp) return;
    const msg = `Olá! Quero ser revendedor FBG.\n\nNome: ${nome}\nLoja: ${loja || "não informado"}\nCidade/Estado: ${cidade || "não informado"}\nWhatsApp: ${whatsapp}`;
    navigator.clipboard.writeText(msg).catch(() => {});
    setSubmitted(true);
    window.open(WHATSAPP_BASE, "_blank");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(10,10,10,0.15)",
    color: "#0E0E0E",
    padding: "14px 16px",
    fontSize: "0.84rem",
    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.58rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(10,10,10,0.4)",
    marginBottom: "8px",
    display: "block",
  };

  if (submitted) {
    return (
      <div style={{ border: "1px solid rgba(166,124,61,0.3)", padding: "clamp(28px,4vw,40px)", textAlign: "center" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 16px" }}>
          <circle cx="12" cy="12" r="11" stroke="#A67C3D" strokeWidth="1.5" />
          <path d="M7 12.5l3 3 7-7" stroke="#A67C3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: "0.86rem", color: "#0E0E0E", marginBottom: "8px", fontWeight: 600 }}>
          Recebemos seus dados!
        </p>
        <p style={{ fontSize: "0.8rem", color: "rgba(10,10,10,0.4)", lineHeight: 1.7 }}>
          Copiamos seu resumo. Cole na conversa do WhatsApp que abrimos pra você. Nosso time responde em até 24h úteis.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={labelStyle}>Seu nome *</label>
        <input style={inputStyle} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" required />
      </div>
      <div>
        <label style={labelStyle}>Nome da loja</label>
        <input style={inputStyle} value={loja} onChange={(e) => setLoja(e.target.value)} placeholder="Sua loja ou marca" />
      </div>
      <div>
        <label style={labelStyle}>Cidade / Estado</label>
        <input style={inputStyle} value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Belo Horizonte, MG" />
      </div>
      <div>
        <label style={labelStyle}>WhatsApp *</label>
        <input style={inputStyle} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(31) 99999-9999" required />
      </div>

      <button
        type="submit"
        className="group relative inline-flex items-center justify-center gap-3 overflow-hidden"
        style={{ padding: "16px 36px", background: "#6B2033", marginTop: "8px" }}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" style={{ background: "#A67C3D" }} />
        <span className="relative text-[11px] font-black tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-200"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
          Enviar e Falar no WhatsApp
        </span>
        <span className="relative text-sm text-white group-hover:text-black group-hover:translate-x-1 transition-all duration-300">→</span>
      </button>
    </form>
  );
}
