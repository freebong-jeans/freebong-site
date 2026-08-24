"use client";

/**
 * CollectionHero — abertura da página Coleção.
 * Banner em vídeo + tríptico 3D de categorias com tilt e parallax.
 * Minimalista: uma headline, um CTA, três portas de entrada.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FONT = "'Helvetica Neue', Helvetica, sans-serif";

const DOORS = [
  { label: "Calças",   count: 27, href: "/colecao?categoria=calca",   img: "/images/campaign/dsc01573.jpg" },
  { label: "Bermudas", count: 14, href: "/colecao?categoria=bermuda", img: "/images/campaign/dsc01800.jpg" },
  { label: "Jaquetas", count: 4,  href: "/colecao?categoria=jaqueta", img: "/images/campaign/dsc01662.jpg" },
];

export default function CollectionHero({ total = 45 }: { total?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute("playsinline", "");
    const play = () => { if (v.paused) v.play().catch(() => {}); };
    play();
    v.addEventListener("canplay", play, { once: true });
    return () => v.removeEventListener("canplay", play);
  }, []);

  /* parallax leve do vídeo */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        setScrollY(-r.top);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", background: "#0A0A0A", overflow: "hidden" }}>
      {/* ── Banner em vídeo ── */}
      <div style={{ position: "relative", height: "clamp(440px, 66vh, 680px)", overflow: "hidden" }}>
        <video
          ref={videoRef}
          src="/videos/hero-home.mp4"
          poster="/videos/hero-home-poster.jpg"
          autoPlay muted loop playsInline preload="metadata"
          onCanPlay={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "112%",
            objectFit: "cover",
            objectPosition: "center 35%",
            transform: `translateY(${scrollY * 0.14}px)`,
            filter: "brightness(0.72) saturate(0.9)",
            willChange: "transform",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.5) 100%)" }} />

        {/* grain */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.045, mixBlendMode: "overlay",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "170px",
          }}
        />

        {/* ── Conteúdo ── */}
        <div
          className="container-fbg"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "clamp(36px, 6vw, 72px)",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#B59672",
              marginBottom: "16px",
              opacity: ready ? 1 : 0,
              transition: "opacity 0.8s ease 0.15s",
            }}
          >
            Jeans Collection · Junho 2026
          </span>

          <h1
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: "clamp(2.4rem, 7vw, 5.6rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: 0,
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
              <span style={{ display: "block", transform: ready ? "translateY(0)" : "translateY(106%)", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
                {total} peças.
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
              <span style={{ display: "block", color: "#B59672", transform: ready ? "translateY(0)" : "translateY(106%)", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.32s" }}>
                Um padrão só.
              </span>
            </span>
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(16px,3vw,28px)",
              marginTop: "clamp(22px,3vw,34px)",
              flexWrap: "wrap",
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.55s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s",
            }}
          >
            <a
              href="#grade"
              className="fbg-hero-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "17px clamp(28px,4vw,44px)",
                background: "#FFFFFF",
                color: "#0A0A0A",
                textDecoration: "none",
                borderRadius: "4px",
                fontFamily: FONT,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                transition: "background 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#B59672";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#FFFFFF";
                el.style.transform = "none";
              }}
            >
              Ver a coleção
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 10px rgba(74,222,128,0.7)" }} />
              <span style={{ fontFamily: FONT, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>
                Pronta entrega
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tríptico 3D de categorias ── */}
      <div className="fbg-doors">
        {DOORS.map((d, i) => (
          <DoorCard key={d.href} {...d} index={i} ready={ready} />
        ))}
      </div>

      <style>{`
        .fbg-doors {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.08);
          perspective: 1400px;
        }
        @media (min-width: 720px) {
          .fbg-doors { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  );
}

function DoorCard({
  label, count, href, img, index, ready,
}: { label: string; count: number; href: string; img: string; index: number; ready: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateZ(24px)`;
    const im = el.querySelector("img");
    if (im) im.style.transform = `scale(1.09) translate(${px * -12}px, ${py * -12}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateY(0) rotateX(0) translateZ(0)";
    const im = el.querySelector("img");
    if (im) im.style.transform = "scale(1)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "16/10",
        overflow: "hidden",
        background: "#0A0A0A",
        textDecoration: "none",
        transformStyle: "preserve-3d",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        opacity: ready ? 1 : 0,
        willChange: "transform",
        animation: ready ? `fbgDoorIn 0.8s cubic-bezier(0.16,1,0.3,1) ${0.7 + index * 0.12}s both` : "none",
      }}
    >
      <Image
        src={img}
        alt={label}
        fill
        sizes="(max-width: 720px) 100vw, 33vw"
        style={{
          objectFit: "cover",
          objectPosition: "center 25%",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 60%)" }} />

      <div
        style={{
          position: "absolute",
          left: "clamp(18px,2.5vw,28px)",
          right: "clamp(18px,2.5vw,28px)",
          bottom: "clamp(16px,2.2vw,24px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "12px",
          transform: "translateZ(40px)",
        }}
      >
        <div>
          <span style={{ display: "block", fontFamily: FONT, fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B59672", marginBottom: "6px" }}>
            {count} referências
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(1.3rem,2.4vw,2rem)", letterSpacing: "-0.03em", textTransform: "uppercase", color: "#FFFFFF", lineHeight: 1 }}>
            {label}
          </span>
        </div>
        <span
          style={{
            flexShrink: 0,
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      <style>{`
        @keyframes fbgDoorIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Link>
  );
}
