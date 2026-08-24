"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, count, drawerOpen, closeDrawer, removeItem, updateQty, checkout, checkingOut } = useCart();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed", inset: 0, zIndex: 900,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 910,
        width: "min(420px, 100vw)",
        background: "#FAF9F7",
        borderLeft: "1px solid rgba(10,10,10,0.07)",
        display: "flex", flexDirection: "column",
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(10,10,10,0.07)",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900, fontStyle: "italic",
              fontSize: "1.1rem", letterSpacing: "-0.02em",
              textTransform: "uppercase", color: "#0E0E0E", lineHeight: 1, margin: 0,
            }}>
              Carrinho
            </h2>
            {count > 0 && (
              <p style={{ fontSize: "0.62rem", color: "rgba(10,10,10,0.35)", marginTop: "3px", letterSpacing: "0.08em", margin: 0 }}>
                {count} {count === 1 ? "item" : "itens"}
              </p>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Fechar carrinho"
            style={{
              background: "none", border: "none",
              color: "rgba(10,10,10,0.4)", cursor: "pointer",
              padding: "8px", lineHeight: 0,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0E0E0E"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.4)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: items.length ? "0" : "48px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                border: "1px solid rgba(10,10,10,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(10,10,10,0.35)", marginBottom: "20px" }}>
                Seu carrinho está vazio
              </p>
              <button
                onClick={closeDrawer}
                style={{
                  background: "#0E0E0E", border: "none",
                  padding: "12px 24px", cursor: "pointer",
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  color: "#FFFFFF", transition: "background 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#B59672"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#0E0E0E"}
              >
                Ver coleção
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map(item => (
                <li key={item.variantId} style={{
                  display: "flex", gap: "14px",
                  padding: "18px 24px",
                  borderBottom: "1px solid rgba(10,10,10,0.06)",
                }}>
                  <div style={{ width: "72px", flexShrink: 0, aspectRatio: "3/4", background: "#F1EFEA", overflow: "hidden", position: "relative" }}>
                    {item.imageSrc ? (
                      <Image src={item.imageSrc} alt={item.title} fill sizes="72px" style={{ objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 900, fontStyle: "italic", color: "rgba(10,10,10,0.12)", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>FBG</span>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0E0E0E", lineHeight: 1.3, fontFamily: "'Helvetica Neue', Helvetica, sans-serif", margin: 0 }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "0.62rem", color: "rgba(10,10,10,0.35)", letterSpacing: "0.06em", margin: 0 }}>
                      <span style={{ color: "rgba(10,10,10,0.2)", marginRight: "4px" }}>TAM</span>{item.variantTitle}
                    </p>
                    <p style={{ fontSize: "0.84rem", fontWeight: 800, color: "#B59672", letterSpacing: "-0.01em", fontFamily: "'Helvetica Neue', Helvetica, sans-serif", marginTop: "2px", marginBottom: 0 }}>
                      {parseFloat(item.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(10,10,10,0.12)" }}>
                        <button
                          onClick={() => item.quantity > 1 && updateQty(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: item.quantity <= 1 ? "rgba(10,10,10,0.2)" : "rgba(10,10,10,0.5)", cursor: item.quantity <= 1 ? "default" : "pointer", fontSize: "1rem", lineHeight: 1 }}
                        >−</button>
                        <span style={{ width: "28px", textAlign: "center", fontSize: "0.78rem", color: "#0E0E0E", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.variantId, item.quantity + 1)}
                          style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "rgba(10,10,10,0.5)", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        style={{ background: "none", border: "none", color: "rgba(10,10,10,0.25)", cursor: "pointer", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif", padding: 0, transition: "color 0.2s ease" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.6)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.25)"}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px calc(32px + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid rgba(10,10,10,0.07)", flexShrink: 0 }}>
            {total < 299 && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "0.62rem", color: "rgba(10,10,10,0.35)", marginBottom: "6px", letterSpacing: "0.06em", margin: "0 0 6px" }}>
                  Falta <span style={{ color: "#B59672" }}>
                    {(299 - total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span> para frete grátis
                </p>
                <div style={{ height: "2px", background: "rgba(10,10,10,0.07)", borderRadius: "2px" }}>
                  <div style={{ height: "100%", borderRadius: "2px", background: "#B59672", width: `${Math.min((total / 299) * 100, 100)}%`, transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.62rem", color: "rgba(10,10,10,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                Total
              </span>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0E0E0E", letterSpacing: "-0.02em", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>

            <button
              onClick={checkout}
              disabled={checkingOut}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                width: "100%", padding: "16px",
                background: checkingOut ? "rgba(10,10,10,0.4)" : "#0E0E0E",
                border: "none", color: "#FFFFFF",
                fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                cursor: checkingOut ? "default" : "pointer",
                transition: "background 0.2s ease",
                borderRadius: "2px", marginBottom: "10px",
                boxSizing: "border-box",
              }}
            >
              {checkingOut ? "Carregando..." : "Finalizar compra →"}
            </button>

            <a
              href="https://wa.me/message/3ROGXK7TIP7TC1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                const msg = "Olá! Quero finalizar meu pedido FBG:\n\n" +
                  items.map(i => `• ${i.title} — ${i.variantTitle} × ${i.quantity}`).join("\n") +
                  `\n\nTotal: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
                navigator.clipboard.writeText(msg).catch(() => {});
              }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                width: "100%", padding: "12px",
                background: "#25D366", border: "none", color: "#FFFFFF",
                fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                cursor: "pointer", textDecoration: "none",
                transition: "background 0.2s ease",
                borderRadius: "2px", marginBottom: "10px",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#20BD5A"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#25D366"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.841 1.26c-1.514.867-2.748 2.052-3.626 3.477-.878 1.425-1.337 3.012-1.336 4.635.001 1.592.315 3.138.926 4.56l-1.056 3.842 3.95-1.041c1.334.716 2.823 1.095 4.337 1.096h.004c5.098 0 9.237-4.14 9.237-9.238 0-2.468-.987-4.787-2.779-6.532-1.79-1.745-4.112-2.706-6.612-2.706"/>
              </svg>
              Pedido via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
