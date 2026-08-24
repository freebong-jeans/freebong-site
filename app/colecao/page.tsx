"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import CollectionHero from "@/components/CollectionHero";

/* ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all", label: "Todas as Peças" },
  { id: "calca", label: "Calças" },
  { id: "bermuda", label: "Bermudas" },
  { id: "jaqueta", label: "Jaquetas" },
];

const FITS = [
  { id: "all", label: "Todas as modelagens" },
  { id: "skinny", label: "Skinny" },
  { id: "slim", label: "Slim" },
  { id: "reta", label: "Reta" },
  { id: "wide", label: "Wide" },
  { id: "cargo", label: "Cargo" },
  { id: "sport-fino", label: "Sport Fino" },
  { id: "alfaiataria", label: "Alfaiataria" },
];

const AVAILABILITY = [
  { id: "all", label: "Toda disponibilidade" },
  { id: "pronta-entrega", label: "Pronta entrega" },
  { id: "programacao", label: "Programação" },
];

const PRICE_RANGES = [
  { id: "all", label: "Todos os preços" },
  { id: "0-200", label: "Até R$ 200" },
  { id: "200-300", label: "R$ 200 a R$ 300" },
  { id: "300-400", label: "R$ 300 a R$ 400" },
  { id: "400+", label: "Acima de R$ 400" },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Em destaque" },
  { id: "newest", label: "Mais novos" },
  { id: "price-asc", label: "Menor preço" },
  { id: "price-desc", label: "Maior preço" },
];

/* ─────────────────────────────────────────────────── */
export default function ColecaoPage() {
  return (
    <Suspense>
      <ColecaoContent />
    </Suspense>
  );
}

function ColecaoContent() {
  const { products, loading } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get("categoria");
    return CATEGORIES.find(c => c.id === cat) ? cat! : "all";
  });
  const [activePrice, setActivePrice] = useState("all");
  const [activeFit, setActiveFit] = useState("all");
  const [activeAvail, setActiveAvail] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat && CATEGORIES.find(c => c.id === cat)) {
      const id = requestAnimationFrame(() => setActiveCategory(cat));
      return () => cancelAnimationFrame(id);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter((p) => p.tags.includes(activeCategory));
    }

    if (activeFit !== "all") {
      result = result.filter((p) => p.tags.some((t) => t === activeFit || t === `bermuda-${activeFit}`));
    }

    if (activeAvail !== "all") {
      result = result.filter((p) => p.tags.includes(activeAvail));
    }

    if (activePrice !== "all") {
      result = result.filter((p) => {
        const price = parseFloat(p.variants[0]?.price ?? "0");
        if (activePrice === "0-200") return price <= 200;
        if (activePrice === "200-300") return price > 200 && price <= 300;
        if (activePrice === "300-400") return price > 300 && price <= 400;
        if (activePrice === "400+") return price > 400;
        return true;
      });
    }

    if (sort === "price-asc") {
      result.sort((a, b) => parseFloat(a.variants[0]?.price ?? "0") - parseFloat(b.variants[0]?.price ?? "0"));
    } else if (sort === "price-desc") {
      result.sort((a, b) => parseFloat(b.variants[0]?.price ?? "0") - parseFloat(a.variants[0]?.price ?? "0"));
    } else if (sort === "newest") {
      result = [...result].reverse();
    }

    return result;
  }, [products, activeCategory, activeFit, activeAvail, activePrice, sort]);

  /* Contagem por categoria (pra exibir nos chips) */
  const categoryCount = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const c of CATEGORIES) {
      if (c.id !== "all") map[c.id] = products.filter((p) => p.tags.includes(c.id)).length;
    }
    return map;
  }, [products]);

  const handleView = useCallback(
    (p: ShopifyProduct) => router.push(`/produtos/${p.handle}`),
    [router]
  );

  return (
    <div style={{ background: "#FAF9F7", color: "#141414", minHeight: "100vh" }}>
      {/* ── Hero cinematográfico ─────────────────────────────── */}
      <CollectionHero total={products.length} />

      {/* ═══════════════════════════════════════════════════════════
          FILTROS & CATEGORIAS
      ══════════════════════════════════════════════════════════════ */}
      <div id="grade" style={{ paddingTop: "clamp(32px, 5vw, 60px)", paddingBottom: "clamp(32px, 5vw, 60px)", borderBottom: "1px solid rgba(10,10,10,0.07)", scrollMarginTop: "80px" }}>
        <div className="container-fbg">
          {/* Categorias */}
          <div style={{ display: "flex", gap: "clamp(8px, 2vw, 16px)", marginBottom: "clamp(24px, 3vw, 40px)", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "clamp(10px, 1.5vw, 14px) clamp(20px, 3vw, 32px)",
                  background: activeCategory === cat.id ? "#141414" : "#F1EFEA",
                  color: activeCategory === cat.id ? "#FAF9F7" : "rgba(10,10,10,0.65)",
                  border: "1px solid rgba(10,10,10,0.08)",
                  borderRadius: "3px",
                  fontSize: "clamp(0.75rem, 1.4vw, 0.9rem)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat.id) {
                    (e.currentTarget as HTMLElement).style.background = "#E4E1DA";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat.id) {
                    (e.currentTarget as HTMLElement).style.background = "#F1EFEA";
                  }
                }}
                onTouchEnd={(e) => {
                  if (activeCategory !== cat.id) {
                    (e.currentTarget as HTMLElement).style.background = "#F1EFEA";
                  }
                }}
              >
                {cat.label}
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "0.68em",
                    fontWeight: 700,
                    color: activeCategory === cat.id ? "rgba(10,10,10,0.55)" : "#B59672",
                  }}
                >
                  {categoryCount[cat.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(16px, 2vw, 24px)" }}>
            {/* Modelagem */}
            <div>
              <select
                value={activeFit}
                onChange={(e) => setActiveFit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#FFFFFF",
                  border: `1px solid ${activeFit !== "all" ? "rgba(181,150,114,0.5)" : "rgba(10,10,10,0.12)"}`,
                  borderRadius: "3px",
                  fontSize: "0.8rem",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 500,
                  color: activeFit !== "all" ? "#B59672" : "#141414",
                  cursor: "pointer",
                }}
              >
                {FITS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilidade */}
            <div>
              <select
                value={activeAvail}
                onChange={(e) => setActiveAvail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#FFFFFF",
                  border: `1px solid ${activeAvail !== "all" ? "rgba(181,150,114,0.5)" : "rgba(10,10,10,0.12)"}`,
                  borderRadius: "3px",
                  fontSize: "0.8rem",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 500,
                  color: activeAvail !== "all" ? "#B59672" : "#141414",
                  cursor: "pointer",
                }}
              >
                {AVAILABILITY.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço */}
            <div>
              <select
                value={activePrice}
                onChange={(e) => setActivePrice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#FFFFFF",
                  border: "1px solid rgba(10,10,10,0.12)",
                  borderRadius: "3px",
                  fontSize: "0.8rem",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 500,
                  color: "#141414",
                  cursor: "pointer",
                }}
              >
                {PRICE_RANGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#FFFFFF",
                  border: "1px solid rgba(10,10,10,0.12)",
                  borderRadius: "3px",
                  fontSize: "0.8rem",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                  fontWeight: 500,
                  color: "#141414",
                  cursor: "pointer",
                }}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          GRID DE PRODUTOS
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ paddingTop: "clamp(48px, 7vw, 100px)", paddingBottom: "clamp(64px, 10vw, 120px)" }}>
        <div className="container-fbg">
          <p style={{ fontSize: "0.85rem", color: "rgba(10,10,10,0.45)", marginTop: 0, marginBottom: "clamp(28px, 4vw, 48px)" }}>
            {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {loading ? (
            /* Skeleton shimmer dourado */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px, 20vw, 200px), 1fr))", gap: "clamp(12px, 2vw, 24px)" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="fbg-shimmer" style={{ aspectRatio: "3/4" }} />
                  <div className="fbg-shimmer" style={{ height: "12px", width: "70%", marginTop: "12px" }} />
                  <div className="fbg-shimmer" style={{ height: "12px", width: "40%", marginTop: "8px" }} />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            /* key troca a cada filtro → cascata staggered de entrada */
            <div
              key={`${activeCategory}-${activeFit}-${activeAvail}-${activePrice}-${sort}`}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px, 20vw, 200px), 1fr))", gap: "clamp(12px, 2vw, 24px)" }}
            >
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  style={{ animation: `fbgCascade 0.55s cubic-bezier(0.16,1,0.3,1) ${Math.min(i, 14) * 45}ms both` }}
                >
                  <ProductCard
                    product={product}
                    onViewMore={() => handleView(product)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(10,10,10,0.4)" }}>
              <p style={{ fontSize: "1rem", marginBottom: "8px" }}>Nenhum produto encontrado</p>
              <p style={{ fontSize: "0.85rem" }}>Tente ajustar os filtros</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: "#F1EFEA", paddingTop: "clamp(64px, 10vw, 120px)", paddingBottom: "clamp(64px, 10vw, 120px)", borderTop: "1px solid rgba(10,10,10,0.07)" }}>
        <div className="container-fbg" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B59672", margin: 0, marginBottom: "12px" }}>
            Não achou o que procura?
          </p>
          <h2 style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#141414", textTransform: "uppercase", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
            Fale com um especialista
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(10,10,10,0.5)", maxWidth: "480px", margin: "0 auto 32px" }}>
            Nossa equipe está pronta para ajudar você a encontrar a peça perfeita ou tirar dúvidas.
          </p>
          <a
            href="https://wa.me/message/3ROGXK7TIP7TC1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "clamp(12px, 1.8vw, 16px) clamp(32px, 5vw, 56px)",
              background: "#141414",
              color: "#FAF9F7",
              textDecoration: "none",
              borderRadius: "3px",
              fontWeight: 700,
              fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              transition: "all 0.2s ease",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#B59672";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#141414";
            }}
          >
            Contatar via WhatsApp
            <span>→</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
