"use client";

/**
 * StatementSection — manifesto da marca sobre foto de campanha.
 * Foto em parallax por trás, véu azul-noite por cima, tipografia
 * com respiro suficiente pra acentos (Ã, Ç, Ê) nunca colidirem.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const FONT = "'Helvetica Neue', Helvetica, sans-serif";

const PILARES = [
  { n: "01", label: "Produto",   sub: "Denim selecionado" },
  { n: "02", label: "Presença",  sub: "27 estados" },
  { n: "03", label: "Movimento", sub: "Desde 2013" },
  { n: "04", label: "Prova",     sub: "200+ lojas" },
];

export default function StatementSection() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* parallax da foto de fundo */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const t = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        setOffset(-t * 8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        padding: "clamp(88px, 13vw, 160px) 0",
        background: "#1E090F",
        color: "#fff",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* ── Foto de campanha ao fundo ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/images/campaign/dsc01536.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center 28%",
            transform: `scale(1.14) translateY(${offset}%)`,
            opacity: 0.3,
            willChange: "transform",
          }}
        />
        {/* véu azul-noite */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(107,32,51,0.88) 0%, rgba(107,32,51,0.6) 45%, rgba(22,7,12,0.95) 100%)" }} />
        {/* brilho dourado difuso */}
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "55%", height: "70%", background: "radial-gradient(circle, rgba(233,207,166,0.18) 0%, transparent 62%)", filter: "blur(30px)" }} />
        {/* grain */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "overlay",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "170px",
          }}
        />
      </div>

      <div className="container-fbg" style={{ position: "relative", zIndex: 1, padding: "0 clamp(20px, 4vw, 80px)" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#bda58e",
            fontFamily: FONT,
            opacity: shown ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          Nosso padrão
        </p>

        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 6.2vw, 6.4rem)",
            letterSpacing: "-0.045em",
            /* 1.02 dá espaço pro Ã/Ê sem soltar as linhas */
            lineHeight: 1.02,
            textTransform: "uppercase",
            margin: "clamp(22px, 3.5vh, 40px) 0 clamp(44px, 7vh, 76px)",
            maxWidth: "17ch",
            textWrap: "balance",
          }}
        >
          <Line shown={shown} delay={120}>Não é sobre</Line>
          <Line shown={shown} delay={230}>seguir tendência.</Line>
          <Line shown={shown} delay={340} color="#bda58e">É sobre construir</Line>
          <Line shown={shown} delay={450} color="#bda58e">padrão.</Line>
        </h2>

        {/* ── Pilares ── */}
        <div className="stmt-list">
          {PILARES.map((p, i) => (
            <div
              key={p.n}
              style={{
                paddingTop: "18px",
                borderTop: "1px solid rgba(255,255,255,0.18)",
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : "translateY(18px)",
                transition: `opacity 0.7s ease ${600 + i * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${600 + i * 90}ms`,
              }}
            >
              <span style={{ display: "block", fontFamily: FONT, fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.16em", color: "#bda58e", marginBottom: "8px" }}>
                {p.n}
              </span>
              <span style={{ display: "block", fontFamily: FONT, fontSize: "clamp(0.85rem,1.4vw,1rem)", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", marginBottom: "5px" }}>
                {p.label}
              </span>
              <span style={{ display: "block", fontFamily: FONT, fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>
                {p.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stmt-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px clamp(16px, 3vw, 32px);
        }
        @media (min-width: 720px) {
          .stmt-list { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </section>
  );
}

/* Linha com máscara — respira o suficiente pros acentos */
function Line({ children, shown, delay = 0, color }: { children: React.ReactNode; shown: boolean; delay?: number; color?: string }) {
  return (
    <span style={{ display: "block", overflow: "hidden", paddingTop: "0.1em", marginTop: "-0.1em" }}>
      <span
        style={{
          display: "block",
          color: color ?? "inherit",
          transform: shown ? "translateY(0)" : "translateY(108%)",
          transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          willChange: "transform",
        }}
      >
        {children}
      </span>
    </span>
  );
}
