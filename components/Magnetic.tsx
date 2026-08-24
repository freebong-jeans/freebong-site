"use client";

/**
 * Magnetic — wrapper que faz o elemento "puxar" o cursor.
 * Desktop only; zero efeito em touch/reduced-motion.
 */

import { useRef, type ReactNode } from "react";

export default function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
