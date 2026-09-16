"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Dados mock das 3 linhas (troca por Shopify depois) ────── */
const LINES = [
  {
    id: "premium",
    line: "LINHA PREMIUM",
    name: "Calça Slim Premium",
    price: "R$ 249,90",
    desc: "Corte que não aperta. Tecido que não afrouxa. Estilo que não pede licença.",
    accent: "#6B2033",
    bg: ["#150009", "#2D0F1A"],
    image: "/images/products/DSC00877.jpg",
  },
  {
    id: "standard",
    line: "LINHA STANDARD",
    name: "Calça Standard",
    price: "R$ 199,90",
    desc: "Estilo limpo, atual e versátil. O jeans que acompanha sua rotina sem esforço.",
    accent: "#2E2E2E",
    bg: ["#0A0A0A", "#1F1F1F"],
    image: "/images/products/DSC01007.jpg",
  },
  {
    id: "basic",
    line: "LINHA BASIC",
    name: "Calça Basic",
    price: "R$ 169,90",
    desc: "O básico bem feito que faz toda a diferença. Qualidade que se sente no uso.",
    accent: "#B0864A",
    bg: ["#140E06", "#2A1E0E"],
    image: "/images/products/DSC01208.jpg",
  },
];

export default function ProductShowcase3D() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const shineRef    = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const mouseRaw    = useRef({ x: 0, y: 0 });
  const mouseLerp   = useRef({ x: 0, y: 0 });

  const [active, setActive]     = useState(0);
  const [visible, setVisible]   = useState(false);
  const [hovered, setHovered]   = useState(false);
  const [switching, setSwitching] = useState(false);

  const p = LINES[active];

  /* ── Scroll reveal ──────────────────────────────────────── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Mouse tracking relativo à seção ───────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function onMove(e: MouseEvent) {
      const r = section!.getBoundingClientRect();
      mouseRaw.current.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mouseRaw.current.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    }
    function onLeave() {
      mouseRaw.current = { x: 0, y: 0 };
    }

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── RAF: lerp suave + aplica transforms ───────────────── */
  useEffect(() => {
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function tick() {
      mouseLerp.current.x = lerp(mouseLerp.current.x, mouseRaw.current.x, 0.055);
      mouseLerp.current.y = lerp(mouseLerp.current.y, mouseRaw.current.y, 0.055);

      const rx = -mouseLerp.current.y * 14;
      const ry =  mouseLerp.current.x * 18;

      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      if (shineRef.current) {
        const cx = 50 + mouseLerp.current.x * 35;
        const cy = 50 - mouseLerp.current.y * 35;
        shineRef.current.style.background =
          `radial-gradient(circle at ${cx}% ${cy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Troca de linha com micro-fade ─────────────────────── */
  function switchLine(i: number) {
    if (i === active) return;
    setSwitching(true);
    setTimeout(() => { setActive(i); setSwitching(false); }, 220);
  }

  /* ── Hex com opacidade ─────────────────────────────────── */
  function hex(color: string, alpha: string) {
    return color + alpha;
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden py-24"
      style={{ background: "#000" }}
    >
      {/* Glow de fundo que muda com a linha ativa */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 65% 50%, ${hex(p.accent, "18")} 0%, transparent 70%)`,
        }}
      />

      {/* Ruído de grão (textura) */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      <div className="container-fbg w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ══ CARD 3D ══════════════════════════════════════ */}
          <div
            className="flex justify-center items-center"
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? "translateY(0)" : "translateY(70px)",
              transition: "opacity 1s ease 0.1s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}
          >
            <div
              ref={cardRef}
              className="relative"
              style={{ willChange: "transform", transformStyle: "preserve-3d" }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* ── Face do card ─────────────────────────── */}
              <div
                className="relative w-[280px] h-[380px] md:w-[320px] md:h-[440px] overflow-hidden transition-all duration-700"
                style={{
                  background: `linear-gradient(145deg, ${p.bg[0]}, ${p.bg[1]})`,
                  boxShadow: `
                    0 0 0 1px ${hex(p.accent, "25")},
                    0 30px 60px -10px ${hex(p.accent, "30")},
                    0 60px 100px -20px #00000080
                  `,
                  opacity: switching ? 0 : 1,
                  transition: "opacity 0.22s ease, box-shadow 0.7s ease, background 0.7s ease",
                }}
              >
                {/* Foto do produto */}
                <div className="absolute inset-0">
                  <Image
                    key={p.id}
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
                  }} />
                </div>

                {/* Shine de luz (move com mouse via ref) */}
                <div ref={shineRef} className="absolute inset-0 pointer-events-none" />

                {/* Borda luminosa no topo */}
                <div
                  className="absolute top-0 left-0 right-0 h-px transition-colors duration-700"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
                />

                {/* Badge de linha */}
                <div className="absolute top-5 left-5">
                  <span
                    className="text-[8px] font-bold tracking-[0.22em] uppercase px-2.5 py-1.5 transition-colors duration-700"
                    style={{ background: p.accent, color: "#fff" }}
                  >
                    {p.line}
                  </span>
                </div>

                {/* Logo FBG flutuando — translateZ cria profundidade real */}
                <div
                  className="absolute bottom-6 right-6 transition-all duration-400"
                  style={{
                    transform: hovered ? "translateZ(30px) scale(1.15)" : "translateZ(0) scale(1)",
                  }}
                >
                  <span
                    className="font-black italic text-2xl tracking-tighter transition-opacity duration-700"
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
                      color: p.accent,
                      opacity: 0.35,
                    }}
                  >
                    FBG
                  </span>
                </div>

                {/* Linha de acento na base */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-colors duration-700"
                  style={{ background: p.accent }}
                />
              </div>

              {/* Sombra 3D embaixo do card */}
              <div
                className="absolute -bottom-5 left-1/2 h-5 blur-2xl transition-all duration-500"
                style={{
                  width:      hovered ? "80%" : "65%",
                  transform:  "translateX(-50%)",
                  background: p.accent,
                  opacity:    hovered ? 0.3 : 0.15,
                }}
              />
            </div>
          </div>

          {/* ══ INFO ════════════════════════════════════════ */}
          <div
            className="space-y-7"
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 1s ease 0.35s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s",
            }}
          >
            {/* Seletor de linhas */}
            <div className="flex gap-2 flex-wrap">
              {LINES.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => switchLine(i)}
                  className="text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-2 transition-all duration-300"
                  style={{
                    border:  `1px solid ${i === active ? l.accent : "#ffffff15"}`,
                    color:   i === active ? l.accent : "#ffffff35",
                    background: i === active ? hex(l.accent, "15") : "transparent",
                  }}
                >
                  {l.line.replace("LINHA ", "")}
                </button>
              ))}
            </div>

            {/* Eyebrow */}
            <span className="type-eyebrow transition-colors duration-700" style={{ color: p.accent }}>
              {p.line}
            </span>

            {/* Nome */}
            <div className="overflow-hidden">
              <h2
                key={p.name}
                className="text-4xl md:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]"
                style={{ animation: "slideUpFast 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                {p.name}
              </h2>
            </div>

            {/* Linha */}
            <div className="w-10 h-px transition-colors duration-700" style={{ background: p.accent }} />

            {/* Descrição */}
            <p
              key={p.desc}
              className="text-white/45 text-sm leading-relaxed max-w-sm"
              style={{ animation: "fadeInFast 0.5s ease 0.08s both" }}
            >
              {p.desc}
            </p>

            {/* Preço */}
            <div className="flex items-baseline gap-3">
              <span
                key={p.price}
                className="text-3xl font-black transition-colors duration-700"
                style={{ color: p.accent }}
              >
                {p.price}
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/25">à vista</span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link
                href="/colecao"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden
                           text-[11px] font-bold tracking-[0.2em] uppercase
                           px-8 py-4 text-white transition-colors duration-500"
                style={{ border: `1px solid ${p.accent}`, borderRadius: "3px" }}
              >
                <span
                  className="absolute inset-0 transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-0"
                  style={{ background: p.accent }}
                />
                <span className="relative">Ver Coleção</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/colecao"
                className="inline-flex items-center justify-center
                           text-[11px] font-bold tracking-[0.2em] uppercase
                           px-8 py-4 text-white/40 hover:text-white/80
                           transition-colors duration-300"
              >
                Todos os Modelos
              </Link>
            </div>

            {/* Hint de interação */}
            <p className="text-[9px] tracking-[0.18em] uppercase text-white/15 flex items-center gap-2 pt-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              Passe o mouse sobre o produto para interagir em 3D
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpFast {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeInFast {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

/* ── SVG silhueta de calça — placeholder até chegar foto real ── */
function JeansSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 180 260" width="160" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Corpo da calça */}
      <path
        d="M32 16 L22 248 L76 248 L90 138 L104 248 L158 248 L148 16 Z"
        fill={color} fillOpacity="0.18"
        stroke={color} strokeWidth="1.2" strokeOpacity="0.5"
      />
      {/* Cós */}
      <rect x="30" y="14" width="120" height="16" rx="2"
        fill={color} fillOpacity="0.45"
        stroke={color} strokeWidth="1" strokeOpacity="0.5"
      />
      {/* Costura central (tracejada) */}
      <line x1="90" y1="30" x2="90" y2="138"
        stroke={color} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="5 4"
      />
      {/* Bolso dianteiro esq */}
      <path d="M42 36 Q58 34 62 52 L59 66 L42 66 Z"
        fill={color} fillOpacity="0.12"
        stroke={color} strokeWidth="0.8" strokeOpacity="0.35"
      />
      {/* Bolso dianteiro dir */}
      <path d="M138 36 Q122 34 118 52 L121 66 L138 66 Z"
        fill={color} fillOpacity="0.12"
        stroke={color} strokeWidth="0.8" strokeOpacity="0.35"
      />
      {/* Costura lateral esq */}
      <line x1="34" y1="32" x2="24" y2="246"
        stroke={color} strokeOpacity="0.15" strokeWidth="0.8"
      />
      {/* Costura lateral dir */}
      <line x1="146" y1="32" x2="156" y2="246"
        stroke={color} strokeOpacity="0.15" strokeWidth="0.8"
      />
      {/* Etiqueta FBG no cós */}
      <rect x="76" y="19" width="28" height="10" rx="1"
        fill={color} fillOpacity="0.55"
      />
      <text x="90" y="27" textAnchor="middle"
        fill="white" fontSize="5.5" fontWeight="900"
        fontFamily="'Helvetica Neue', Helvetica, sans-serif"
        fontStyle="italic" opacity="0.9"
      >
        FBG
      </text>
    </svg>
  );
}
