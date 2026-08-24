"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "USE O CUPOM  BEMVINDO10  E GANHE 10% OFF NA PRIMEIRA COMPRA",
  "FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 299",
  "PREMIUM QUALITY SINCE 2013 · FBG JEANS WEAR",
];

export default function AnnouncementBar({ scrolled = false }: { scrolled?: boolean }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [closed, setClosed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("fbg_bar_closed") === "1";
  });

  useEffect(() => {
    if (closed) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setFading(false);
      }, 350);
    }, 4000);
    return () => clearInterval(id);
  }, [closed]);

  if (closed) return null;

  return (
    <div
      style={{
        background: scrolled ? "#0A0A0A" : "transparent",
        color: scrolled ? "#B59672" : "#fff",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.5s ease, color 0.5s ease",
      }}
    >
      <p
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: fading ? 0 : scrolled ? 1 : 0.65,
          transition: "opacity 0.35s ease",
        }}
      >
        {MESSAGES[index]}
      </p>
      <button
        onClick={() => { sessionStorage.setItem("fbg_bar_closed", "1"); setClosed(true); }}
        aria-label="Fechar barra"
        style={{
          position: "absolute",
          right: "16px",
          background: "none",
          border: "none",
          fontSize: "0.85rem",
          color: scrolled ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.8)",
          cursor: "pointer",
          lineHeight: 1.04,
          padding: "4px",
          transition: "color 0.5s ease",
          opacity: 0.85,
        }}
      >
        ✕
      </button>
    </div>
  );
}
