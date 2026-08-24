"use client";

import Link from "next/link";

const LINKS = [
  { num: "01", label: "Calça Reta",     href: "/colecao?categoria=calca" },
  { num: "02", label: "Calça Slim",     href: "/colecao?categoria=calca" },
  { num: "03", label: "Skinny",         href: "/colecao?categoria=calca" },
  { num: "04", label: "Bermudas",       href: "/colecao?categoria=bermuda" },
  { num: "05", label: "Jaquetas",       href: "/colecao?categoria=jaqueta" },
  { num: "06", label: "Fibra de Bambu", href: "/colecao" },
];

const FONT = "'Helvetica Neue', Helvetica, sans-serif";

export default function DiscoveryNav() {
  return (
    <nav
      aria-label="Explorar por categoria"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        borderBottom: "1px solid rgba(10,10,10,0.09)",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {LINKS.map(({ num, label, href }, i) => (
        <Link
          key={num}
          href={href}
          style={{
            display: "grid",
            minHeight: "clamp(80px, 10vw, 112px)",
            alignContent: "space-between",
            padding: "clamp(12px,1.8vw,18px) clamp(12px,1.8vw,20px)",
            borderLeft: i === 0 ? "none" : "1px solid rgba(10,10,10,0.08)",
            textDecoration: "none",
            color: "#141414",
            transition: "background 0.22s ease",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(181,150,114,0.06)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          <span
            style={{
              fontSize: "0.52rem",
              color: "rgba(10,10,10,0.28)",
              letterSpacing: "0.1em",
              fontFamily: FONT,
              fontWeight: 600,
            }}
          >
            {num}
          </span>
          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span
              style={{
                fontSize: "clamp(0.7rem, 1.2vw, 0.88rem)",
                fontWeight: 700,
                fontFamily: FONT,
                color: "#141414",
                lineHeight: 1.3,
              }}
            >
              {label}
            </span>
            <span style={{ color: "#B59672", fontSize: "0.75rem", flexShrink: 0, marginLeft: "6px" }}>→</span>
          </span>
        </Link>
      ))}

      <style>{`
        @media (max-width: 640px) {
          nav[aria-label="Explorar por categoria"] {
            grid-template-columns: repeat(6, minmax(100px, 1fr));
          }
        }
      `}</style>
    </nav>
  );
}
