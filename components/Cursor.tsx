"use client";

import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════
   CURSOR CUSTOMIZADO
   Dot que segue o mouse exatamente + ring com lerp suave.
   Expande e muda de cor sobre elementos interativos.
   Desabilitado em dispositivos touch.
══════════════════════════════════════════════════════════ */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const lerped = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHover(!!el?.closest("a, button, [role='button'], input, select, textarea, label"));
    };
    const onDown = () => setPress(true);
    const onUp = () => setPress(false);
    const onLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    const tick = () => {
      const L = 0.12;
      lerped.current.x += (mouse.current.x - lerped.current.x) * L;
      lerped.current.y += (mouse.current.y - lerped.current.y) * L;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${lerped.current.x}px, ${lerped.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabled) return null;

  const ringSize = hover ? 50 : press ? 20 : 30;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          borderRadius: "50%",
          background: "#fff",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible && !hover ? 1 : 0,
          transition: "opacity 0.25s ease",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          marginLeft: `${-ringSize / 2}px`,
          marginTop: `${-ringSize / 2}px`,
          borderRadius: "50%",
          border: `1.5px solid ${hover ? "#B0864A" : "rgba(255,255,255,0.65)"}`,
          background: hover ? "rgba(176,134,74,0.08)" : "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition:
            "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), margin 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease, background 0.25s ease, opacity 0.25s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
