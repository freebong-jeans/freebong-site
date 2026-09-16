"use client";

/**
 * Reveal — sistema tipográfico FBG.
 * Anima por LINHA (máscara vertical), nunca por letra solta:
 * nada de palavra cortada no meio, nada de letra "espalhada".
 *
 *  <RevealLine>      → uma linha com máscara (uso geral)
 *  <RevealHeadline>  → título grande, linhas em cascata
 *  <RevealText>      → parágrafo com fade suave
 */

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export const HN = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* Observer compartilhado: dispara uma vez ao entrar na viewport */
export function useReveal(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, shown };
}

/* ══ Linha com máscara ══ */
export function RevealLine({
  children,
  shown,
  delay = 0,
  style,
}: {
  children: ReactNode;
  shown: boolean;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
      <span
        style={{
          display: "block",
          transform: shown ? "translateY(0)" : "translateY(105%)",
          transition: `transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          willChange: "transform",
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ══ Headline: array de linhas, cascata automática ══ */
export function RevealHeadline({
  lines,
  shown,
  size = "clamp(2rem, 5vw, 4.4rem)",
  baseDelay = 0,
  align = "left",
  style,
}: {
  lines: { text: string; color?: string; outline?: boolean }[];
  shown: boolean;
  size?: string;
  baseDelay?: number;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: HN,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.035em",
        lineHeight: 1.02,
        textTransform: "uppercase",
        margin: 0,
        textAlign: align,
        textWrap: "balance",
        ...style,
      }}
    >
      {lines.map((l, i) => (
        <RevealLine
          key={i}
          shown={shown}
          delay={baseDelay + i * 110}
          style={
            l.outline
              ? { WebkitTextStroke: "1.4px rgba(20,20,20,0.28)", color: "transparent" }
              : { color: l.color ?? "inherit" }
          }
        >
          {l.text}
        </RevealLine>
      ))}
    </h2>
  );
}

/* ══ Texto de apoio ══ */
export function RevealText({
  children,
  shown,
  delay = 0,
  style,
}: {
  children: ReactNode;
  shown: boolean;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: HN,
        fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
        lineHeight: 1.75,
        color: "rgba(20,20,20,0.58)",
        margin: 0,
        maxWidth: "46ch",
        textWrap: "pretty",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ══ Eyebrow padronizado ══ */
export function Eyebrow({
  children,
  shown = true,
  delay = 0,
  style,
}: {
  children: ReactNode;
  shown?: boolean;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: HN,
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        color: "#B0864A",
        opacity: shown ? 1 : 0,
        transition: `opacity 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
