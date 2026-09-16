"use client";

/**
 * ProductExtras — blocos de conversão da página de produto:
 *  · SizeGuideModal   — guia de medidas (como medir + orientação por modelagem)
 *  · TrustBadges      — selos de confiança abaixo do CTA
 *  · CompleteLook     — peças que combinam (aumenta ticket)
 *  · FloatingWhatsApp — botão flutuante com contexto da peça
 */

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";

const FONT = "'Helvetica Neue', Helvetica, sans-serif";
const WHATSAPP = "https://wa.me/message/3ROGXK7TIP7TC1";

/* ══════════════════════════════════════════════════════════
   GUIA DE MEDIDAS — modal
══════════════════════════════════════════════════════════ */
export function SizeGuideModal({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category: "calca" | "bermuda" | "jaqueta";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const steps =
    category === "jaqueta"
      ? [
          { t: "Tórax", d: "Meça a circunferência na parte mais larga do peito, com a fita reta e sem apertar." },
          { t: "Ombros", d: "Meça de uma ponta do ombro à outra, pelas costas." },
          { t: "Manga", d: "Do ombro até o punho, com o braço levemente dobrado." },
        ]
      : [
          { t: "Cintura", d: "Meça a circunferência na altura em que você usa a peça, sem apertar a fita." },
          { t: "Quadril", d: "Meça na parte mais larga do quadril, com os pés juntos." },
          { t: "Comprimento", d: "Da cintura até o ponto em que quer que a peça termine." },
        ];

  const sizes = category === "jaqueta" ? "P · M · G · GG" : "38 · 40 · 42 · 44 · 46 · 48";
  const fitTip =
    category === "jaqueta"
      ? "Modelagem regular: veste fiel ao tamanho. Se prefere um caimento mais solto, escolha um tamanho acima."
      : "Skinny e slim vestem justos ao corpo. Se estiver entre dois tamanhos, escolha o maior. Reta e wide têm caimento mais folgado e vestem fiel à numeração.";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 800 }} role="dialog" aria-modal="true" aria-label="Guia de medidas">
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(92vw, 560px)",
          maxHeight: "86vh",
          overflowY: "auto",
          background: "#FFFFFF",
          border: "1px solid rgba(176,134,74,0.25)",
          padding: "clamp(24px,4vw,40px)",
          animation: "fbgCascade 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B0864A", display: "block", marginBottom: "8px", fontFamily: FONT }}>
              Guia de medidas
            </span>
            <h3 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "#141414", margin: 0 }}>
              Acerte o tamanho
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{ background: "none", border: "none", color: "rgba(10,10,10,0.4)", cursor: "pointer", padding: "6px", lineHeight: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "14px 16px", background: "rgba(176,134,74,0.08)", border: "1px solid rgba(176,134,74,0.2)", marginBottom: "22px" }}>
          <span style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(10,10,10,0.45)", display: "block", marginBottom: "6px", fontFamily: FONT }}>
            Grade disponível
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: "1.05rem", color: "#B0864A", letterSpacing: "0.06em" }}>{sizes}</span>
        </div>

        <span style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(10,10,10,0.35)", display: "block", marginBottom: "14px", fontFamily: FONT }}>
          Como medir
        </span>
        {steps.map((s, i) => (
          <div key={s.t} style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
            <span style={{ flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%", border: "1px solid rgba(176,134,74,0.5)", color: "#B0864A", fontSize: "0.62rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
              {i + 1}
            </span>
            <div>
              <span style={{ display: "block", fontFamily: FONT, fontWeight: 700, fontSize: "0.82rem", color: "#141414", marginBottom: "2px" }}>{s.t}</span>
              <span style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "rgba(10,10,10,0.5)" }}>{s.d}</span>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "20px", padding: "14px 16px", background: "rgba(10,10,10,0.03)", borderLeft: "3px solid #B0864A" }}>
          <span style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "rgba(10,10,10,0.6)" }}>{fitTip}</span>
        </div>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "22px",
            padding: "14px",
            background: "transparent",
            border: "1px solid rgba(176,134,74,0.4)",
            color: "#B0864A",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: FONT,
          }}
        >
          Dúvida na medida? Fala com a equipe
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SELOS DE CONFIANÇA — abaixo do CTA
══════════════════════════════════════════════════════════ */
export function TrustBadges() {
  const items = [
    {
      label: "Envio para todo o Brasil",
      sub: "Frete grátis acima de R$ 299",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
          <circle cx="7.5" cy="17.5" r="2" /><circle cx="17.5" cy="17.5" r="2" />
        </svg>
      ),
    },
    {
      label: "Troca em até 30 dias",
      sub: "Sem uso e com etiqueta",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 4v8h8" />
        </svg>
      ),
    },
    {
      label: "Compra segura",
      sub: "Dados protegidos",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
        gap: "8px",
        marginBottom: "36px",
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "8px",
            padding: "14px 8px",
            background: "rgba(10,10,10,0.02)",
            border: "1px solid rgba(10,10,10,0.06)",
          }}
        >
          <span style={{ color: "#B0864A" }}>{it.icon}</span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(10,10,10,0.75)", lineHeight: 1.4 }}>
            {it.label}
          </span>
          <span style={{ fontSize: "0.58rem", color: "rgba(10,10,10,0.35)", lineHeight: 1.4 }}>{it.sub}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   COMPLETE O LOOK — peças que combinam
══════════════════════════════════════════════════════════ */
export function CompleteLook({
  product,
  onAdd,
}: {
  product: ShopifyProduct;
  onAdd: (p: ShopifyProduct) => void;
}) {
  const router = useRouter();
  const { products: catalogo } = useProducts();

  /* Sugestoes tiradas do catalogo real: uma peca de cada linha diferente da
     que o cliente esta vendo, priorizando o que tem estoque. */
  const picks = useMemo(() => {
    const linhaAtual = (product.productType || "").trim().toLowerCase();
    const candidatos = catalogo.filter((p) => p.handle !== product.handle && p.images.length > 0);

    const out: ShopifyProduct[] = [];
    const linhasUsadas = new Set<string>();

    const ordenados = [...candidatos].sort((a, b) => {
      const aOutra = (a.productType || "").trim().toLowerCase() !== linhaAtual ? 0 : 1;
      const bOutra = (b.productType || "").trim().toLowerCase() !== linhaAtual ? 0 : 1;
      if (aOutra !== bOutra) return aOutra - bOutra;
      const aEstoque = a.variants.some((v) => v.available) ? 0 : 1;
      const bEstoque = b.variants.some((v) => v.available) ? 0 : 1;
      return aEstoque - bEstoque;
    });

    for (const p of ordenados) {
      const linha = (p.productType || "").trim().toLowerCase();
      if (linhasUsadas.has(linha)) continue;
      linhasUsadas.add(linha);
      out.push(p);
      if (out.length === 3) break;
    }

    /* Se a loja so tiver uma linha cadastrada, completa com o que houver. */
    if (out.length < 3) {
      for (const p of ordenados) {
        if (out.some((o) => o.handle === p.handle)) continue;
        out.push(p);
        if (out.length === 3) break;
      }
    }

    return out;
  }, [product, catalogo]);

  if (picks.length === 0) return null;

  return (
    <div style={{ borderTop: "1px solid rgba(10,10,10,0.06)", padding: "clamp(40px,6vw,72px) 0" }}>
      <div className="container-fbg" style={{ padding: "0 1.5rem" }}>
        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B0864A", display: "block", marginBottom: "6px", fontFamily: FONT }}>
          Complete o look
        </span>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: "clamp(1.4rem,2.8vw,2rem)", letterSpacing: "-0.03em", textTransform: "uppercase", color: "#0E0E0E", margin: "0 0 clamp(20px,3vw,32px)", lineHeight: 1 }}>
          Combina com essa peça
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "clamp(12px,2vw,20px)" }}>
          {picks.map((p) => {
            const img = p.images[0];
            const price = parseFloat(p.variants[0]?.price ?? "0").toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            return (
              <div
                key={p.handle}
                style={{ background: "#FFFFFF", border: "1px solid rgba(10,10,10,0.06)", overflow: "hidden", transition: "border-color 0.3s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(176,134,74,0.4)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(10,10,10,0.06)")}
              >
                <button
                  onClick={() => router.push(`/produtos/${p.handle}`)}
                  style={{ display: "block", width: "100%", position: "relative", aspectRatio: "3/4", background: "#F1EFEA", border: "none", cursor: "pointer", padding: 0, overflow: "hidden" }}
                >
                  {img && (
                    <Image src={img.src} alt={p.title} fill sizes="(max-width: 640px) 90vw, 30vw" style={{ objectFit: "cover", objectPosition: "center top" }} />
                  )}
                </button>
                <div style={{ padding: "14px 16px 16px" }}>
                  <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: "0.82rem", color: "#0E0E0E", margin: "0 0 4px", lineHeight: 1.3 }}>{p.title}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: "0.85rem", color: "#B0864A" }}>{price}</span>
                    <button
                      onClick={() => onAdd(p)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        background: "transparent",
                        border: "1px solid rgba(176,134,74,0.5)",
                        color: "#B0864A",
                        fontSize: "0.56rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: FONT,
                        transition: "background 0.25s ease, color 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#B0864A";
                        el.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "transparent";
                        el.style.color = "#B0864A";
                      }}
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   WHATSAPP FLUTUANTE — com contexto da peça
══════════════════════════════════════════════════════════ */
export function FloatingWhatsApp({ product }: { product: ShopifyProduct }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(id);
  }, []);

  const msg = `Olá! Tenho interesse na ${product.title} (${product.productType}).`;

  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => navigator.clipboard.writeText(msg).catch(() => {})}
      aria-label={`Falar no WhatsApp sobre ${product.title}`}
      className="fbg-wa-float"
      style={{
        position: "fixed",
        right: "clamp(14px,3vw,28px)",
        bottom: "calc(clamp(14px,3vw,28px) + env(safe-area-inset-bottom, 0px))",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "13px 16px",
        background: "#FFFFFF",
        border: "1px solid rgba(176,134,74,0.5)",
        borderRadius: "100px",
        color: "#141414",
        textDecoration: "none",
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        transform: visible ? "translateY(0)" : "translateY(80px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#B0864A">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.841 1.26c-1.514.867-2.748 2.052-3.626 3.477-.878 1.425-1.337 3.012-1.336 4.635.001 1.592.315 3.138.926 4.56l-1.056 3.842 3.95-1.041c1.334.716 2.823 1.095 4.337 1.096h.004c5.098 0 9.237-4.14 9.237-9.238 0-2.468-.987-4.787-2.779-6.532-1.79-1.745-4.112-2.706-6.612-2.706" />
      </svg>
      <span
        className="fbg-wa-label"
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily: FONT,
          whiteSpace: "nowrap",
        }}
      >
        Falar sobre esta peça
      </span>
      <style>{`
        @media (max-width: 640px) {
          .fbg-wa-label { display: none; }
          .fbg-wa-float { padding: 14px !important; }
        }
      `}</style>
    </a>
  );
}
