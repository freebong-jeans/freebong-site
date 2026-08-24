"use client";

/**
 * BrandStats — números da marca com contadores animados.
 * Dispara quando entra na viewport; reveal editorial em cascata.
 */

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 2013, label: "Fundada em", suffix: "", raw: true },
  { value: 45, label: "Referências ativas", suffix: "+", raw: false },
  { value: 3, label: "Linhas: calças, bermudas e jaquetas", suffix: "", raw: false },
  { value: 100, label: "Feita no Brasil, pro Brasil todo", suffix: "%", raw: false },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function Stat({ value, label, suffix, raw, active, index }: { value: number; label: string; suffix: string; raw: boolean; active: boolean; index: number }) {
  const n = useCountUp(value, active);
  const display = raw ? String(n) : n.toLocaleString("pt-BR");
  return (
    <div
      style={{
        textAlign: "center",
        padding: "clamp(24px,4vw,40px) 16px",
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(24px)",
        transition: `opacity 0.8s ease ${index * 0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      <span
        style={{
          display: "block",
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1.04,
          color: "#141414",
        }}
      >
        {display}
        <span style={{ color: "#B59672" }}>{suffix}</span>
      </span>
      <span
        style={{
          display: "block",
          marginTop: "10px",
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.48)",
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function BrandStats() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Números da marca"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          padding: "clamp(24px,4vw,48px) clamp(16px,4vw,64px)",
        }}
      >
        {STATS.map((s, i) => (
          <Stat key={s.label} {...s} active={active} index={i} />
        ))}
      </div>
    </section>
  );
}
