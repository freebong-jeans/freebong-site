"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SUGGESTIONS = ["Skinny", "Slim", "Reta", "Cargo", "Bermuda", "Jaqueta", "Black"];

/* normaliza pra busca: minúsculas, sem acentos, sem espaços/traços
   → "CA 061-01" encontra a ref "ca-061-01" */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\s-]/g, "");

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { products } = useProducts();

  const q = norm(query.trim());
  const results = q.length > 0
    ? products.filter((p) =>
        norm(p.title).includes(q) ||
        p.tags.some((t) => norm(t).includes(q)) ||
        norm(p.productType).includes(q)
      )
    : [];

  const handleClose = useCallback(() => {
    setLeaving(true);
    setTimeout(onClose, 380);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => {
        setLeaving(false);
        setQuery("");
      });
      const focusId = setTimeout(() => inputRef.current?.focus(), 100);
      return () => {
        cancelAnimationFrame(id);
        clearTimeout(focusId);
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const goTo = (handle: string) => {
    handleClose();
    setTimeout(() => router.push(`/produtos/${handle}`), 100);
  };

  if (!open && !leaving) return null;

  const visible = open && !leaving;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 700,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      />

      {/* Painel */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(10,10,10,0.08)",
          transform: visible ? "translateY(0)" : "translateY(-20px)",
          transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)",
          maxHeight: "80svh",
          overflowY: "auto",
          paddingBottom: "32px",
        }}
      >
        {/* Barra de busca */}
        <div
          style={{
            borderBottom: "1px solid rgba(10,10,10,0.07)",
            padding: "0 clamp(20px,5vw,80px)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            height: "72px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(10,10,10,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#0E0E0E", fontSize: "clamp(1rem,2vw,1.3rem)",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 500,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", color: "rgba(10,10,10,0.3)", cursor: "pointer", fontSize: "1rem" }}
            >
              ✕
            </button>
          )}
          <button
            onClick={handleClose}
            style={{
              background: "none", border: "none",
              color: "rgba(10,10,10,0.4)", cursor: "pointer",
              fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              padding: "8px",
            }}
          >
            Fechar
          </button>
        </div>

        <div style={{ padding: "28px clamp(20px,5vw,80px) 0" }}>
          {/* Sugestões (quando sem query) */}
          {!query && (
            <div>
              <p style={{
                fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(10,10,10,0.3)",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                marginBottom: "14px",
              }}>
                Sugestões
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    style={{
                      fontSize: "0.72rem", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                      padding: "8px 16px",
                      border: "1px solid rgba(10,10,10,0.12)",
                      background: "transparent", color: "rgba(10,10,10,0.55)",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease, color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#B0864A";
                      (e.currentTarget as HTMLButtonElement).style.color = "#B0864A";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(10,10,10,0.12)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,10,10,0.55)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados */}
          {query && (
            <div>
              <p style={{
                fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(10,10,10,0.3)",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                marginBottom: "20px",
              }}>
                {results.length > 0 ? `${results.length} resultado${results.length !== 1 ? "s" : ""}` : "Nenhum resultado"}
              </p>

              {results.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
                  {results.map((p) => {
                    const img = p.images[0];
                    const price = parseFloat(p.variants[0]?.price ?? "0").toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    return (
                      <button
                        key={p.id}
                        onClick={() => goTo(p.handle)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          textAlign: "left", padding: 0,
                        }}
                      >
                        <div style={{
                          aspectRatio: "3/4", background: "#F1EFEA", position: "relative",
                          marginBottom: "10px", overflow: "hidden",
                        }}>
                          {img ? (
                            <Image src={img.src} alt={img.altText ?? p.title} fill
                              sizes="200px"
                              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: "rgba(10,10,10,0.15)", fontSize: "1.2rem", fontStyle: "italic", fontWeight: 900 }}>FBG</span>
                            </div>
                          )}
                        </div>
                        <p style={{
                          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                          fontSize: "0.78rem", fontWeight: 600,
                          color: "#0E0E0E", marginBottom: "4px", lineHeight: 1.3,
                        }}>{p.title}</p>
                        <p style={{
                          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                          fontSize: "0.72rem", color: "rgba(10,10,10,0.45)",
                        }}>{price}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: "0.84rem", color: "rgba(10,10,10,0.3)", paddingTop: "8px" }}>
                  Tente &quot;Skinny&quot;, &quot;Cargo&quot; ou uma referência como &quot;CA 061&quot;.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
