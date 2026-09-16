"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProduct";
import { useProducts } from "@/lib/hooks/useProducts";
import type { ShopifyProductVariant } from "@/lib/hooks/useProducts";
import Footer from "@/components/Footer";
import ProductGallery3D from "@/components/ProductGallery3D";
import { SizeGuideModal, TrustBadges, CompleteLook } from "@/components/ProductExtras";
import { useCart } from "@/context/CartContext";
import { linkWhatsApp } from "@/lib/whatsapp";

/* ─── Helpers ──────────────────────────────────────────── */
function formatPrice(price: string) {
  return parseFloat(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ─── Componente de acordeão (detalhes) ────────────────── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(10,10,10,0.07)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(10,10,10,0.55)",
        }}
      >
        {title}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s ease", flexShrink: 0 }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "400px" : "0",
          transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ paddingBottom: "16px", color: "rgba(10,10,10,0.38)", fontSize: "0.82rem", lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── PÁGINA PRINCIPAL ──────────────────────────────────── */
export default function ProdutoPage() {
  const params  = useParams();
  const router  = useRouter();
  const handle  = typeof params.handle === "string" ? params.handle : "";

  const { product, loading } = useProduct(handle);
  const { products: catalogo } = useProducts();
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  /* Seleciona primeiro variant disponível ao carregar */
  useEffect(() => {
    if (product) {
      const first = product.variants.find(v => v.available) ?? product.variants[0];
      const id = requestAnimationFrame(() => setSelectedVariant(first ?? null));
      return () => cancelAnimationFrame(id);
    }
  }, [product]);

  function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.available || !product) return;
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: selectedVariant.price,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      imageSrc: product.images[0]?.src,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  /* Comprar agora: monta o pedido e abre o WhatsApp comercial */
  function handleBuyNow() {
    if (!selectedVariant || !selectedVariant.available || !product) return;
    const ref = product.productType || product.tags[0] || "";
    const msg =
      `Olá! Quero comprar:\n\n` +
      `▸ ${product.title}\n` +
      `▸ Referência: ${ref}\n` +
      `▸ Tamanho: ${selectedVariant.title}\n` +
      `▸ Valor: ${formatPrice(selectedVariant.price)}`;
    window.open(linkWhatsApp(msg), "_blank");
  }

  /* Produtos relacionados: vem do catalogo real da Shopify, mesma linha
     primeiro. Antes saiam de uma lista fixa no codigo, entao o cliente
     clicava e caia numa pagina de produto inexistente. */
  const linha = (product?.productType ?? "").trim().toLowerCase();
  const outros = catalogo.filter((p) => p.handle !== handle);
  const mesmaLinha = outros.filter((p) => p.productType.trim().toLowerCase() === linha && linha);
  const demais = outros.filter((p) => p.productType.trim().toLowerCase() !== linha || !linha);
  const related = [...mesmaLinha, ...demais].slice(0, 8);

  /* ── Loading ── */
  if (loading) {
    return (
      <main style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <div className="container-fbg" style={{ padding: "120px 1.5rem" }}>
          <div
            style={{
              display: "grid",
              gap: "64px",
              alignItems: "start",
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            <div style={{ aspectRatio: "3/4", background: "#FFFFFF", animation: "pulse 2s infinite" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "16px" }}>
              <div style={{ height: "12px", width: "30%", background: "#F1EFEA", borderRadius: "2px" }} />
              <div style={{ height: "40px", width: "70%", background: "#F1EFEA", borderRadius: "2px" }} />
              <div style={{ height: "24px", width: "25%", background: "#F1EFEA", borderRadius: "2px" }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Produto não encontrado ── */
  if (!product) {
    return (
      <main style={{ background: "#FFFFFF", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(10,10,10,0.25)", textTransform: "uppercase", marginBottom: "16px" }}>
            Produto não encontrado
          </p>
          <Link href="/" style={{ color: "#B0864A", fontSize: "0.8rem", textDecoration: "none", letterSpacing: "0.1em" }}>
            ← Voltar para a coleção
          </Link>
        </div>
      </main>
    );
  }

  const price     = selectedVariant ? formatPrice(selectedVariant.price) : "";
  const available = selectedVariant?.available ?? false;
  const norm      = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const isNew     = product.tags.some((t) => norm(t) === "novidade");

  /* A variante da Shopify vem como "Cor / Tamanho" ("Preto / 40"). Mostrar
     isso inteiro dentro do quadradinho fica ilegivel, entao cada opcao ganha
     a sua propria fileira: a de cor so aparece quando a peca tem mais de uma. */
  const duasOpcoes = (product.variants[0]?.selectedOptions.length ?? 0) >= 2;
  const corDe = (v: ShopifyProductVariant) =>
    duasOpcoes ? (v.selectedOptions[0]?.value ?? "") : "";
  const tamanhoDe = (v: ShopifyProductVariant) =>
    v.selectedOptions.length
      ? (v.selectedOptions[v.selectedOptions.length - 1]?.value ?? v.title)
      : v.title;

  const cores = Array.from(new Set(product.variants.map(corDe))).filter(Boolean);
  const corAtual = selectedVariant ? corDe(selectedVariant) : cores[0] ?? "";
  const variantesVisiveis = cores.length > 1
    ? product.variants.filter((v) => corDe(v) === corAtual)
    : product.variants;

  /* Ficha técnica extraída da descrição do catálogo */
  /* Ficha tecnica montada com o que a Shopify realmente tem cadastrado.
     Campo sem informacao na loja simplesmente nao aparece, em vez de exibir
     um valor inventado. */
  const composicao = product.description.match(/Composição: ([^.]+)\./)?.[1] ?? null;
  const referencia = product.variants.find(v => v.sku)?.sku ?? "";
  const MODELAGENS = ["skinny", "slim", "reta", "wide", "cargo", "sport fino", "alfaiataria"];
  const alvoModelagem = [product.title, ...product.tags].map(norm).join(" ");
  const modelagem  = MODELAGENS.find(m => alvoModelagem.includes(norm(m)));
  const modLabel   = modelagem ? modelagem.replace(/^\w/, c => c.toUpperCase()) : "";
  const pronta     = product.variants.some(v => v.available);

  const specs = [
    { label: "Referência",      value: referencia },
    { label: "Modelagem",       value: modLabel },
    { label: "Disponibilidade", value: pronta ? "Pronta entrega" : "" },
    { label: "Composição",      value: composicao ?? "" },
    { label: "Categoria",       value: product.productType },
  ].filter((s) => s.value);

  return (
    <main style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "clamp(96px, 12vw, 124px)", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>

      {/* ── Breadcrumb (o paddingTop acima reserva o espaço do cabeçalho fixo,
             senão ele fica por cima desta linha) ─────────── */}
      <div>
        <div className="container-fbg" style={{ padding: "16px 1.5rem" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {[
              { label: "Início",   href: "/" },
              { label: "Coleção", href: "/colecao" },
              { label: product.title },
            ].map((crumb, i, arr) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(10,10,10,0.28)", textDecoration: "none", textTransform: "uppercase" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.6)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.28)")}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(10,10,10,0.55)", textTransform: "uppercase" }}>
                    {crumb.label}
                  </span>
                )}
                {i < arr.length - 1 && (
                  <span style={{ color: "rgba(10,10,10,0.15)", fontSize: "0.6rem" }}>›</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Conteúdo principal ───────────────────────────── */}
      <div className="container-fbg" style={{ padding: "clamp(40px,6vw,80px) 1.5rem" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: "clamp(40px,6vw,80px)", alignItems: "start" }}
        >

          {/* ── Galeria 3D — flip frente/costas + lupa de tecido ── */}
          <ProductGallery3D product={product} isNew={isNew} />

          {/* ── Informações ──────────────────────────────── */}
          <div style={{ paddingTop: "8px" }}>

            {/* Tipo */}
            <span
              style={{
                fontSize: "clamp(0.65rem, 1.8vw, 0.85rem)",
                fontWeight: 800,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#B0864A",
                display: "block",
                marginBottom: "16px",
              }}
            >
              {product.productType}
            </span>

            {/* Nome */}
            <h1
              style={{
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(2.2rem,4.5vw,3.6rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textTransform: "uppercase",
                color: "#0E0E0E",
                marginBottom: "24px",
              }}
            >
              {product.title}
            </h1>

            {/* Linha decorativa */}
            <div
              style={{
                width: "36px",
                height: "2px",
                background: "linear-gradient(90deg,#B0864A,#6B2033)",
                marginBottom: "20px",
              }}
            />

            {/* Preço */}
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  fontSize: "clamp(2rem,3.5vw,2.8rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: available ? "#B0864A" : "rgba(10,10,10,0.3)",
                  display: "block",
                }}
              >
                {price}
              </span>
              {!available && (
                <span
                  style={{
                    display: "block",
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(10,10,10,0.25)",
                    marginTop: "4px",
                  }}
                >
                  Esgotado
                </span>
              )}
            </div>

            {/* Seletor de tamanho — MELHORADO */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
                    fontWeight: 900,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#0E0E0E",
                  }}
                >
                  Escolha seu tamanho
                  {selectedVariant && (
                    <span style={{ color: "#B0864A", marginLeft: "12px", fontSize: "1.1em" }}>
                      {tamanhoDe(selectedVariant)}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  style={{
                    fontSize: "clamp(0.65rem, 1.8vw, 0.8rem)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#B0864A",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    transition: "opacity 0.2s",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  Guia de tamanhos
                </button>
              </div>

              {cores.length > 1 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {cores.map((c) => {
                    const ativa = c === corAtual;
                    const disponivel = product.variants.some((v) => corDe(v) === c && v.available);
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          const alvo =
                            product.variants.find((v) => corDe(v) === c && v.available) ??
                            product.variants.find((v) => corDe(v) === c);
                          if (alvo) setSelectedVariant(alvo);
                        }}
                        disabled={!disponivel}
                        style={{
                          padding: "9px 16px",
                          border: `1.5px solid ${ativa ? "#B0864A" : "rgba(10,10,10,0.15)"}`,
                          background: ativa ? "rgba(176,134,74,0.1)" : "transparent",
                          color: !disponivel ? "rgba(10,10,10,0.25)" : ativa ? "#B0864A" : "rgba(10,10,10,0.65)",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          fontFamily: "inherit",
                          borderRadius: "4px",
                          cursor: disponivel ? "pointer" : "not-allowed",
                          transition: "all 0.25s ease",
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {variantesVisiveis.map((v) => {
                  const isSelected = v.id === selectedVariant?.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => v.available && setSelectedVariant(v)}
                      disabled={!v.available}
                      style={{
                        width: "clamp(52px, 12vw, 72px)",
                        height: "clamp(52px, 12vw, 72px)",
                        border: `2px solid ${isSelected ? "#B0864A" : v.available ? "rgba(10,10,10,0.15)" : "rgba(10,10,10,0.08)"}`,
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(176,134,74,0.15) 0%, rgba(107,32,51,0.08) 100%)"
                          : "rgba(10,10,10,0.02)",
                        color: !v.available
                          ? "rgba(10,10,10,0.12)"
                          : isSelected
                          ? "#B0864A"
                          : "rgba(10,10,10,0.6)",
                        fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                        fontWeight: 800,
                        fontFamily: "inherit",
                        cursor: v.available ? "pointer" : "not-allowed",
                        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                        position: "relative",
                        borderRadius: "4px",
                        boxShadow: isSelected ? "0 8px 20px rgba(176,134,74,0.25)" : "none",
                      }}
                      onMouseEnter={e => {
                        if (v.available && !isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = "#B0864A";
                          (e.currentTarget as HTMLElement).style.color = "#0E0E0E";
                          (e.currentTarget as HTMLElement).style.background = "rgba(176,134,74,0.08)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (v.available && !isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,10,10,0.15)";
                          (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.6)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,0.02)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {tamanhoDe(v)}
                      {/* Linha cruzada para esgotado */}
                      {!v.available && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                          }}
                        >
                          <div style={{ width: "100%", height: "1px", background: "rgba(10,10,10,0.1)", transform: "rotate(-45deg)" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── CTAs ────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>

              {/* COMPRAR AGORA — primário */}
              <button
                onClick={handleBuyNow}
                disabled={!available}
                className="fbg-cta-primary"
                style={{
                  width: "100%",
                  padding: "20px",
                  background: available ? "#6B2033" : "rgba(10,10,10,0.06)",
                  color: available ? "#FFFFFF" : "rgba(10,10,10,0.25)",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                  fontSize: "clamp(0.72rem, 1.5vw, 0.82rem)",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: available ? "pointer" : "not-allowed",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease",
                }}
                onMouseEnter={e => {
                  if (!available) return;
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 14px 34px -12px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "none";
                  el.style.boxShadow = "none";
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>Comprar agora</span>
              </button>

              {/* ADICIONAR AO CARRINHO — secundário */}
              <button
                onClick={handleAddToCart}
                disabled={!available}
                style={{
                  width: "100%",
                  padding: "19px",
                  background: addedToCart ? "rgba(176,134,74,0.12)" : "transparent",
                  border: `1.5px solid ${addedToCart ? "#B0864A" : available ? "rgba(10,10,10,0.18)" : "rgba(10,10,10,0.08)"}`,
                  borderRadius: "4px",
                  color: addedToCart ? "#B0864A" : available ? "#141414" : "rgba(10,10,10,0.25)",
                  fontFamily: "inherit",
                  fontSize: "clamp(0.7rem, 1.4vw, 0.78rem)",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: available ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "border-color 0.3s ease, background 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={e => {
                  if (!available || addedToCart) return;
                  (e.currentTarget as HTMLElement).style.borderColor = "#B0864A";
                }}
                onMouseLeave={e => {
                  if (addedToCart) return;
                  (e.currentTarget as HTMLElement).style.borderColor = available ? "rgba(10,10,10,0.18)" : "rgba(10,10,10,0.08)";
                }}
              >
                {addedToCart ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Adicionado ao carrinho
                  </>
                ) : (
                  "Adicionar ao carrinho"
                )}
              </button>
            </div>

            {/* Selos de confiança */}
            <TrustBadges />

            {/* ── Descrição limpa (sem a linha de metadados) ── */}
            {product.description && (
              <p
                style={{
                  fontSize: "clamp(0.92rem, 1.6vw, 1.02rem)",
                  lineHeight: 1.8,
                  color: "rgba(20,20,20,0.6)",
                  margin: "0 0 28px",
                  maxWidth: "48ch",
                  textWrap: "pretty",
                }}
              >
                {product.description.split(" Referência:")[0]}
              </p>
            )}

            {/* ── Ficha técnica em grid ── */}
            <div className="fbg-specs">
              {specs.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(10,10,10,0.12)",
                    animation: `fbgCascade 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both`,
                  }}
                >
                  <span style={{ display: "block", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(20,20,20,0.38)", marginBottom: "7px" }}>
                    {s.label}
                  </span>
                  <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#141414", lineHeight: 1.4 }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Acordeões de detalhes */}
            <div style={{ borderTop: "1px solid rgba(10,10,10,0.1)", marginTop: "32px" }}>
              <Accordion title="Composição & Tecido">
                {composicao ?? "Denim premium com acabamento e lavagem controlados."} Trama trabalhada
                para durabilidade e toque macio ao longo do uso.
              </Accordion>
              <Accordion title="Guia de Lavagem">
                Lavar à mão ou na máquina em ciclo delicado até 30°C. Não usar alvejante.
                Secar à sombra. Não torcer.
              </Accordion>
              <Accordion title="Entrega & Frete">
                Envio para todo o Brasil via Correios ou transportadora. Prazo de 3 a 8 dias úteis.
                Frete grátis acima de R$ 299.
              </Accordion>
              <Accordion title="Troca & Devolução">
                Troca garantida em até 30 dias após o recebimento. Produto deve estar sem uso
                e com etiqueta original.
              </Accordion>
            </div>

            <style>{`
              .fbg-specs {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 18px 20px;
              }
              @media (min-width: 520px) {
                .fbg-specs { grid-template-columns: repeat(3, 1fr); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* ── Complete o look ───────────────────────────────── */}
      <CompleteLook
        product={product}
        onAdd={(p) => {
          const v = p.variants.find(vv => vv.available) ?? p.variants[0];
          if (!v) return;
          addItem({
            id: p.id,
            handle: p.handle,
            title: p.title,
            price: v.price,
            variantId: v.id,
            variantTitle: v.title,
            imageSrc: p.images[0]?.src,
          });
        }}
      />

      {/* ── Guia de medidas ───────────────────────────────── */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.tags.includes("jaqueta") ? "jaqueta" : product.tags.includes("bermuda") ? "bermuda" : "calca"}
      />

      {/* ── Produtos relacionados ─────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(10,10,10,0.06)",
          padding: "clamp(48px,7vw,80px) 0",
        }}
      >
        <div className="container-fbg" style={{ padding: "0 1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "clamp(24px,4vw,40px)",
              borderBottom: "1px solid rgba(10,10,10,0.07)",
              paddingBottom: "16px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(10,10,10,0.25)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Continue explorando
              </span>
              <h2
                style={{
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem,2.8vw,2rem)",
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "#0E0E0E",
                  lineHeight: 1.04,
                }}
              >
                Mais da coleção
              </h2>
            </div>
            <Link
              href="/colecao"
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#B0864A",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Ver tudo →
            </Link>
          </div>

          {/* Grid de relacionados */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            style={{ gap: "clamp(12px,2vw,20px)" }}
          >
            {related.map((p) => {
              const variantPrice = p.variants[0]
                ? formatPrice(p.variants[0].price)
                : "Sob consulta";
              return (
                <article
                  key={p.id}
                  onClick={() => router.push(`/produtos/${p.handle}`)}
                  style={{
                    cursor: "pointer",
                    background: "#FFFFFF",
                    border: "1px solid rgba(10,10,10,0.06)",
                    transition: "border-color 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(176,134,74,0.4)";
                    el.style.transform = "translateY(-3px)";
                    const im = el.querySelector(".fbg-rel-img") as HTMLElement | null;
                    if (im) im.style.transform = "scale(1.06)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(10,10,10,0.06)";
                    el.style.transform = "none";
                    const im = el.querySelector(".fbg-rel-img") as HTMLElement | null;
                    if (im) im.style.transform = "scale(1)";
                  }}
                >
                  {/* Foto da peça */}
                  <div style={{ position: "relative", aspectRatio: "3/4", background: "#F1EFEA", overflow: "hidden" }}>
                    {p.images[0] ? (
                      <Image
                        src={p.images[0].src}
                        alt={p.images[0].altText ?? p.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="fbg-rel-img"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center top",
                          transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontWeight: 900,
                            fontStyle: "italic",
                            fontSize: "clamp(1.8rem,4vw,2.8rem)",
                            letterSpacing: "-0.04em",
                            WebkitTextStroke: "1px rgba(176,134,74,0.18)",
                            color: "transparent",
                          }}
                        >
                          FBG
                        </span>
                        <span style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: "rgba(10,10,10,0.25)", textTransform: "uppercase" }}>
                          {p.productType}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "14px 16px 16px" }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "rgba(10,10,10,0.75)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                        marginBottom: "8px",
                      }}
                      className="line-clamp-2"
                    >
                      {p.title}
                    </p>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0E0E0E" }}>
                      {variantPrice}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
