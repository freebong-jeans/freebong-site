"use client";

import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";

export default function Catalog() {
  const { products, loading, error } = useProducts();
  const router = useRouter();

  function handleViewMore(product: ShopifyProduct) {
    router.push(`/produtos/${product.handle}`);
  }

  if (loading) {
    return (
      <section style={{ background: "#fff", borderTop: "1px solid #e8e3dc" }} className="w-full py-16">
        <div className="container-fbg">
          <CatalogHeader />
        </div>
        <div className="mt-10 flex md:grid md:container-fbg md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-0 overflow-x-auto md:overflow-x-visible px-4 md:px-0 pb-4 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 md:flex-shrink w-[82vw] sm:w-[56vw] md:w-auto">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ background: "#fff" }} className="w-full container-fbg py-24">
        <CatalogHeader />
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#B0864A" }}>Erro ao carregar</span>
          <p className="text-sm max-w-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
            {error.message || "Não foi possível buscar os produtos. Tente novamente em instantes."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase underline underline-offset-4"
            style={{ color: "#111" }}
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section style={{ background: "#fff" }} className="w-full container-fbg py-24">
        <CatalogHeader />
        <p className="mt-16 text-center text-sm tracking-wide" style={{ color: "rgba(0,0,0,0.35)" }}>
          Nenhum produto disponível no momento.
        </p>
      </section>
    );
  }

  return (
    <section style={{ background: "#fff", borderTop: "1px solid #e8e3dc" }} className="w-full py-0">
      <div className="container-fbg" style={{ paddingTop: "clamp(40px,6vw,64px)", paddingBottom: "clamp(24px,4vw,40px)" }}>
        <CatalogHeader count={products.length} />
      </div>

      {/* Grid — separadores entre cards estilo Shopify */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "#e8e3dc",
          borderTop: "1px solid #e8e3dc",
        }}
        className="md:grid hidden"
      >
        {products.map((product) => (
          <div key={product.id} style={{ background: "#fff" }}>
            <ProductCard product={product} onViewMore={handleViewMore} />
          </div>
        ))}
      </div>

      {/* Mobile: carrossel horizontal */}
      <div
        className="
          md:hidden
          flex overflow-x-auto snap-x snap-mandatory scroll-smooth
          gap-3 px-4 pb-4
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          mt-6
        "
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[75vw] snap-start">
            <ProductCard product={product} onViewMore={handleViewMore} />
          </div>
        ))}
      </div>

      <div className="container-fbg" style={{ paddingTop: "clamp(28px,4vw,48px)", paddingBottom: "clamp(40px,6vw,72px)", textAlign: "center" }}>
        <a
          href="/colecao"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px clamp(32px,5vw,56px)",
            background: "#fff",
            color: "#111",
            border: "1px solid #111",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#111"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "#111"; }}
        >
          Ver coleção completa
        </a>
      </div>
    </section>
  );
}

function CatalogHeader({ count }: { count?: number }) {
  return (
    <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "1px solid #e8e3dc", paddingBottom: "20px", gap: "16px", flexWrap: "wrap" }}>
      <div>
        <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B0864A", marginBottom: "6px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
          Coleção FBG
        </span>
        <h2 style={{ fontSize: "clamp(1.4rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, sans-serif", margin: 0, lineHeight: 1.1 }}>
          Todos os Produtos
        </h2>
      </div>
      {count !== undefined && (
        <span style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
          {count} {count === 1 ? "item" : "itens"}
        </span>
      )}
    </header>
  );
}

function SkeletonCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#fff" }}>
      <div style={{ aspectRatio: "3/4", width: "100%", background: "#F5F3F0", animation: "pulse 2s infinite" }} />
      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ height: "10px", width: "60%", background: "#F0EDE8", borderRadius: "2px" }} />
        <div style={{ height: "12px", width: "40%", background: "#E8E3DC", borderRadius: "2px" }} />
      </div>
    </div>
  );
}
