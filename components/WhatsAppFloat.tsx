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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.841 1.26c-1.514.867-2.748 2.052-3.626 3.477-.878 1.425-1.337 3.012-1.336 4.635.001 1.592.315 3.138.926 4.56l-1.056 3.842 3.95-1.041c1.334.716 2.823 1.095 4.337 1.096h.004c5.098 0 9.237-4.14 9.237-9.238 0-2.468-.987-4.787-2.779-6.532-1.79-1.745-4.112-2.706-6.612-2.706" />
      </svg>
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
