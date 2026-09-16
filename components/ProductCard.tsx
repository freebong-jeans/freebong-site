"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";

interface ProductCardProps {
  product: ShopifyProduct;
  onViewMore?: (product: ShopifyProduct) => void;
}

/**
 * ProductCard — tilt 3D + glare no hover, troca frente→costas
 * e reveal editorial na entrada (IntersectionObserver).
 */
export default function ProductCard({ product, onViewMore }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [manualPick, setManualPick] = useState(false);

  const cardRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  /* ── Reveal editorial na entrada ── */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const firstVariant = product.variants[0];
  const price = firstVariant
    ? parseFloat(firstVariant.price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  /* Hover frente→costas: última imagem = vista de costas */
  const backIndex = product.images.length > 1 ? product.images.length - 1 : 0;
  const displayIndex = hovering && !manualPick && product.images.length > 1 ? backIndex : activeImage;

  const image = product.images[displayIndex] ?? product.images[0];
  const imageSrc = !imgError && image?.src ? image.src : null;
  const imageAlt = image?.altText ?? product.title;
  const isAvailable = product.variants.some((v) => v.available);

  // Comparação tolerante a acento/maiúscula: as tags vêm de quem cadastra na Shopify,
  // não dá pra depender de estarem digitadas num formato técnico exato.
  const normalizedTags = product.tags.map((t) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  );
  const tagBadge = normalizedTags.some((t) => t.includes("novidade"));
  const isProgramacao = normalizedTags.some((t) => t.includes("programacao"));

  /* ── Tilt 3D ── */
  const handleMove = (e: React.MouseEvent) => {
    const el = innerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px) scale(1.012)`;
    const glare = glareRef.current;
    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(10,10,10,0.14), transparent 55%)`;
    }
  };

  const handleLeave = () => {
    setHovering(false);
    setManualPick(false);
    const el = innerRef.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)";
    const glare = glareRef.current;
    if (glare) glare.style.opacity = "0";
  };

  return (
    <article
      ref={cardRef}
      className="group relative cursor-pointer"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(28px)",
        clipPath: revealed ? "inset(0 0 0% 0)" : "inset(0 0 12% 0)",
        transition:
          "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), clip-path 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onViewMore?.(product)}
    >
      <div
        ref={innerRef}
        className="relative flex flex-col overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(10,10,10,0.06)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.35s ease",
          transformStyle: "preserve-3d",
          willChange: "transform",
          borderColor: hovering ? "rgba(176,134,74,0.35)" : "rgba(10,10,10,0.06)",
          boxShadow: hovering ? "0 24px 48px -16px rgba(0,0,0,0.65)" : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        {/* Glare 3D */}
        <div
          ref={glareRef}
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        />

        {/* ── Área da imagem ──────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4", background: "#F1EFEA" }}
        >
          {imageSrc ? (
            <Image
              key={displayIndex}
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center"
              style={{
                transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
                transform: hovering ? "scale(1.05)" : "scale(1)",
                animation: "fbgFadeIn 0.4s ease",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: "clamp(2.5rem,5vw,3.5rem)",
                  letterSpacing: "-0.04em",
                  WebkitTextStroke: "1px rgba(176,134,74,0.25)",
                  color: "transparent",
                  userSelect: "none",
                }}
              >
                FBG
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(10,10,10,0.15)",
                  fontWeight: 600,
                }}
              >
                {product.productType}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {!isAvailable && (
              <span
                className="text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-1"
                style={{ background: "rgba(0,0,0,0.8)", color: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}
              >
                Esgotado
              </span>
            )}
            {tagBadge && (
              <span
                className="text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-1"
                style={{ background: "#B0864A", color: "#0E0E0E" }}
              >
                Novidade
              </span>
            )}
            {isProgramacao && (
              <span
                className="text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-1"
                style={{ background: "rgba(0,0,0,0.75)", color: "#B0864A", backdropFilter: "blur(8px)", border: "1px solid rgba(176,134,74,0.35)" }}
              >
                Programação
              </span>
            )}
          </div>

          {/* Hint frente/costas */}
          {product.images.length > 1 && (
            <span
              className="absolute top-3 right-3 z-10 text-[8px] font-bold tracking-[0.16em] uppercase px-2 py-1"
              style={{
                background: "rgba(0,0,0,0.55)",
                color: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(8px)",
                opacity: hovering && !manualPick ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              Costas
            </span>
          )}

          {/* Seletor de imagens */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Imagem ${i + 1}`}
                  onClick={e => { e.stopPropagation(); setActiveImage(i); setManualPick(true); }}
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: i === displayIndex ? "#B0864A" : "rgba(10,10,10,0.3)",
                    transition: "background 0.2s ease",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          {/* Linha de hover na base da imagem */}
          <div
            className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full z-10"
            style={{
              background: "linear-gradient(90deg, #B0864A, #6B2033)",
              transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>

        {/* ── Informações do produto ──────────────────────── */}
        <div style={{ padding: "16px 18px 20px" }}>
          {product.productType && (
            <span
              className="type-eyebrow block mb-2"
              style={{ color: "rgba(10,10,10,0.3)" }}
            >
              {product.productType}
            </span>
          )}

          <h3
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "-0.01em",
              color: "#0E0E0E",
              lineHeight: 1.3,
              marginBottom: "12px",
            }}
            className="line-clamp-2"
          >
            {product.title}
          </h3>

          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: isAvailable ? "#0E0E0E" : "rgba(10,10,10,0.3)",
                letterSpacing: "-0.01em",
              }}
            >
              {price ?? "Sob consulta"}
            </span>

            <button
              onClick={e => { e.stopPropagation(); onViewMore?.(product); }}
              disabled={!isAvailable}
              className="group/btn relative"
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                color: isAvailable ? "#B0864A" : "rgba(10,10,10,0.2)",
                background: "none",
                border: "none",
                cursor: isAvailable ? "pointer" : "not-allowed",
                padding: 0,
              }}
            >
              Ver mais
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fbgFadeIn {
          from { opacity: 0.35; }
          to   { opacity: 1; }
        }
      `}</style>
    </article>
  );
}
