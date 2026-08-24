"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import SearchOverlay from "@/components/SearchOverlay";
import { useCart } from "@/context/CartContext";

/* ─── Estrutura do menu ────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Coleção",      href: "/colecao", mega: true },
  { label: "O Movimento",  href: "/movimento" },
  { label: "Parceiros",    href: "/parceiros" },
  { label: "Revendedores", href: "/revendedores" },
];

/* ─── Mega menu: categorias com foto (catálogo Junho 2026) ── */
const MEGA_CATEGORIES = [
  { label: "Calças",   count: 27, href: "/colecao?categoria=calca",   img: "/images/campaign/dsc01573.jpg" },
  { label: "Bermudas", count: 14, href: "/colecao?categoria=bermuda", img: "/images/campaign/dsc01800.jpg" },
  { label: "Jaquetas", count: 4,  href: "/colecao?categoria=jaqueta", img: "/images/campaign/dsc01662.jpg" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [hidden, setHidden]       = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen]   = useState(false);
  const lastScrollY               = useRef(0);
  const pathname                  = usePathname();
  const onContaPage               = pathname === "/conta";
  const { count, openDrawer }     = useCart();

  /* Detecta direção e posição do scroll */
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;

      setScrolled(y > 40);

      // Esconde ao rolar pra baixo, mostra ao rolar pra cima
      if (y > lastScrollY.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava scroll do body quando menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Fecha o menu sempre que a rota mudar (garante fechamento mesmo se onClick falhar no iOS)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMenuOpen(false);
      setMegaOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <>
      <header
        onMouseLeave={() => setMegaOpen(false)}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-black/[0.08]"
            : "bg-gradient-to-b from-black/70 via-black/30 to-transparent border-b-0"}
          ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <AnnouncementBar scrolled={scrolled} />
        <nav className="container-fbg flex items-center justify-between h-16 md:h-20">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex flex-col leading-none select-none group"
            aria-label="FBG Jeans · Página inicial"
          >
            <FBGLogo dark={scrolled} />
          </Link>

          {/* ── Links desktop ────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li
                key={link.href}
                onMouseEnter={() => setMegaOpen(Boolean(link.mega))}
              >
                <Link
                  href={link.href}
                  className={`
                    relative text-[11px] font-semibold tracking-[0.18em] uppercase
                    transition-colors duration-300
                    after:absolute after:bottom-0 after:left-0
                    after:h-[1px] after:w-0 after:bg-[#B59672]
                    after:transition-[width] after:duration-300
                    hover:after:w-full
                    ${scrolled
                      ? "text-black/70 hover:text-black"
                      : "text-white hover:text-white"}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Ações direita ─────────────────────────────────── */}
          <div className="flex items-center gap-5">

            {/* Ícone de busca */}
            <button
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
              className={`hidden md:flex transition-colors duration-300 ${scrolled ? "text-black/60 hover:text-black" : "text-white/65 hover:text-white"}`}
            >
              <SearchIcon />
            </button>

            {/* Ícone de conta */}
            <Link
              href="/conta"
              aria-label="Minha conta"
              className={`flex transition-colors duration-300 ${onContaPage ? "text-[#B59672]" : scrolled ? "text-black/60 hover:text-black" : "text-white/65 hover:text-white"}`}
            >
              <PersonIcon />
            </Link>

            {/* Ícone de carrinho */}
            <button
              aria-label="Carrinho de compras"
              onClick={openDrawer}
              className={`relative transition-colors duration-300 ${scrolled ? "text-black/60 hover:text-black" : "text-white/65 hover:text-white"}`}
            >
              <CartIcon />
              {count > 0 && (
                <span className="
                  absolute -top-1.5 -right-1.5
                  w-4 h-4 rounded-full bg-[#6B2033]
                  text-[9px] font-bold text-white
                  flex items-center justify-center
                  leading-none
                ">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Botão hamburguer mobile */}
            <button
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-[5px] p-1 group"
            >
              <span className={`block h-[1.5px] w-6 origin-center transition-all duration-300 ${scrolled ? "bg-black" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block h-[1.5px] origin-center transition-all duration-300 ${scrolled ? "bg-black" : "bg-white"} ${menuOpen ? "w-0 opacity-0" : "w-6 opacity-100"}`} />
              <span className={`block h-[1.5px] w-6 origin-center transition-all duration-300 ${scrolled ? "bg-black" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </nav>

        {/* ── Mega menu Coleção (desktop) ─────────────────────── */}
        <div
          className="hidden md:block"
          onMouseLeave={() => setMegaOpen(false)}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(16px)",
            borderBottom: megaOpen ? "1px solid rgba(0,0,0,0.09)" : "none",
            overflow: "hidden",
            maxHeight: megaOpen ? "420px" : "0px",
            opacity: megaOpen ? 1 : 0,
            transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
            pointerEvents: megaOpen ? "auto" : "none",
          }}
        >
          <div
            className="container-fbg"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr) 220px",
              gap: "16px",
              padding: "28px 0 32px",
              alignItems: "stretch",
            }}
          >
            {MEGA_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMegaOpen(false)}
                style={{
                  position: "relative",
                  display: "block",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.09)",
                  textDecoration: "none",
                  opacity: megaOpen ? 1 : 0,
                  transform: megaOpen ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.4s ease ${0.08 + i * 0.06}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.06}s`,
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  sizes="30vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%)" }} />
                <div style={{ position: "absolute", left: "16px", right: "16px", bottom: "14px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em", textTransform: "uppercase", color: "#111" }}>
                    {cat.label}
                  </span>
                  <span style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.14em", color: "#B59672" }}>
                    {cat.count} REFS
                  </span>
                </div>
              </Link>
            ))}

            {/* Coluna ver tudo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "6px 0 4px 8px",
                opacity: megaOpen ? 1 : 0,
                transition: "opacity 0.4s ease 0.26s",
              }}
            >
              <div>
                <span style={{ display: "block", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: "10px", fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                  Catálogo Junho 2026
                </span>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "rgba(0,0,0,0.50)", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
                  45 referências oficiais. Denim premium, desde 2013.
                </p>
              </div>
              <Link
                href="/colecao"
                onClick={() => setMegaOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#B59672",
                  textDecoration: "none",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                }}
              >
                Ver coleção completa
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Menu mobile (drawer fullscreen) ───────────────────── */}
      <div
        className={`fixed inset-0 z-40 flex flex-col transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "#FFFFFF" }}
        aria-hidden={!menuOpen}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          height: "72px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}>
          <FBGLogo dark={true} />
          <button
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            style={{ color: "rgba(0,0,0,0.45)", padding: "10px", lineHeight: 0 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links principais */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 0",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                textDecoration: "none",
                transform: menuOpen ? "translateX(0)" : "translateX(-28px)",
                opacity: menuOpen ? 1 : 0,
                transition: `transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.06 + i * 0.07}s, opacity 0.4s ease ${0.06 + i * 0.07}s`,
              }}
            >
              <span style={{
                fontSize: "clamp(2rem, 9vw, 3rem)",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#111",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                lineHeight: 1.04,
              }}>
                {link.label}
              </span>
              <span style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#B59672",
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>

        {/* Rodapé */}
        <div style={{
          padding: "24px 28px 40px",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          flexShrink: 0,
          opacity: menuOpen ? 1 : 0,
          transition: "opacity 0.4s ease 0.28s",
        }}>
          <div style={{ display: "flex", gap: "28px", marginBottom: "20px" }}>
            {[
              { label: "Minha conta",     href: "/conta" },
              { label: "Rastrear pedido", href: "/rastrear-pedido" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.40)",
                  textDecoration: "none",
                  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p style={{
            fontSize: "0.55rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.20)",
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          }}>
            Liberdade que se veste. Qualidade que se sente. Desde 2013
          </p>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/* ─── Logo oficial FBG (rebranding Baza Brands 2026) ─────── */
function FBGLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-col items-start select-none">
      <Image
        src="/images/logo-fbg-white.png"
        alt="FBG Jeans Wear"
        width={96}
        height={33}
        priority
        style={{ width: "clamp(64px, 8vw, 88px)", height: "auto", filter: dark ? "invert(1)" : "none", transition: "filter 0.3s ease" }}
      />
      <span
        className="font-semibold tracking-[0.24em] leading-none mt-1"
        style={{ fontSize: "0.42rem", color: dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)", transition: "color 0.3s ease" }}
      >
        FREEBONG · JEANS WEAR
      </span>
    </div>
  );
}

/* ─── Ícones ──────────────────────────────────────────────── */
function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
