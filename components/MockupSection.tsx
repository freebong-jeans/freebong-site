"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

function useInView(threshold = 0.1) {
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

/* ─────────────────────────────────────────────────────────
   iPhone 16 Pro — Black Titanium
   Proporção real 19.5:9, tela sangrando até a borda,
   vídeo encaixado por completo, tilt sutil.
───────────────────────────────────────────────────────── */
function IPhone3D({
  tiltX,
  tiltY,
  inView,
  videoRef,
}: {
  tiltX: number;
  tiltY: number;
  inView: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  /* Titânio preto: gradiente que reage ao ângulo */
  const FRAME = "linear-gradient(150deg, #4a4a4d 0%, #17171a 14%, #333336 30%, #0b0b0c 48%, #2b2b2e 64%, #45454a 78%, #131315 100%)";
  const EDGE  = "linear-gradient(90deg, #0a0a0b 0%, #3d3d41 45%, #060607 100%)";

  /* brilho especular acompanha o tilt */
  const shimX = 50 - tiltY * 3.2;
  const shimY = 50 - tiltX * 3.2;

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(36px)",
        transition: "opacity 0.9s ease 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
        position: "relative",
      }}
    >
      {/* halo dourado difuso */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-14%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(166,124,61,0.13) 0%, transparent 66%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* sombra projetada no chão */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-26px",
          left: "50%",
          transform: `translateX(calc(-50% + ${tiltY * 2.2}px)) scaleX(${1 - Math.abs(tiltY) * 0.012})`,
          width: "72%",
          height: "26px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 74%)",
          filter: "blur(15px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, perspective: "1800px" }}>
        <div
          className="fbg-phone"
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transformStyle: "preserve-3d",
            willChange: "transform",
            position: "relative",
          }}
        >
          {/* ── Corpo em titânio ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: FRAME,
              borderRadius: "13.5%/6.6%",
              padding: "3px",
              boxShadow: [
                "0 0 0 1px rgba(90,90,96,0.5)",
                "0 3px 10px rgba(0,0,0,0.3)",
                "0 26px 70px -18px rgba(0,0,0,0.45)",
                "inset 0 1px 0 rgba(255,255,255,0.14)",
                "inset 0 -1px 0 rgba(0,0,0,0.5)",
              ].join(", "),
            }}
          >
            {/* ── Tela ── */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12.8%/6.2%",
                overflow: "hidden",
                background: "#000",
                position: "relative",
              }}
            >
              {/* Vídeo: preenche a tela inteira, sem corte esquisito */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  display: "block",
                }}
              >
                <source src="/videos/iphone-fbg-v2.mp4" type="video/mp4" />
              </video>

              {/* Dynamic Island */}
              <div
                style={{
                  position: "absolute",
                  top: "1.5%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "29%",
                  height: "4.1%",
                  background: "#000",
                  borderRadius: "100px",
                  zIndex: 20,
                }}
              />

              {/* Reflexo especular que segue o ângulo */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse 70% 55% at ${shimX}% ${shimY}%, rgba(255,255,255,0.11) 0%, transparent 62%)`,
                  pointerEvents: "none",
                  zIndex: 30,
                  borderRadius: "inherit",
                }}
              />

              {/* Brilho diagonal de vidro */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(122deg, rgba(255,255,255,0.09) 0%, transparent 26%, transparent 74%, rgba(255,255,255,0.045) 100%)",
                  pointerEvents: "none",
                  zIndex: 31,
                  borderRadius: "inherit",
                }}
              />

              {/* Home indicator */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: "0.9%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "34%",
                  height: "4px",
                  background: "rgba(255,255,255,0.75)",
                  borderRadius: "100px",
                  zIndex: 32,
                }}
              />
            </div>
          </div>

          {/* ── Botões laterais ── */}
          {/* volume + / − (esquerda) */}
          {["19%", "26.5%"].map((top) => (
            <div
              key={top}
              style={{
                position: "absolute",
                left: "-3px",
                top,
                width: "3px",
                height: "5.6%",
                background: EDGE,
                borderRadius: "2px 0 0 2px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            />
          ))}
          {/* botão de ação (esquerda) */}
          <div
            style={{
              position: "absolute",
              left: "-3px",
              top: "12.5%",
              width: "3px",
              height: "3.6%",
              background: EDGE,
              borderRadius: "2px 0 0 2px",
            }}
          />
          {/* power (direita) */}
          <div
            style={{
              position: "absolute",
              right: "-3px",
              top: "21%",
              width: "3px",
              height: "10.6%",
              background: EDGE,
              borderRadius: "0 2px 2px 0",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          />
        </div>
      </div>

      <style>{`
        .fbg-phone {
          width: clamp(230px, 26vw, 320px);
          aspect-ratio: 9 / 19.5;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────── */
export default function MockupSection() {
  const { ref, inView } = useInView(0.1);
  const containerRef    = useRef<HTMLDivElement>(null);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const rafRef          = useRef<number>(0);
  const targetRef       = useRef({ x: 2, y: -5 });
  const currentRef      = useRef({ x: 2, y: -5 });
  const [tilt, setTilt] = useState({ x: 2, y: -5 });
  const [muted, setMuted] = useState(true);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  /* Força autoplay no iOS — muted via JS + múltiplos eventos de carregamento */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const tryPlay = () => { if (v.paused) v.play().catch(() => {}); };

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

  /* Loop lerp suave */
  useEffect(() => {
    const tick = () => {
      const L = 0.065;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * L;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * L;
      setTilt({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const calcTilt = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    targetRef.current = {
      x: ((clientY - cy) / (rect.height / 2)) * -7,
      y: ((clientX - cx) / (rect.width  / 2)) * 9,
    };
  }, []);

  const handleMouseMove  = useCallback((e: React.MouseEvent)  => calcTilt(e.clientX, e.clientY), [calcTilt]);
  const handleTouchMove  = useCallback((e: React.TouchEvent)  => { e.preventDefault(); calcTilt(e.touches[0].clientX, e.touches[0].clientY); }, [calcTilt]);
  const handleMouseLeave = useCallback(() => { targetRef.current = { x: 2, y: -5 }; }, []);
  const handleTouchEnd   = useCallback(() => { targetRef.current = { x: 2, y: -5 }; }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#F7F7F5",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <div className="container-fbg" style={{ padding: "clamp(64px,10vw,120px) 1.5rem" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 items-center"
          style={{ gap: "clamp(48px,7vw,80px)" }}
        >

          {/* ── Texto ── */}
          <div>
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(14px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <span
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.4)",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                }}
              >
                Experiência Mobile
              </span>
            </div>

            <div style={{ overflow: "hidden", marginTop: "clamp(14px,2vw,20px)" }}>
              <div
                style={{
                  transform: inView ? "translateY(0)" : "translateY(105%)",
                  transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: "clamp(2.2rem,4.8vw,4.4rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.04,
                    textTransform: "uppercase",
                    color: "#141414",
                    margin: 0,
                  }}
                >
                  FBG NO SEU
                  <br />
                  <span style={{ color: "#6B2033" }}>BOLSO.</span>
                </h2>
              </div>
            </div>

            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(12px)",
                transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "2px",
                  background: "linear-gradient(90deg,#A67C3D,#6B2033)",
                  margin: "clamp(14px,2vw,20px) 0",
                }}
              />

              <p
                style={{
                  fontSize: "0.88rem",
                  lineHeight: 1.8,
                  color: "rgba(0,0,0,0.55)",
                  maxWidth: "360px",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                }}
              >
                Explore a coleção, acompanhe lançamentos e conecte-se
                com a comunidade FBG diretamente pelo celular.
              </p>

              {/* Stats */}
              <div style={{ display: "flex", gap: "clamp(20px,3vw,40px)", marginTop: "28px" }}>
                {[
                  { v: "31,5K", l: "seguidores" },
                  { v: "252",   l: "na comunidade" },
                ].map((s) => (
                  <div key={s.v}>
                    <p
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: "1.5rem",
                        letterSpacing: "-0.03em",
                        color: "#141414",
                        lineHeight: 1.04,
                      }}
                    >
                      {s.v}
                    </p>
                    <p
                      style={{
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(0,0,0,0.45)",
                        marginTop: "4px",
                        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                      }}
                    >
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>

              {/* Link — Instagram da Freebong */}
              <a
                href="https://www.instagram.com/freebong_/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: "28px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 18px",
                  border: "1px solid rgba(166,124,61,0.4)",
                  textDecoration: "none",
                  transition: "border-color 0.25s ease, background 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#A67C3D";
                  el.style.background = "rgba(166,124,61,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(166,124,61,0.4)";
                  el.style.background = "transparent";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A67C3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#A67C3D" stroke="none"/>
                </svg>
                <span
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#A67C3D",
                    fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Clique aqui para acessar o Instagram
                </span>
              </a>
            </div>
          </div>

          {/* ── iPhone 3D ── */}
          <div
            className="flex justify-center"
            style={{
              paddingTop: "clamp(24px, 5vw, 48px)",
              paddingBottom: "clamp(24px, 5vw, 48px)",
              position: "relative",
            }}
          >
            <div
              ref={containerRef}
              style={{ position: "relative", display: "inline-block", cursor: "grab", touchAction: "none" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <IPhone3D tiltX={tilt.x} tiltY={tilt.y} inView={inView} videoRef={videoRef} />
              {/* Botão de som */}
              <button
                onClick={toggleMute}
                aria-label={muted ? "Ativar som" : "Silenciar"}
                style={{
                  position: "absolute",
                  bottom: "14px",
                  right: "-18px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(14,14,14,0.9)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${muted ? "rgba(255,255,255,0.18)" : "#A67C3D"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  opacity: inView ? 1 : 0,
                  transition: "opacity 0.5s ease 0.8s, border-color 0.25s ease",
                }}
              >
                {muted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A67C3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
