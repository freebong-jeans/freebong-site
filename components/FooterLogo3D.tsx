"use client";

/**
 * FooterLogo3D — logo oficial FBG grande, em 3D, no fim da página.
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

  /* profundidade: camadas de sombra, do dourado ao preto, seguindo o
     contorno da logo (drop-shadow respeita a transparencia do PNG) */
  const depth = [
    "drop-shadow(0 0 1px rgba(233,207,166,0.7))",
    "drop-shadow(2px 3px 0 rgba(176,134,74,0.5))",
    "drop-shadow(3px 4px 0 rgba(176,134,74,0.3))",
    "drop-shadow(6px 9px 0 rgba(0,0,0,0.45))",
    "drop-shadow(10px 16px 14px rgba(0,0,0,0.35))",
  ].join(" ");

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-fbg-black.png"
        alt=""
        width={1400}
        height={485}
        loading="lazy"
        draggable={false}
        className="fbg-logo-3d"
        style={{
          width: "min(78vw, 760px)",
          height: "auto",
          filter: depth,
          transform: `rotateX(${12 + tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          animation: inView ? "fbg3dIdle 7s ease-in-out infinite" : "none",
          willChange: "transform",
          display: "block",
        }}
      />
      <style>{`
        @keyframes fbg3dIdle {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.88; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fbg-logo-3d { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
