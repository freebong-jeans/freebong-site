"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/lib/hooks/useProducts";
import DenimWaves from "@/components/DenimWaves";
import Magnetic from "@/components/Magnetic";

/* Destaques curados — mix de linhas do catálogo Junho 2026 */
/* A vitrine da home mostra pecas reais da loja. Antes vinha de uma lista
   fixa de handles no codigo: os cards levavam para paginas de produto que
   nao existem mais na Shopify. */

export default function Hero() {
  const { products } = useProducts();
  const FEATURED = products.filter((p) => p.images.length > 0).slice(0, 6);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  // Fallback: garante que o conteúdo do hero aparece mesmo se o vídeo demorar/falhar
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // iOS Safari: muted via JS property + webkit attr são obrigatórios
    v.muted = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const tryPlay = () => { if (v.paused) v.play().catch(() => {}); };

    // Tenta imediatamente e em cada evento de carregamento
    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay, { once: true });
    v.addEventListener("loadeddata",     tryPlay, { once: true });
    v.addEventListener("canplay",        tryPlay, { once: true });

    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("loadeddata",     tryPlay);
      v.removeEventListener("canplay",        tryPlay);
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO — LIMPO, PROFISSIONAL, SEM IA
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden bg-black">

        {/* Vídeo — estático, travado no topo (sem parallax) */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/videos/hero-home.mp4"
            poster="/videos/hero-home-poster.jpg"
            autoPlay muted loop playsInline preload="metadata"
            onCanPlay={() => setReady(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.84) saturate(0.88)" }}
          />
        </div>

        {/* Overlay — Dark, Clean */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Denim vivo — tecido 3D reagindo ao mouse (desktop) */}
        <DenimWaves opacity={0.34} />

        {/* Grain — muito sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px",
          }}
        />

        {/* ── Conteúdo do hero — headline + CTAs ─────────────── */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-end"
          style={{ padding: "clamp(40px,8vw,96px) clamp(20px,5vw,80px)" }}
        >
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#B59672",
              marginBottom: "18px",
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(10px)",
              transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            Freebong® · Jeans Premium · Est. 2013
          </span>

          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.6rem, 8vw, 6.8rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
              maxWidth: "14ch",
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(24px)",
              transition: "opacity 0.9s ease 0.6s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s",
            }}
          >
            Liberdade que{" "}
            <span style={{ color: "#B59672" }}>se veste.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.6)",
              maxWidth: "440px",
              margin: "clamp(16px,2vw,24px) 0 clamp(24px,3vw,36px)",
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(16px)",
              transition: "opacity 0.9s ease 0.85s, transform 0.9s ease 0.85s",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            Jeans premium e streetwear pra quem veste identidade.
            Varejo, atacado e revenda em todo o Brasil.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(14px)",
              transition: "opacity 0.9s ease 1.05s, transform 0.9s ease 1.05s",
            }}
          >
            <Magnetic>
              <Link
                href="/colecao"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px clamp(28px,4vw,48px)",
                  background: "#fff",
                  color: "#0A0A0A",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  transition: "background 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#B59672";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fff";
                }}
              >
                Explorar coleção
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/revendedores"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px clamp(28px,4vw,48px)",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "#fff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  transition: "border-color 0.25s ease, background 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#B59672";
                  el.style.background = "rgba(181,150,114,0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.35)";
                  el.style.background = "transparent";
                }}
              >
                Seja revendedor
              </Link>
            </Magnetic>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUTOS — MOBILE-FIRST
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <style>{`
          .hro-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 0 12px;
          }
          @media (min-width: 768px) {
            .hro-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: clamp(12px, 2vw, 24px);
              padding: 0 clamp(24px, 5vw, 72px);
            }
          }
          .hro-info {
            padding: 10px 10px 12px;
          }
          @media (min-width: 768px) {
            .hro-info {
              padding: 14px 14px 18px;
            }
          }
          .hro-title {
            font-family: 'Helvetica Neue', Helvetica, sans-serif;
            font-size: 0.8rem;
            font-weight: 700;
            color: #111111;
            letter-spacing: -0.01em;
            line-height: 1.25;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            white-space: normal;
          }
          @media (min-width: 768px) {
            .hro-title {
              font-size: 0.88rem;
              white-space: nowrap;
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .hro-parcel {
            display: none;
          }
          @media (min-width: 420px) {
            .hro-parcel {
              display: block;
              font-size: 0.58rem;
              font-weight: 600;
              color: #B59672;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              font-family: 'Helvetica Neue', Helvetica, sans-serif;
            }
          }
          .hro-cta-wrap {
            padding: 28px 12px 40px;
            text-align: center;
          }
          @media (min-width: 768px) {
            .hro-cta-wrap {
              padding: clamp(40px,6vw,64px) 20px;
            }
          }
          .hro-cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 16px 20px;
            background: #111111;
            color: #FFFFFF;
            border-radius: 100px;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            text-decoration: none;
            font-family: 'Helvetica Neue', Helvetica, sans-serif;
            transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
            width: 100%;
          }
          @media (min-width: 480px) {
            .hro-cta-btn {
              width: auto;
              display: inline-flex;
              padding: 17px clamp(40px, 6vw, 72px);
            }
          }
          .hro-cta-btn:hover {
            background: #B59672;
            color: #111111;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(181,150,114,0.35);
          }
          .hro-header {
            max-width: 1440px;
            margin: 0 auto;
            padding: clamp(32px,6vw,88px) 12px clamp(20px,3vw,40px);
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          @media (min-width: 768px) {
            .hro-header {
              padding: clamp(48px,7vw,88px) clamp(24px,5vw,72px) clamp(32px,4vw,48px);
            }
          }
          .hro-grid-wrap {
            max-width: 1440px;
            margin: 0 auto;
          }
        `}</style>

        {/* ── Header editorial ── */}
        <div className="hro-header">
          <div>
            <span style={{
              display: "block",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#B59672",
              marginBottom: "8px",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}>
              Temporada 2026
            </span>
            <h2 style={{
              fontSize: "clamp(1.6rem,4vw,3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#111111",
              lineHeight: 1.04,
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              margin: 0,
            }}>
              DESTAQUES
            </h2>
          </div>
          <Link
            href="/colecao"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#111111",
              textDecoration: "none",
              paddingBottom: "3px",
              borderBottom: "1.5px solid rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              flexShrink: 0,
            }}
          >
            Ver tudo →
          </Link>
        </div>

        {/* ── Grid ── */}
        <div className="hro-grid-wrap">
          <div className="hro-grid">
            {FEATURED.map((product) => {
              const img = product.images[0];
              const price = parseFloat(product.variants[0]?.price ?? "0").toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
              const isPremium = product.variants.some((v) => v.available);
              const line = isPremium ? "Pronta Entrega" : "Sob consulta";

              return (
                <Link
                  key={product.id}
                  href={`/produtos/${product.handle}`}
                  style={{ textDecoration: "none", display: "block", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.09)", borderRadius: "4px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    const imgEl = el.querySelector(".prod-img") as HTMLElement;
                    const overlay = el.querySelector(".prod-overlay") as HTMLElement;
                    if (imgEl) imgEl.style.transform = "scale(1.06)";
                    if (overlay) overlay.style.opacity = "1";
                    el.style.borderColor = "rgba(181,150,114,0.4)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    const imgEl = el.querySelector(".prod-img") as HTMLElement;
                    const overlay = el.querySelector(".prod-overlay") as HTMLElement;
                    if (imgEl) imgEl.style.transform = "scale(1)";
                    if (overlay) overlay.style.opacity = "0";
                    el.style.borderColor = "rgba(0,0,0,0.09)";
                    el.style.transform = "translateY(0)";
                  }}
                  className="transition-all duration-300"
                >
                  {/* ── Imagem ── */}
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#F2F0ED" }}>
                    {img && (
                      <Image
                        src={img.src}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="prod-img"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center top",
                          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                        }}
                      />
                    )}

                    {/* Badge */}
                    <span style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: isPremium ? "#0A0A0A" : "rgba(255,255,255,0.92)",
                      color: isPremium ? "#fff" : "#0A0A0A",
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: "100px",
                      fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }}>
                      {line}
                    </span>

                    {/* Overlay hover */}
                    <div
                      className="prod-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingBottom: "16px",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <span style={{
                        background: "#fff",
                        color: "#0A0A0A",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "8px 20px",
                        borderRadius: "100px",
                        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                      }}>
                        Ver produto
                      </span>
                    </div>
                  </div>

                  {/* ── Info ── */}
                  <div className="hro-info">
                    <p style={{
                      fontSize: "0.62rem",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.42)",
                      marginBottom: "3px",
                      fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      FBG Jeans Wear
                    </p>
                    <p className="hro-title">
                      {product.title.replace("FBG ", "")}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "4px" }}>
                      <p style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#111111",
                        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.04,
                      }}>
                        {price}
                      </p>
                      <span className="hro-parcel">12× sem juros</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="hro-cta-wrap">
          <Magnetic strength={0.2}>
          <Link href="/colecao" className="hro-cta-btn">
            Explorar coleção completa
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
