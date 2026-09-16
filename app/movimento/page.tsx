"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

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
  /* Anima a LINHA inteira com máscara vertical.
     Nunca corta palavra nem espalha letra. */
  return (
    <span
      style={{
        display: "block",
        overflow: "hidden",
        paddingBottom: "0.1em",
        marginBottom: "-0.1em",
      }}
    >
      <span
        style={{
          display: "block",
          whiteSpace: "nowrap",
          transform: inView ? "translateY(0)" : "translateY(106%)",
          transition: `transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          willChange: "transform",
          ...style,
        }}
      >
        {text}
      </span>
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

/* ── Marquee ── */
const MARQUEE_ITEMS = [
  "FBG Jeans Wear",
  "Premium Since 2013",
  "Liberdade que se veste",
  "Original como quem veste",
  "Qualidade que se sente",
  "Construindo padrão",
];

function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const velRef = useRef(0);
  const lastYRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      velRef.current += (window.scrollY - lastYRef.current) * 0.28;
      lastYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => {
      velRef.current *= 0.9;
      xRef.current -= 0.7 + Math.abs(velRef.current) * 0.35;
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        if (Math.abs(xRef.current) >= half) xRef.current += half;
        track.style.transform = `translateX(${xRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{
      overflow: "hidden",
      borderTop: "1px solid rgba(10,10,10,0.05)",
      borderBottom: "1px solid rgba(10,10,10,0.05)",
      padding: "12px 0",
      userSelect: "none",
    }}>
      <div ref={trackRef} style={{ display: "flex", width: "max-content", willChange: "transform" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            whiteSpace: "nowrap",
            fontSize: "0.58rem",
            fontWeight: 700,
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "rgba(10,10,10,0.12)",
            padding: "0 1.6rem",
          }}>
            {item}
            <span style={{ color: "#B0864A", opacity: 0.4, margin: "0 0.6rem" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Pilares ── */
const PILARES = [
  {
    num: "01",
    title: "Liberdade",
    color: "#B0864A",
    image: "/images/products/DSC00877.jpg",
    body: "A asa não é apenas símbolo. É essência. A FBG nasceu do princípio de que moda não aprisiona. Ela liberta quem tem coragem de ser original.",
  },
  {
    num: "02",
    title: "Qualidade",
    color: "#6B2033",
    image: "/images/products/DSC01208.jpg",
    body: "Cada ponto, cada lavagem, cada detalhe tem razão de existir. Produto é prioridade. Estética e funcionalidade caminham juntas.",
  },
  {
    num: "03",
    title: "Identidade",
    color: "#0E0E0E",
    image: "/images/products/DSC01622.jpg",
    body: "Você não veste uma calça. Você veste uma declaração. A FBG é para quem entende que estilo é posicionamento.",
  },
];

function PilaresSection({ inView }: { inView: boolean }) {
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex" style={{
        height: "clamp(240px,28vw,360px)",
        gap: "1px",
        background: "rgba(10,10,10,0.05)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
      }}>
        {PILARES.map((p, i) => (
          <div
            key={p.num}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(0)}
            style={{
              flex: active === i ? "4 0 0" : "1 0 0",
              transition: "flex 0.7s cubic-bezier(0.16,1,0.3,1)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              background: "#FFFFFF",
              padding: "clamp(18px,2vw,28px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Foto de fundo */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center top",
                  opacity: active === i ? 0.45 : 0.1,
                  transition: "opacity 0.65s ease",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.35) 100%)",
              }} />
            </div>

            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: p.color,
              transform: `scaleX(${active === i ? 1 : 0})`,
              transformOrigin: "left",
              transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
              zIndex: 2,
            }} />
            <span style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900, fontStyle: "italic",
              fontSize: "clamp(1.6rem,2.2vw,2.2rem)",
              letterSpacing: "-0.04em", lineHeight: 1.04,
              WebkitTextStroke: `1px ${p.color}`,
              color: "transparent", flexShrink: 0, display: "block",
              position: "relative", zIndex: 1,
            }}>{p.num}</span>
            <span style={{
              position: "absolute", bottom: "clamp(18px,2vw,28px)", left: "50%",
              transform: "translateX(-50%) rotate(-90deg)",
              whiteSpace: "nowrap", fontSize: "0.58rem", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              color: "rgba(255,255,255,0.65)",
              opacity: active === i ? 0 : 1,
              transition: "opacity 0.2s ease",
              pointerEvents: "none",
              zIndex: 2,
            }}>{p.title}</span>
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end",
              opacity: active === i ? 1 : 0,
              transform: active === i ? "none" : "translateX(-10px)",
              transition: `opacity 0.3s ease ${active === i ? "0.25s" : "0s"}, transform 0.3s ease ${active === i ? "0.25s" : "0s"}`,
              pointerEvents: active === i ? "auto" : "none",
              position: "relative", zIndex: 1,
            }}>
              <h4 style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "clamp(0.95rem,1.4vw,1.25rem)", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1, color: "#FFFFFF", marginBottom: "12px" }}>{p.title}</h4>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "rgba(255,255,255,0.78)", maxWidth: "340px" }}>{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden" style={{
        gap: "1px", background: "rgba(10,10,10,0.05)",
        opacity: inView ? 1 : 0, transition: "opacity 0.7s ease",
      }}>
        {PILARES.map((p, i) => {
          const open = mobileOpen === i;
          return (
            <div key={p.num} onClick={() => setMobileOpen(open ? null : i)}
              style={{ background: "#FFFFFF", padding: "18px 20px", cursor: "pointer", position: "relative", overflow: "hidden" }}>
              {/* Foto de fundo mobile */}
              <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    opacity: open ? 0.35 : 0.08,
                    transition: "opacity 0.45s ease",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.5) 100%)",
                }} />
              </div>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: p.color, transform: `scaleX(${open ? 1 : 0})`,
                transformOrigin: "left", transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
                zIndex: 2,
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.4rem", letterSpacing: "-0.04em", WebkitTextStroke: `1px ${p.color}`, color: "transparent" }}>{p.num}</span>
                  <span style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: "#FFFFFF" }}>{p.title}</span>
                </div>
                <span style={{ fontSize: "1.2rem", color: p.color, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)", display: "inline-block", lineHeight: 1, fontWeight: 300 }}>+</span>
              </div>
              <div style={{ maxHeight: open ? "140px" : "0", overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)", position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.75, color: "rgba(255,255,255,0.78)", paddingTop: "12px" }}>{p.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Timeline ── */
const TIMELINE = [
  {
    year: "2013",
    title: "O Começo",
    body: "A FBG nasce em Minas Gerais com uma convicção: o mercado premium não pertence só às grandes marcas. Qualidade e identidade podem vir de quem realmente vive o produto.",
    color: "#B0864A",
  },
  {
    year: "2017",
    title: "Identidade de Marca",
    body: "A águia, símbolo de liberdade e visão, passa a integrar o DNA visual da FBG. Não é estética. É posicionamento: quem voa alto não olha para baixo.",
    color: "#0E0E0E",
  },
  {
    year: "2021",
    title: "Expansão Nacional",
    body: "A FBG cruza fronteiras estaduais. Revendedores em 27 estados. O jeans FBG deixa de ser regional para se tornar uma declaração nacional.",
    color: "#6B2033",
  },
  {
    year: "2026",
    title: "Rebranding + Digital",
    body: "Parceria com Baza Brands para consolidar a identidade visual. Novo site. Nova era. O mesmo propósito desde o início: construir padrão, não seguir tendência.",
    color: "#B0864A",
  },
];

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function MovimentoPage() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrollY, setScrollY]       = useState(0);
  const [muted, setMuted]           = useState(true);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  const s1 = useInView(0.1);
  const s2 = useInView(0.1);
  const s3 = useInView(0.1);
  const sTimeline = useInView(0.08);
  const s4 = useInView(0.08);
  const s5 = useInView(0.15);

  const anos    = useCounter(11,  s2.inView, 1300);
  const seguid  = useCounter(31,  s2.inView, 1500);
  const estados = useCounter(27,  s2.inView, 1200);
  const revend  = useCounter(200, s2.inView, 1700);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const DISPLAY = "clamp(2.2rem,4.8vw,4.6rem)";

  return (
    <div className="bg-[#FAF9F7] text-[#141414] overflow-x-hidden">

      {/* ══ HERO — vídeo fullscreen com parallax ══ */}
      <section ref={heroRef} style={{ position: "relative", height: "100svh", overflow: "hidden" }}>
        <video
          ref={videoRef}
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
          <source src="/videos/hero2.mp4" type="video/mp4" />
        </video>

        {/* Overlay escuro */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)",
          zIndex: 1,
        }} />

        {/* Conteúdo hero */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(40px,8vw,96px) clamp(20px,5vw,80px)",
        }}>
          <span className="type-eyebrow" style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "none" : "translateY(8px)",
            transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
            display: "block", marginBottom: "20px",
          }}>
            O Movimento · Desde 2013
          </span>

          <div style={{
            overflow: "hidden",
            opacity: heroLoaded ? 1 : 0,
            transition: "opacity 0.1s ease 0.8s",
          }}>
            <h1 style={hn({ fontSize: "clamp(3rem,9vw,8rem)", color: "#FFFFFF" })}>
              LIBERDADE
            </h1>
            <h1 style={hn({
              fontSize: "clamp(3rem,9vw,8rem)",
              WebkitTextStroke: "2px rgba(255,255,255,0.35)",
              color: "transparent",
              paddingLeft: "clamp(1rem,5vw,6rem)",
            })}>
              QUE SE VESTE.
            </h1>
          </div>

          <div style={{
            marginTop: "clamp(20px,2.5vw,32px)",
            display: "flex", alignItems: "center", gap: "24px",
            flexWrap: "wrap",
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "none" : "translateY(12px)",
            transition: "opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s",
          }}>
            <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "340px" }}>
              Premium Quality Since 2013. Uma marca. Um movimento. Uma identidade.
            </p>
            <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.15)" }} />
            <Link href="#manifesto" style={{
              fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#B0864A",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              textDecoration: "none",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              Descobrir
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "bounce-down 1.6s ease-in-out infinite" }}>
                <path d="M8 3v10M3 9l5 5 5-5" stroke="#B0864A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Botão mute/unmute */}
        <button
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Silenciar"}
          style={{
            position: "absolute",
            bottom: "clamp(28px,4vw,48px)",
            right: "clamp(20px,4vw,48px)",
            zIndex: 3,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: muted ? "rgba(255,255,255,0.45)" : "#B0864A",
            transition: "color 0.25s ease, border-color 0.25s ease, background 0.25s ease",
            opacity: heroLoaded ? 1 : 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.7)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.45)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
          }}
        >
          <span style={{ position: "relative", width: "16px", height: "16px", display: "flex" }}>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: muted ? 1 : 0, transition: "opacity 0.2s ease" }}>
              <SoundOffIcon />
            </span>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: muted ? 0 : 1, transition: "opacity 0.2s ease" }}>
              <SoundOnIcon />
            </span>
          </span>
        </button>

        {/* Bounce animation */}
        <style>{`
          @keyframes bounce-down {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
        `}</style>
      </section>

      {/* ══ §1 STATEMENT ══ */}
      <section
        id="manifesto"
        ref={s1.ref}
        className="container-fbg"
        style={{
          borderTop: "1px solid rgba(10,10,10,0.07)",
          paddingTop: "clamp(56px,8vw,96px)",
          paddingBottom: "clamp(40px,5vw,64px)",
        }}
      >
        <FadeUp inView={s1.inView} delay={0}>
          <span className="type-eyebrow">O Movimento</span>
        </FadeUp>

        <div style={{ marginTop: "clamp(20px,2.5vw,32px)" }}>
          <SplitChar text="A FBG NASCE DE" delay={60} inView={s1.inView}
            style={hn({ fontSize: DISPLAY, color: "#0E0E0E" })} />
          <SplitChar text="ALGO QUE NÃO" delay={160} inView={s1.inView}
            style={hn({ fontSize: DISPLAY, WebkitTextStroke: "1.5px rgba(10,10,10,0.35)", color: "transparent", paddingLeft: "clamp(1.5rem,4vw,5rem)" })} />
          <SplitChar text="SE CRIA." delay={250} inView={s1.inView}
            style={hn({ fontSize: DISPLAY, color: "#0E0E0E" })} />
          <SplitChar text="SE CONSTRÓI." delay={340} inView={s1.inView}
            style={hn({ fontSize: DISPLAY, color: "#B0864A", paddingLeft: "clamp(1.5rem,6vw,8rem)" })} />
        </div>

        <FadeUp inView={s1.inView} delay={560}>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(10,10,10,0.38)", maxWidth: "420px", marginTop: "clamp(24px,3vw,40px)" }}>
            Uma marca guiada por propósito, marcada por recomeços e sustentada
            por fé, visão e consistência. No DNA da FBG, liberdade é essência
            e evolução é caminho.
          </p>
        </FadeUp>
      </section>

      <VelocityMarquee />

      {/* ══ §2 NÚMEROS ══ */}
      <section ref={s2.ref} style={{ borderBottom: "1px solid rgba(10,10,10,0.07)" }}>
        <div className="container-fbg grid grid-cols-2 md:grid-cols-4"
          style={{ padding: "clamp(40px,6vw,72px) 1.5rem", gap: "clamp(24px,3vw,0px)" }}>
          {[
            { value: anos,    suffix: "",   label: "Anos de mercado",      sub: "Desde 2013" },
            { value: seguid,  suffix: "K+", label: "Seguidores",           sub: "No Instagram" },
            { value: estados, suffix: "+",  label: "Estados com presença", sub: "Brasil" },
            { value: revend,  suffix: "+",  label: "Revendedores ativos",  sub: "Em todo o país" },
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

      {/* ══ §3 MANIFESTO ══ */}
      <section ref={s3.ref} style={{ paddingTop: "clamp(56px,8vw,96px)", paddingBottom: "clamp(48px,7vw,80px)" }}>
        <div className="container-fbg">
          <FadeUp inView={s3.inView} delay={0}>
            <span className="type-eyebrow">Manifesto</span>
          </FadeUp>

          <div style={{ marginTop: "clamp(20px,2.5vw,32px)" }}>
            <SplitChar text="FBG NÃO É" delay={80} inView={s3.inView}
              style={hn({ fontSize: DISPLAY, color: "#0E0E0E" })} />
            <SplitChar text="SOBRE SEGUIR" delay={170} inView={s3.inView}
              style={hn({ fontSize: DISPLAY, WebkitTextStroke: "1.5px rgba(10,10,10,0.3)", color: "transparent", paddingLeft: "clamp(1.5rem,3vw,4rem)" })} />
            <SplitChar text="TENDÊNCIA." delay={260} inView={s3.inView}
              style={hn({ fontSize: DISPLAY, color: "#0E0E0E" })} />
          </div>

          <div style={{ width: "1px", height: "clamp(24px,3vw,36px)", background: "rgba(10,10,10,0.1)", margin: "clamp(20px,2.5vw,28px) 0 clamp(20px,2.5vw,28px) clamp(1.5rem,6vw,8rem)", opacity: s3.inView ? 1 : 0, transition: "opacity 0.6s ease 500ms" }} />

          <div style={{ paddingLeft: "clamp(1.5rem,6vw,8rem)" }}>
            <div style={{ overflow: "hidden" }}>
              <span style={{
                ...hn({ fontSize: DISPLAY, display: "inline-block" }),
                background: "linear-gradient(100deg, #0E0E0E 0%, #B0864A 55%, #6B2033 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                transform: s3.inView ? "translateY(0)" : "translateY(105%)",
                transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1) 450ms",
              }}>É SOBRE</span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <span style={{
                ...hn({ fontSize: DISPLAY, color: "#B0864A", display: "inline-block" }),
                transform: s3.inView ? "translateY(0)" : "translateY(105%)",
                transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1) 560ms",
              }}>CONSTRUIR PADRÃO.</span>
            </div>
          </div>

          <div style={{
            width: "36px", height: "2px",
            background: "linear-gradient(90deg,#B0864A,#6B2033)",
            marginTop: "clamp(28px,4vw,44px)",
            transformOrigin: "left",
            transform: s3.inView ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.7s ease 700ms",
          }} />
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section ref={sTimeline.ref} style={{
        borderTop: "1px solid rgba(10,10,10,0.07)",
        borderBottom: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(56px,8vw,96px)",
        paddingBottom: "clamp(56px,8vw,96px)",
      }}>
        <div className="container-fbg">
          <FadeUp inView={sTimeline.inView} delay={100}>
            <span className="type-eyebrow">Nossa Trajetória</span>
            <h3 style={{ ...hn({ fontSize: "clamp(1.5rem,3vw,2.6rem)", color: "#0E0E0E" }), marginTop: "16px" }}>
              De onde viemos
            </h3>
          </FadeUp>

          <div style={{ marginTop: "clamp(40px,6vw,72px)", position: "relative" }}>
            {/* Linha vertical */}
            <div style={{
              position: "absolute",
              left: "clamp(44px,6vw,80px)",
              top: 0, bottom: 0, width: "1px",
              background: "rgba(10,10,10,0.06)",
              display: "none",
            }} className="md:block" />

            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(32px,5vw,60px)" }}>
              {TIMELINE.map((item, i) => (
                <TimelineItem key={item.year} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ §4 PILARES ══ */}
      <section ref={s4.ref} style={{
        borderBottom: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(48px,7vw,80px)",
        paddingBottom: "clamp(48px,7vw,80px)",
      }}>
        <div className="container-fbg" style={{ marginBottom: "clamp(24px,3.5vw,40px)" }}>
          <FadeUp inView={s4.inView} delay={0}>
            <span className="type-eyebrow">Os Pilares</span>
          </FadeUp>
          <FadeUp inView={s4.inView} delay={80}>
            <h3 style={{ ...hn({ fontSize: "clamp(1.5rem,3vw,2.6rem)", color: "#0E0E0E" }), marginTop: "16px" }}>
              O que nos define
            </h3>
          </FadeUp>
        </div>
        <div className="container-fbg">
          <PilaresSection inView={s4.inView} />
        </div>
      </section>

      {/* ══ §5 CTA FINAL ══ */}
      <section ref={s5.ref} style={{
        paddingTop: "clamp(64px,10vw,120px)",
        paddingBottom: "clamp(64px,10vw,120px)",
      }}>
        <div className="container-fbg flex flex-col items-center text-center">
          <FadeUp inView={s5.inView} delay={0}>
            <span className="type-eyebrow">Faça Parte</span>
          </FadeUp>

          <div style={{ marginTop: "clamp(20px,2.5vw,32px)" }}>
            <SplitChar text="ORIGINAL COMO" delay={100} inView={s5.inView}
              style={hn({ fontSize: "clamp(2rem,5vw,4.8rem)", color: "#0E0E0E", textAlign: "center" })} />
            <SplitChar text="QUEM VESTE." delay={260} inView={s5.inView}
              style={hn({ fontSize: "clamp(2rem,5vw,4.8rem)", color: "#B0864A", textAlign: "center" })} />
          </div>

          <FadeUp inView={s5.inView} delay={520}>
            <p style={{ marginTop: "20px", fontSize: "0.86rem", color: "rgba(10,10,10,0.35)", maxWidth: "320px", lineHeight: 1.8 }}>
              Mais de 31 mil pessoas já escolheram ser originais.
              <br />A pergunta é: e você?
            </p>
          </FadeUp>

          <FadeUp inView={s5.inView} delay={620}>
            <div className="flex flex-col sm:flex-row gap-3" style={{ marginTop: "32px" }}>
              <Link
                href="/colecao"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden"
                style={{ padding: "15px 36px", background: "#6B2033" }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" style={{ background: "#B0864A" }} />
                <span className="relative text-[11px] font-black tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-200"
                  style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                  Explorar Coleção
                </span>
                <span className="relative text-sm text-white group-hover:text-black group-hover:translate-x-1 transition-all duration-300">→</span>
              </Link>
              <a
                href="https://wa.me/message/3ROGXK7TIP7TC1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center hover:text-white transition-all duration-300"
                style={{
                  padding: "15px 32px",
                  border: "1px solid rgba(10,10,10,0.12)",
                  color: "rgba(10,10,10,0.4)",
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em",
                  textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  textDecoration: "none",
                }}
              >
                Falar no WhatsApp
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Ícones de som ────────────────────────────────────────── */
function SoundOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function SoundOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/* ── Timeline Item com animação própria ── */
function TimelineItem({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const { ref, inView } = useInView(0.2);
  return (
    <div ref={ref} style={{
      display: "grid",
      gridTemplateColumns: "clamp(64px,8vw,100px) 1fr",
      gap: "clamp(20px,3vw,40px)",
      alignItems: "start",
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(20px)",
      transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms`,
    }}>
      {/* Ano */}
      <div style={{ textAlign: "right", paddingTop: "2px", paddingRight: "clamp(12px,2vw,24px)", position: "relative" }}>
        <span style={{
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontWeight: 900, fontStyle: "italic",
          fontSize: "clamp(0.9rem,1.4vw,1.1rem)",
          color: item.color, letterSpacing: "-0.02em",
        }}>{item.year}</span>
        {/* Ponto na linha */}
        <div style={{
          position: "absolute", right: "-5px", top: "6px",
          width: "9px", height: "9px", borderRadius: "50%",
          background: item.color, border: "2px solid #FFFFFF",
        }} />
      </div>
      {/* Conteúdo */}
      <div style={{ paddingBottom: "clamp(20px,3vw,40px)", borderBottom: "1px solid rgba(10,10,10,0.05)" }}>
        <h4 style={{
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontWeight: 900, fontStyle: "italic", fontSize: "clamp(1rem,1.6vw,1.3rem)",
          textTransform: "uppercase", letterSpacing: "-0.02em", color: "#0E0E0E", marginBottom: "10px",
        }}>{item.title}</h4>
        <p style={{ fontSize: "0.84rem", lineHeight: 1.75, color: "rgba(10,10,10,0.38)", maxWidth: "520px" }}>{item.body}</p>
      </div>
    </div>
  );
}
