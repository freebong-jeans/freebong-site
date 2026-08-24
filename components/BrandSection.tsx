"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ParallaxImage from "@/components/ParallaxImage";

/* ══════════════════════════════════════════════════════════
   BRAND SECTION — "O que é a Freebong" + Canais de venda
   Institucional: apresenta a marca em 5 segundos e abre os
   três caminhos de compra (varejo, atacado, revenda).
══════════════════════════════════════════════════════════ */

function useInView(threshold = 0.12): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null);
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
  return [ref, inView];
}

const HN = "'Helvetica Neue', Helvetica, sans-serif";

export default function BrandSection() {
  const [ref1, inView1] = useInView(0.15);

  return (
    <div style={{ background: "#FFFFFF", color: "#141414" }}>

      {/* ══ A MARCA — o que é a Freebong ══ */}
      <section
        ref={ref1 as React.RefObject<HTMLElement>}
        style={{
          borderTop: "1px solid rgba(0,0,0,0.08)",
          paddingTop: "clamp(64px,9vw,110px)",
          paddingBottom: "clamp(64px,9vw,110px)",
        }}
      >
        <div
          className="container-fbg grid grid-cols-1 lg:grid-cols-2 items-center"
          style={{ gap: "clamp(40px,6vw,88px)" }}
        >
          {/* Texto */}
          <div>
            <span
              className="type-eyebrow"
              style={{
                opacity: inView1 ? 1 : 0,
                transition: "opacity 0.7s ease",
                display: "block",
              }}
            >
              A Marca
            </span>

            <h2
              style={{
                fontFamily: HN,
                fontWeight: 900,
                fontSize: "clamp(2rem,4.4vw,4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.04,
                textTransform: "uppercase",
                color: "#141414",
                margin: "clamp(16px,2vw,24px) 0 0",
                opacity: inView1 ? 1 : 0,
                transform: inView1 ? "none" : "translateY(20px)",
                transition: "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
              }}
            >
              Freebong é<br />
              <span style={{ color: "#B59672" }}>identidade.</span>
            </h2>

            <div
              style={{
                opacity: inView1 ? 1 : 0,
                transform: inView1 ? "none" : "translateY(14px)",
                transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(0.9rem,1.5vw,1.02rem)",
                  lineHeight: 1.8,
                  color: "rgba(0,0,0,0.6)",
                  maxWidth: "460px",
                  marginTop: "clamp(20px,2.5vw,28px)",
                }}
              >
                Desde 2013, a Freebong constrói mais que jeans: constrói um
                movimento. Nascida em Minas Gerais, a marca une jeans premium,
                streetwear e propósito, com a linha <strong style={{ color: "#141414" }}>FBG Jeans Wear</strong> presente
                em mais de 200 lojas e 27 estados do Brasil.
              </p>
              <p
                style={{
                  fontSize: "clamp(0.9rem,1.5vw,1.02rem)",
                  lineHeight: 1.8,
                  color: "rgba(0,0,0,0.6)",
                  maxWidth: "460px",
                  marginTop: "16px",
                }}
              >
                Original como quem veste. Feito pra durar mais que a moda.
              </p>

              <Link
                href="/movimento"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "clamp(24px,3vw,36px)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#141414",
                  textDecoration: "none",
                  paddingBottom: "4px",
                  borderBottom: "1.5px solid rgba(0,0,0,0.3)",
                  fontFamily: HN,
                }}
              >
                Conheça o movimento →
              </Link>
            </div>
          </div>

          {/* Visual — foto editorial + selo */}
          <div
            style={{
              position: "relative",
              opacity: inView1 ? 1 : 0,
              transform: inView1 ? "none" : "translateY(24px)",
              transition: "opacity 1s ease 0.25s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.25s",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                maxHeight: "620px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <ParallaxImage
                src="/images/products/DSC00972.jpg"
                alt="Freebong · campanha FBG Jeans Wear"
                sizes="(max-width: 1024px) 100vw, 50vw"
                objectPosition="center 20%"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 45%)",
                }}
              />
              {/* Selo da marca sobre a foto */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Image
                  src="/images/logo-fbg-white.png"
                  alt="FBG"
                  width={110}
                  height={38}
                  style={{ width: "clamp(80px,10vw,110px)", height: "auto", opacity: 0.95 }}
                />
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: HN,
                  }}
                >
                  Made to last · Est. 2013
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
