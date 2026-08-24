"use client";

/**
 * ParallaxImage — foto com profundidade no scroll.
 * A imagem (ligeiramente ampliada) desliza dentro da moldura
 * conforme a posição do elemento na viewport. Sutil e leve.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ParallaxImage({
  src,
  alt,
  sizes,
  objectPosition = "center",
  strength = 7,
}: {
  src: string;
  alt: string;
  sizes: string;
  objectPosition?: string;
  strength?: number; // % máximo de deslocamento
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        /* -1 (embaixo da tela) → +1 (em cima da tela) */
        const t = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        setOffset(-t * strength);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{
          objectFit: "cover",
          objectPosition,
          transform: `scale(${1 + (strength * 2) / 100}) translateY(${offset}%)`,
          willChange: "transform",
        }}
      />
    </div>
  );
}
