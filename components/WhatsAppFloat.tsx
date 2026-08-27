"use client";

/**
 * WhatsAppFloat — atendimento global, discreto.
 * Botão circular compacto que só expande no hover (desktop).
 * Some ao rolar pra baixo e volta ao rolar pra cima, então nunca
 * fica em cima do conteúdo que o usuário está lendo.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const WHATSAPP = "https://wa.me/message/3ROGXK7TIP7TC1";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 1600);
    return () => clearTimeout(id);
  }, []);

  /* esconde ao descer, mostra ao subir ou ao parar no fim da página */
  useEffect(() => {
    lastY.current = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY.current && y > 260;
        setHidden(goingDown);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  if (pathname?.startsWith("/conta")) return null;

  const open = hover && !hidden;

  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Freebong no WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fbg-wa"
      style={{
        position: "fixed",
        right: "clamp(14px,2vw,24px)",
        bottom: "clamp(14px,2vw,24px)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: open ? "9px" : "0px",
        height: "48px",
        width: open ? "auto" : "48px",
        paddingLeft: "14px",
        paddingRight: open ? "18px" : "14px",
        background: "rgba(14,14,14,0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "100px",
        color: "#FFFFFF",
        textDecoration: "none",
        boxShadow: "0 8px 24px -10px rgba(0,0,0,0.45)",
        opacity: mounted && !hidden ? 1 : 0,
        transform: mounted && !hidden ? "translateY(0) scale(1)" : "translateY(24px) scale(0.85)",
        pointerEvents: mounted && !hidden ? "auto" : "none",
        transition:
          "opacity 0.4s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1), gap 0.4s cubic-bezier(0.16,1,0.3,1), padding-right 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, border-color 0.3s ease",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="17" height="17" viewBox="0 0 448 512" fill="#FFFFFF">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </span>
      <span
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          maxWidth: open ? "180px" : "0px",
          opacity: open ? 1 : 0,
          transition: "max-width 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
        }}
      >
        Fale com a gente
      </span>

      <style>{`
        .fbg-wa:hover { background: rgba(14,14,14,1) !important; border-color: rgba(37,211,102,0.4) !important; }
        /* mobile: só o ícone, nunca expande */
        @media (max-width: 640px) {
          .fbg-wa span { display: none; }
          .fbg-wa { width: 46px !important; height: 46px !important; padding-right: 13px !important; justify-content: center; }
        }
      `}</style>
    </a>
  );
}
