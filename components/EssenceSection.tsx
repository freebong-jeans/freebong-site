"use client";

/**
 * EssenceSection — os três valores da marca.
 * Cada palavra revela a foto de campanha por dentro das letras
 * quando entra na viewport (background-clip: text). Efeito editorial
 * forte, sem poluir: só tipografia e imagem.
 */

import { useEffect, useRef, useState } from "react";

const FONT = "'Helvetica Neue', Helvetica, sans-serif";

const WORDS = [
  { text: "Liberdade", img: "/images/campaign/dsc01659.jpg" },
  { text: "Movimento", img: "/images/campaign/dsc01573.jpg" },
  { text: "Ambição",   img: "/images/campaign/dsc01662.jpg" },
];

export default function EssenceSection() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(80px, 12vw, 160px) 0",
        background: "#FFFFFF",
        borderBottom: "1px solid rgba(10,10,10,0.07)",
        overflow: "hidden",
      }}
    >
      <div className="container-fbg" style={{ padding: "0 clamp(20px, 4vw, 80px)" }}>
        <p
          style={{
            margin: "0 0 clamp(24px, 4vh, 44px)",
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#B0864A",
            fontFamily: FONT,
            opacity: shown ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          Essência da marca
        </p>

        <div aria-label="Liberdade, Movimento e Ambição">
          {WORDS.map((w, i) => (
            <div
              key={w.text}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: "block",
                overflow: "hidden",
                /* respiro pros acentos Ç/Ã não colidirem entre linhas */
                paddingTop: "0.07em",
                paddingBottom: "0.06em",
                cursor: "default",
              }}
            >
              <span
                className="fbg-essence-word"
                style={{
                  display: "block",
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "clamp(2.8rem, 9vw, 9rem)",
                  letterSpacing: "-0.055em",
                  lineHeight: 1.0,
                  textTransform: "uppercase",
                  userSelect: "none",
                  /* foto revelada dentro das letras */
                  backgroundImage: `url(${w.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: hover === i ? "center 30%" : "center 45%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  /* cor sólida por baixo enquanto a foto não domina */
                  color: i === 1 ? "#B0864A" : "#141414",
                  filter: hover === i ? "none" : "grayscale(1) contrast(1.15) brightness(0.72)",
                  opacity: hover === i ? 1 : 0.94,
                  transform: shown ? "translateY(0)" : "translateY(108%)",
                  transition: `transform 0.95s cubic-bezier(0.16,1,0.3,1) ${i * 130}ms, background-position 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease, opacity 0.5s ease`,
                  willChange: "transform",
                }}
              >
                {w.text}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(24px, 5vw, 80px)",
            marginTop: "clamp(36px, 5vh, 72px)",
            paddingTop: "clamp(18px, 2.5vh, 30px)",
            borderTop: "1px solid rgba(10,10,10,0.1)",
            alignItems: "start",
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s",
          }}
        >
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(10,10,10,0.35)",
              fontFamily: FONT,
              whiteSpace: "nowrap",
              paddingTop: "4px",
            }}
          >
            2013 / 2026
          </span>
          <p
            style={{
              maxWidth: "600px",
              margin: 0,
              color: "rgba(10,10,10,0.5)",
              lineHeight: 1.8,
              fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
              fontFamily: FONT,
              textWrap: "pretty",
            }}
          >
            Liberdade para escolher o próprio caminho. Movimento para acompanhar a
            vida real. Ambição para construir um novo padrão de jeans.
          </p>
        </div>
      </div>

      <style>{`
        /* fallback: navegador sem background-clip volta pra cor sólida */
        @supports not (-webkit-background-clip: text) {
          .fbg-essence-word {
            -webkit-text-fill-color: currentColor !important;
            background-image: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}
