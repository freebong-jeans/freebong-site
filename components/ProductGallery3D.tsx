"use client";

/**
 * ProductGallery3D v2 — CARROSSEL DE ARRASTE
 *  · Swipe nativo no mobile / arrastar com o mouse no desktop
 *  · Scroll-snap: cada foto trava centralizada
 *  · Lupa de tecido 2.6× no hover (desktop, quando não está arrastando)
 *  · Contador, setas e thumbnails sincronizados
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";

export default function ProductGallery3D({
  product,
  isNew,
}: {
  product: ShopifyProduct;
  isNew: boolean;
}) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lens, setLens] = useState({ x: 50, y: 50 });

  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0 });

  const images = product.images;
  const n = images.length;
  const isProgramacao = useMemo(() => product.tags.includes("programacao"), [product.tags]);

  /* índice ativo a partir do scroll (swipe nativo ou drag) */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setActive(Math.min(n - 1, Math.max(0, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: Math.min(n - 1, Math.max(0, i)) * el.clientWidth, behavior: "smooth" });
  };

  /* ── Drag com mouse (desktop) ── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch usa o swipe nativo
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down || e.pointerType !== "mouse") return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6 && !drag.current.moved) {
      drag.current.moved = true;
      setDragging(true);
      setZooming(false);
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const wasDragging = drag.current.moved;
    drag.current.down = false;
    drag.current.moved = false;
    if (wasDragging) {
      setDragging(false);
      goTo(Math.round(el.scrollLeft / el.clientWidth));
    }
  };

  /* ── Lupa de tecido ── */
  const onZoomMove = (e: React.MouseEvent) => {
    if (dragging) return;
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setLens({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div className="fbg-gallery-wrapper" style={{ position: "sticky", top: "120px" }}>
      {/* ── Palco ── */}
      <div style={{ position: "relative" }}>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={() => { endDrag(); setZooming(false); }}
          onMouseEnter={() => { if (!dragging) setZooming(true); }}
          onMouseMove={onZoomMove}
          className="fbg-gallery-track"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: dragging ? "none" : "x mandatory",
            aspectRatio: "3/4",
            cursor: dragging ? "grabbing" : n > 1 ? "grab" : "default",
            touchAction: "pan-x",
            overscrollBehaviorX: "contain",
          }}
        >
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 100%",
                  scrollSnapAlign: "start",
                  position: "relative",
                  overflow: "hidden",
                  background: "#FFFFFF",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.altText ?? product.title}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: zooming && !dragging && i === active ? "scale(2.6)" : "scale(1)",
                    transformOrigin: `${lens.x}% ${lens.y}%`,
                    transition: zooming && i === active ? "transform 0.18s ease-out" : "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
                    willChange: "transform",
                    userSelect: "none",
                  }}
                />
              </div>
            ))
          ) : (
            <div
              style={{
                flex: "0 0 100%",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(10,10,10,0.2)" }}>
                {product.productType}
              </span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", flexDirection: "column", gap: "6px", zIndex: 5, pointerEvents: "none" }}>
          {isNew && (
            <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "5px 10px", background: "#A67C3D", color: "#0E0E0E" }}>
              Novidade
            </span>
          )}
          {isProgramacao && (
            <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "5px 10px", background: "rgba(0,0,0,0.75)", color: "#A67C3D", border: "1px solid rgba(166,124,61,0.4)" }}>
              Programação
            </span>
          )}
        </div>

        {/* Contador */}
        {n > 1 && (
          <span
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 5,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "#FFFFFF",
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              padding: "6px 10px",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              pointerEvents: "none",
            }}
          >
            {active + 1} / {n}
          </span>
        )}

        {/* Setas (desktop) */}
        {n > 1 && (
          <>
            <GalleryArrow dir="prev" disabled={active === 0} onClick={() => goTo(active - 1)} />
            <GalleryArrow dir="next" disabled={active === n - 1} onClick={() => goTo(active + 1)} />
          </>
        )}

        {/* Dots (mobile) */}
        {n > 1 && (
          <div
            className="md:hidden"
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              zIndex: 5,
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === active ? "18px" : "6px",
                  height: "3px",
                  borderRadius: "2px",
                  background: i === active ? "#A67C3D" : "rgba(10,10,10,0.35)",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Legenda de uso ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(10,10,10,0.3)", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
          <span className="md:hidden">Deslize para ver todas as fotos</span>
          <span className="hidden md:inline">Arraste para o lado · passe o mouse para ampliar o tecido</span>
        </span>
      </div>

      {/* ── Thumbnails ── */}
      {n > 1 && (
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Foto ${i + 1}`}
              style={{
                width: "72px",
                aspectRatio: "3/4",
                border: `1px solid ${i === active ? "#A67C3D" : "rgba(10,10,10,0.1)"}`,
                opacity: i === active ? 1 : 0.65,
                padding: 0,
                cursor: "pointer",
                background: "#FFFFFF",
                overflow: "hidden",
                flexShrink: 0,
                transition: "border-color 0.2s, opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      <style>{`
        .fbg-gallery-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .fbg-gallery-track::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          .fbg-gallery-wrapper { position: static !important; }
        }
      `}</style>
    </div>
  );
}

function GalleryArrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Foto anterior" : "Próxima foto"}
      className="hidden md:flex"
      style={{
        position: "absolute",
        top: "50%",
        [dir === "prev" ? "left" : "right"]: "12px",
        transform: "translateY(-50%)",
        zIndex: 6,
        width: "40px",
        height: "40px",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(10,10,10,0.15)",
        color: disabled ? "rgba(255,255,255,0.35)" : "#FFFFFF",
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.25s ease, border-color 0.25s ease",
        borderRadius: "50%",
      }}
      onMouseEnter={e => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = "rgba(166,124,61,0.85)";
          (e.currentTarget as HTMLElement).style.borderColor = "#A67C3D";
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.55)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,10,10,0.15)";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === "prev" ? "rotate(180deg)" : "none" }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}
