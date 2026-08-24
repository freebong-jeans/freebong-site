"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════
   SPLIT-CHAR REVEAL
══════════════════════════════════════════════════════════ */
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

function RevealLine({
  children,
  delay = 0,
  inView,
}: {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
}) {
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          transform: inView ? "translateY(0)" : "translateY(105%)",
          transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FadeUp({
  children,
  delay = 0,
  inView,
}: {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
}) {
  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(16px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VELOCITY MARQUEE
══════════════════════════════════════════════════════════ */
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
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "12px 0",
        userSelect: "none",
      }}
    >
      <div ref={trackRef} style={{ display: "flex", width: "max-content", willChange: "transform" }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              whiteSpace: "nowrap",
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.4)",
              margin: "0 clamp(24px,4vw,48px)",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HELPER
══════════════════════════════════════════════════════════ */
const hn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
  letterSpacing: "-0.03em",
  lineHeight: 1.04,
  textTransform: "uppercase",
  ...extra,
});

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function OMovimento() {
  const s1 = useInView(0.1);
  const s2 = useInView(0.2);
  const s3 = useInView(0.1);
  const s5 = useInView(0.15);

  const anos    = useCounter(11,  s2.inView, 1300);
  const seguid  = useCounter(31,  s2.inView, 1500);
  const estados = useCounter(27,  s2.inView, 1200);
  const revend  = useCounter(200, s2.inView, 1700);

  const stats = [
    { value: anos,    suffix: "",   label: "Anos de mercado",      sub: "Desde 2013" },
    { value: seguid,  suffix: "K+", label: "Seguidores",           sub: "No Instagram" },
    { value: estados, suffix: "+",  label: "Estados com presença", sub: "Brasil" },
    { value: revend,  suffix: "+",  label: "Revendedores ativos",  sub: "Em todo o país" },
  ];

  const DISPLAY = "clamp(1.9rem,3.8vw,4rem)";

  return (
    <div className="overflow-x-hidden" style={{ background: "#FAF9F7", color: "#141414" }}>

      {/* ══════════════════════════════════════════════════
          §1  STATEMENT
      ══════════════════════════════════════════════════ */}
      <section
        ref={s1.ref}
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ borderTop: "1px solid rgba(0,0,0,0.08)", overflow: "hidden" }}
      >
        {/* Coluna texto */}
        <div
          className="container-fbg"
          style={{
            paddingTop: "clamp(56px,8vw,96px)",
            paddingBottom: "clamp(40px,5vw,64px)",
            maxWidth: "none",
          }}
        >
          <FadeUp inView={s1.inView} delay={0}>
            <span className="type-eyebrow">O Movimento</span>
          </FadeUp>

          <div style={{ marginTop: "clamp(20px,2.5vw,32px)" }}>
            <SplitChar
              text="A FBG NASCE DE"
              delay={60}
              inView={s1.inView}
              style={hn({ fontSize: DISPLAY, color: "#141414" })}
            />
            <SplitChar
              text="ALGO QUE NÃO"
              delay={160}
              inView={s1.inView}
              style={hn({
                fontSize: DISPLAY,
                WebkitTextStroke: "1.5px rgba(0,0,0,0.25)",
                color: "transparent",
                paddingLeft: "clamp(0.75rem,2vw,2.5rem)",
              })}
            />
            <SplitChar
              text="SE CRIA."
              delay={250}
              inView={s1.inView}
              style={hn({ fontSize: DISPLAY, color: "#141414" })}
            />
            <SplitChar
              text="SE CONSTRÓI."
              delay={340}
              inView={s1.inView}
              style={hn({
                fontSize: DISPLAY,
                color: "#B59672",
                paddingLeft: "clamp(0.75rem,3vw,4rem)",
              })}
            />
          </div>

          <div
            style={{
              marginTop: "clamp(32px,4vw,48px)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "24px",
            }}
          >
            <FadeUp inView={s1.inView} delay={560}>
              <p style={{ fontSize: "clamp(0.9rem,1.6vw,1.1rem)", lineHeight: 1.7, color: "rgba(0,0,0,0.6)", maxWidth: "380px" }}>
                FBG não é sobre seguir tendência. É sobre <strong style={{ color: "#141414" }}>construir padrão.</strong> Cada peça é feita para quem entende que estilo é identidade.
              </p>
            </FadeUp>

            <FadeUp inView={s1.inView} delay={640}>
              <Link
                href="/colecao"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "clamp(12px, 1.8vw, 16px) clamp(28px, 4vw, 48px)",
                  background: "linear-gradient(135deg, #B59672 0%, #8B6F47 100%)",
                  color: "#0E0E0E",
                  textDecoration: "none",
                  borderRadius: "3px",
                  fontWeight: 700,
                  fontSize: "clamp(0.75rem, 1.3vw, 0.9rem)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(181,150,114,0.25)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(181,150,114,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(181,150,114,0.25)";
                }}
              >
                Ver Coleção
                <span>→</span>
              </Link>
            </FadeUp>
          </div>
        </div>

        {/* Coluna imagem editorial */}
        <div
          className="hidden lg:block"
          style={{
            position: "relative",
            minHeight: "520px",
            opacity: s1.inView ? 1 : 0,
            transition: "opacity 1.2s ease 0.3s",
          }}
        >
          <Image
            src="/images/products/DSC00900.jpg"
            alt="FBG · editorial"
            fill
            sizes="50vw"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
          {/* gradiente esquerda para fundir com o fundo */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #FAF9F7 0%, rgba(250,249,247,0.6) 35%, transparent 70%)",
          }} />
          {/* gradiente topo e base */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #0E0E0E 0%, transparent 15%, transparent 85%, #0E0E0E 100%)",
          }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §2  MARQUEE
      ══════════════════════════════════════════════════ */}
      <section style={{ margin: "clamp(40px,6vw,80px) 0" }}>
        <VelocityMarquee />
      </section>

      {/* ══════════════════════════════════════════════════
          §3  STATS
      ══════════════════════════════════════════════════ */}
      <section
        ref={s2.ref}
        className="container-fbg"
        style={{
          paddingTop: "clamp(56px,8vw,96px)",
          paddingBottom: "clamp(56px,8vw,96px)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "clamp(40px,6vw,60px)" }}>
          <FadeUp inView={s2.inView} delay={0}>
            <span className="type-eyebrow">Números que falam</span>
          </FadeUp>
          <FadeUp inView={s2.inView} delay={80}>
            <h2 style={hn({ fontSize: "clamp(1.6rem,3.2vw,2.8rem)", color: "#141414", marginTop: "12px" })}>
              FBG em números
            </h2>
          </FadeUp>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 20vw, 200px), 1fr))",
            gap: "clamp(16px, 2.5vw, 32px)",
          }}
        >
          {stats.map((stat, i) => (
            <FadeUp key={i} inView={s2.inView} delay={140 + i * 120}>
              <div
                style={{
                  padding: "clamp(20px, 3vw, 32px)",
                  borderRadius: "6px",
                  background: "#F1EFEA",
                  border: "1px solid rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                    fontWeight: 900,
                    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                    color: "#141414",
                    lineHeight: 1.04,
                  }}
                >
                  {stat.value}
                  <span style={{ fontSize: "0.5em", color: "#B59672", marginLeft: "2px" }}>{stat.suffix}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.6)", margin: "0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: "0.7rem", color: "rgba(0,0,0,0.42)", margin: "0" }}>
                  {stat.sub}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §5  CTA
      ══════════════════════════════════════════════════ */}
      <section
        ref={s5.ref}
        style={{
          borderTop: "1px solid rgba(0,0,0,0.08)",
          paddingTop: "clamp(64px,10vw,120px)",
          paddingBottom: "clamp(64px,10vw,120px)",
        }}
      >
        <div className="container-fbg flex flex-col items-center text-center">
          <FadeUp inView={s5.inView} delay={0}>
            <span className="type-eyebrow">Faça Parte</span>
          </FadeUp>

          <div style={{ marginTop: "clamp(20px,2.5vw,32px)" }}>
            <SplitChar
              text="ORIGINAL COMO"
              delay={100}
              inView={s5.inView}
              style={hn({ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#141414" })}
            />
            <SplitChar
              text="QUEM VESTE."
              delay={200}
              inView={s5.inView}
              style={hn({
                fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                color: "#B59672",
              })}
            />
          </div>

          <FadeUp inView={s5.inView} delay={500}>
            <p style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)", lineHeight: 1.8, color: "rgba(0,0,0,0.6)", margin: "clamp(24px,3vw,40px) 0", maxWidth: "520px" }}>
              Mais de 31 mil pessoas já escolheram ser originais. A pergunta é: e você?
            </p>
          </FadeUp>

          <FadeUp inView={s5.inView} delay={620}>
            <Link
              href="/colecao"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "clamp(14px, 2vw, 18px) clamp(40px, 6vw, 64px)",
                background: "#0E0E0E",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "3px",
                fontWeight: 700,
                fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
              }}
            >
              Explorar Coleção
              <span>→</span>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
