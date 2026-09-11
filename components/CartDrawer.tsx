"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { linkWhatsApp, mensagemPedido } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, count, drawerOpen, closeDrawer, removeItem, updateQty } = useCart();

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

            {/* O pedido e fechado pelo WhatsApp da Freebong: o link ja vai com a
                lista de pecas, tamanhos e total escritos na conversa. */}
            <a
              href={linkWhatsApp(mensagemPedido(items, total))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeDrawer}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                width: "100%", padding: "16px",
                background: "#25D366", border: "none", color: "#FFFFFF",
                fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                cursor: "pointer", textDecoration: "none",
                transition: "background 0.2s ease",
                borderRadius: "2px", marginBottom: "10px",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#20BD5A"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#25D366"}
            >
              <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              Finalizar pedido no WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
