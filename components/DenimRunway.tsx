"use client";

/**
 * DenimRunway v4 — BARALHO DE LOOKS 3D
 * Pilha de cards em perspectiva: você VÊ os próximos looks atrás.
 * Scroll/swipe: o card da frente sai girando para a esquerda,
 * o próximo avança para o centro. Legível, curto, sem tela preta —
 * todas as fotos ficam montadas e carregadas o tempo todo.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* Looks do desfile — fotos 4K do ensaio oficial (pasta Fotos/),
   mapeadas por peça. Processadas para web em /images/campaign. */
const RUNWAY_PHOTOS: string[] = [
  "/images/campaign/dsc01659.jpg",
  "/images/campaign/dsc01573.jpg",
  "/images/campaign/dsc01595.jpg",
  "/images/campaign/dsc01582.jpg",
  "/images/campaign/dsc01675.jpg",
  "/images/campaign/dsc01468.jpg",
];

/* vh de scroll por troca de card */
const STEP_VH = 60;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* Keyframes do baralho por profundidade d (posição relativa ao centro):
   d = -1 saiu · 0 frente · 1 atrás · 2 fundo */
const KEYS = [
  { d: -1, x: -118, z: 80,   ry: 24,  s: 1.06, b: 1,    o: 0 },
  { d: 0,  x: 0,    z: 0,    ry: 0,   s: 1,    b: 1,    o: 1 },
  { d: 1,  x: 12,   z: -110, ry: -9,  s: 0.9,  b: 0.5,  o: 1 },
  { d: 2,  x: 22,   z: -220, ry: -13, s: 0.8,  b: 0.28, o: 0.55 },
];

function deckStyle(d: number) {
  const dd = clamp(d, -1, 2);
  let a = KEYS[0], b = KEYS[1];
  for (let k = 0; k < KEYS.length - 1; k++) {
    if (dd >= KEYS[k].d && dd <= KEYS[k + 1].d) { a = KEYS[k]; b = KEYS[k + 1]; break; }
  }
  const t = (dd - a.d) / (b.d - a.d);
  const L = (p: number, q: number) => p + (q - p) * t;
  return {
    x: L(a.x, b.x),
    z: L(a.z, b.z),
    ry: L(a.ry, b.ry),
    s: L(a.s, b.s),
    bright: L(a.b, b.b),
    o: L(a.o, b.o),
  };
}

export default function DenimRunway() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [mobileIdx, setMobileIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0 });

  /* Lookbook: as fotos do ensaio sao da marca e mostram o look inteiro
     (jaqueta + calca, por exemplo). Por isso o card nao anuncia uma peca
     especifica - anunciar levava a rotular uma foto de jaqueta como
     "Calca Cargo". Quem quiser comprar segue para a colecao. */
  const items = RUNWAY_PHOTOS.map((src, i) => ({
    id: `look-${i + 1}`,
    numero: String(i + 1).padStart(2, "0"),
    runwayImg: { src },
    alt: `Look ${i + 1} da coleção FBG Junho 2026`,
  }));
  const n = items.length;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setReduced(true));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        if (total <= 0) return;
        setProgress(clamp(-r.top / total, 0, 1));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchRef.current.startX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchRef.current.startY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 48 && Math.abs(dx) > dy * 1.4) {
      if (dx > 0) setMobileIdx(i => Math.min(n - 1, i + 1));
      else setMobileIdx(i => Math.max(0, i - 1));
    }
  };

  /* p contínuo 0 → n-1, com plateau em cada card */
  const pRaw = progress * (n - 1);
  const base = clamp(Math.floor(pRaw), 0, n - 1);
  const tt = smooth(clamp((pRaw - base - 0.22) / 0.56, 0, 1));
  const p = base + tt;
  const textIdx = clamp(Math.round(p), 0, n - 1);
  const current = items[textIdx];

  if (!current) return null;


  /* ── Mobile carousel ── */
  if (isMobile && !reduced) {
    const mc = items[mobileIdx];
    if (!mc) return null;
    return (
      <section
        style={{ background: "#F5F5F3" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Foto */}
        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
          {mc.runwayImg && (
            <Image
              src={mc.runwayImg.src}
              alt={mc.alt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 28%", transition: "opacity 0.45s ease" }}
            />
          )}
          <div style={{ position: "absolute", inset: "45% 0 0", background: "linear-gradient(transparent, #F5F5F3 95%)", pointerEvents: "none" }} />
          <span
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#A67C3D",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              padding: "5px 9px",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            LOOK {String(mobileIdx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
        </div>

        {/* Info */}
        <div
          key={mobileIdx}
          style={{
            padding: "24px clamp(20px, 5vw, 36px) 40px",
            textAlign: "center",
            animation: "rwTextIn 0.42s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#A67C3D",
              marginBottom: "8px",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            Jeans Collection · Junho 2026
          </span>
          <h3
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.7rem, 7.5vw, 2.6rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              textTransform: "uppercase",
              color: "#141414",
              margin: "0 0 16px",
            }}
          >
            Look {mc.numero}
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
            <Link
              href="/colecao"
              style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#141414",
                textDecoration: "none",
                borderBottom: "1.5px solid rgba(166,124,61,0.6)",
                paddingBottom: "2px",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              }}
            >
              Ver coleção
            </Link>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "14px" }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIdx(i)}
                aria-label={`Look ${i + 1}`}
                style={{
                  width: i === mobileIdx ? "20px" : "6px",
                  height: "3px",
                  borderRadius: "2px",
                  background: i === mobileIdx ? "#A67C3D" : "rgba(0,0,0,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: "0.48rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.28)",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            Deslize para ver mais looks
          </span>
        </div>
        <style>{`
          @keyframes rwTextIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: none; }
          }
        `}</style>
      </section>
    );
  }

  /* Fallback estático (reduced motion) */
  if (reduced) {
    return (
      <section style={{ background: "#F5F5F3", padding: "clamp(48px,8vw,96px) 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}><Eyebrow /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "14px", maxWidth: "1100px", margin: "0 auto" }}>
          {items.map(pd => (
            <Link key={pd.id} href="/colecao" style={{ textDecoration: "none" }}>
              <div style={{ position: "relative", aspectRatio: "3/4" }}>
                <Image src={pd.runwayImg.src} alt={pd.alt} fill style={{ objectFit: "cover" }} sizes="25vw" />
              </div>
              <p style={{ color: "#141414", fontSize: "0.75rem", fontWeight: 700, marginTop: "8px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>Look {pd.numero}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Looks da coleção"
      style={{ height: `${100 + (n - 1) * STEP_VH}vh`, background: "#F5F5F3", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "radial-gradient(ellipse 90% 70% at 50% 42%, #EDECEA 0%, #F5F5F3 68%)",
        }}
      >
        {/* Grain — textura de filme, muito sutil */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.05,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "160px",
            zIndex: 5,
          }}
        />

        {/* Número gigante do look — fundo, atrás do baralho */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <span
            key={textIdx}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(16rem, 52vw, 46rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.06em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(166,124,61,0.1)",
              userSelect: "none",
              animation: "rwNumIn 0.8s cubic-bezier(0.16,1,0.3,1)",
              transform: "translateY(-4vh)",
            }}
          >
            {String(textIdx + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Glow dourado atrás do baralho */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            transform: "translate(-50%, -50%)",
            width: "min(80vw, 60vh)",
            height: "min(80vw, 60vh)",
            background: "radial-gradient(circle, rgba(166,124,61,0.09) 0%, transparent 62%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
          className="rw-glow"
        />

        {/* Cabeçalho */}
        <div style={{ position: "absolute", top: "clamp(18px, 3.5vh, 40px)", left: 0, right: 0, textAlign: "center", zIndex: 40, pointerEvents: "none" }}>
          <Eyebrow />
        </div>

        {/* ── Baralho 3D ── */}
        <div className="rw-stage">
          <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
            {items.map((pd, i) => {
              const img = pd.runwayImg;
              if (!img) return null;
              const d = i - p;
              if (d < -1.05 || d > 2.4) return null;
              const st = deckStyle(d);
              const isFront = Math.abs(d) < 0.4;

              return (
                <div
                  key={pd.id}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateX(${st.x}%) translateZ(${st.z}px) rotateY(${st.ry}deg) scale(${st.s})`,
                    opacity: st.o,
                    zIndex: 30 - i,
                    willChange: "transform, opacity",
                    pointerEvents: isFront ? "auto" : "none",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      border: "1px solid rgba(10,10,10,0.1)",
                      borderTop: isFront ? "2px solid rgba(166,124,61,0.7)" : "1px solid rgba(10,10,10,0.1)",
                      boxShadow: isFront
                        ? "0 40px 90px -25px rgba(0,0,0,0.9), 0 0 60px -20px rgba(166,124,61,0.25)"
                        : "0 40px 90px -25px rgba(0,0,0,0.9)",
                      background: "#FFFFFF",
                      transition: "border-top-color 0.4s ease, box-shadow 0.4s ease",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={pd.alt}
                      fill
                      sizes="(max-width: 900px) 76vw, 32vw"
                      priority
                      style={{
                        objectFit: "cover",
                        objectPosition: "center 28%",
                        filter: `brightness(${st.bright})`,
                        willChange: "filter",
                      }}
                    />
                    {/* etiqueta look (só no card da frente) */}
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        color: "#A67C3D",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        padding: "5px 9px",
                        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                        opacity: isFront ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      LOOK {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Reflexo do look no chão ── */}
        <div className="rw-reflection" aria-hidden key={`refl-${textIdx}`}>
          {current.runwayImg && (
            <Image
              src={current.runwayImg.src}
              alt=""
              fill
              sizes="30vw"
              style={{
                objectFit: "cover",
                objectPosition: "center bottom",
                transform: "scaleY(-1)",
              }}
            />
          )}
        </div>

        {/* ── Texto do look atual ── */}
        <div className="rw-text">
          <div key={textIdx} style={{ animation: "rwTextIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.56rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#A67C3D",
                marginBottom: "8px",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              }}
            >
              Jeans Collection · Junho 2026
            </span>
            <h3
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.3rem, 3.2vw, 2.6rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: "#141414",
                margin: 0,
              }}
            >
              Look {current.numero}
            </h3>
            <p
              className="rw-blurb"
              style={{
                fontSize: "0.82rem",
                lineHeight: 1.65,
                color: "rgba(0,0,0,0.55)",
                margin: "12px 0 0",
                maxWidth: "420px",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              }}
            >
              Denim premium, desde 2013.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "14px", flexWrap: "wrap" }} className="rw-cta-row">
              <Link
                href="/colecao"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 20px",
                  background: "#6B2033",
                  color: "#FFFFFF",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                }}
              >
                Ver coleção
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Progresso ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(12px, 3vw, 36px)",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            zIndex: 40,
          }}
        >
          {items.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === textIdx ? "3px" : "2px",
                height: i === textIdx ? "22px" : "8px",
                background: i === textIdx ? "#A67C3D" : "rgba(0,0,0,0.2)",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>

        {/* ── Hint ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "clamp(12px, 3vh, 28px)",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            zIndex: 40,
            opacity: progress > 0.1 ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.4)",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            Deslize para trocar o look
          </span>
          <span style={{ display: "block", width: "1px", height: "22px", background: "linear-gradient(180deg, #A67C3D, transparent)", animation: "rwHint 1.6s ease-in-out infinite" }} />
        </div>

        <style>{`
          @keyframes rwTextIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes rwNumIn {
            from { opacity: 0; transform: translateY(-2vh) scale(0.97); }
            to   { opacity: 1; transform: translateY(-4vh) scale(1); }
          }
          @keyframes rwHint {
            0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
            50%      { transform: scaleY(1); opacity: 1; }
          }
          .rw-stage {
            --rw-w: min(72vw, 42vh);
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            width: var(--rw-w);
            aspect-ratio: 3/4;
            perspective: 1200px;
            z-index: 10;
          }
          .rw-reflection {
            --rw-w: min(72vw, 42vh);
            position: absolute;
            left: 50%;
            top: calc(40% + var(--rw-w) * 2 / 3 + 6px);
            transform: translateX(-50%);
            width: var(--rw-w);
            height: calc(var(--rw-w) * 0.3);
            overflow: hidden;
            opacity: 0.14;
            filter: blur(1.5px);
            z-index: 3;
            pointer-events: none;
            -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0.8), transparent 85%);
            mask-image: linear-gradient(180deg, rgba(0,0,0,0.8), transparent 85%);
            animation: rwTextIn 0.6s ease;
          }
          .rw-blurb { display: none; }
          .rw-text {
            position: absolute;
            left: 0;
            right: 0;
            bottom: clamp(36px, 7vh, 80px);
            padding: 0 clamp(20px, 6vw, 60px);
            text-align: center;
            z-index: 20;
          }
          @media (min-width: 900px) {
            .rw-stage, .rw-reflection {
              --rw-w: min(29vw, 58vh);
            }
            .rw-stage {
              left: 37%;
              top: 47%;
            }
            .rw-reflection {
              left: 37%;
              top: calc(47% + var(--rw-w) * 2 / 3 + 8px);
            }
            .rw-blurb { display: block; }
            .rw-text {
              left: 57%;
              right: 6vw;
              bottom: auto;
              top: 50%;
              transform: translateY(-50%);
              text-align: left;
              padding: 0;
            }
            .rw-text .rw-cta-row { justify-content: flex-start; }
            .rw-text .rw-blurb { margin-left: 0; }
          }
          @media (max-width: 899px) {
            .rw-text .rw-blurb { margin-left: auto; margin-right: auto; }
          }
        `}</style>
      </div>
    </section>
  );
}

function Eyebrow() {
  return (
    <span
      style={{
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        color: "#A67C3D",
        display: "block",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      Jeans Collection · Junho 2026
    </span>
  );
}
