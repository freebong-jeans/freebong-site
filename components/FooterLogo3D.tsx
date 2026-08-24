"use client";

/**
 * FooterLogo3D — assinatura FBG gigante em 3D no fim da página.
 * Profundidade real por camadas de sombra + inclinação que segue
 * o mouse (desktop) e oscilação lenta contínua. Sem WebGL: leve.
 */

import { useEffect, useRef, useState } from "react";

export default function FooterLogo3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 14, y: px * 18 });
  };

  /* profundidade: 10 camadas de sombra, do dourado ao preto */
  const depth = Array.from({ length: 10 })
    .map((_, i) => {
      const d = i + 1;
      const gold = i < 3;
      const c = gold ? `rgba(181,150,114,${0.5 - i * 0.12})` : `rgba(0,0,0,${0.55 - (i - 3) * 0.06})`;
      return `${d * 1.5}px ${d * 2}px 0 ${c}`;
    })
    .join(", ");

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px,7vw,90px) 20px clamp(16px,3vw,32px)",
        perspective: "900px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(5rem, 22vw, 17rem)",
          letterSpacing: "-0.05em",
          lineHeight: 1.0,
          color: "#0E0E0E",
          WebkitTextStroke: "1px rgba(181,150,114,0.35)",
          textShadow: depth,
          transform: `rotateX(${12 + tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          animation: inView ? "fbg3dIdle 7s ease-in-out infinite" : "none",
          willChange: "transform",
          display: "block",
        }}
      >
        FBG
      </span>
      <style>{`
        @keyframes fbg3dIdle {
          0%, 100% { filter: brightness(1); }
          50%      { filter: brightness(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[aria-hidden] span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
