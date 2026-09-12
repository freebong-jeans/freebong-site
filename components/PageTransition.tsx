"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Phase = "idle" | "covering" | "uncovering";

const TransitionCtx = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(TransitionCtx);
}

/* ══════════════════════════════════════════════════════════
   TRANSIÇÃO DE PÁGINA — wipe preto vertical
   Painel sobe cobrindo a tela → navega → sobe saindo de vista.
   Intercepta cliques em links internos no document (capture phase),
   sem precisar trocar nenhum <Link> existente.
══════════════════════════════════════════════════════════ */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);
  const firstRender = useRef(true);

  const navigate = useCallback(
    async (href: string) => {
      if (busy.current || href === pathname) return;
      busy.current = true;
      setPhase("covering");
      await wait(480);
      router.push(href);
      await wait(140);
      setPhase("uncovering");
      await wait(560);
      setPhase("idle");
      busy.current = false;
    },
    [router, pathname]
  );

  // Aplica os estilos imperativamente — evita flickers de transição CSS em React
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    el.dataset.phase = phase;
    if (phase === "covering") {
      el.style.pointerEvents = "all";
      el.style.transition = "none";
      el.style.transform = "translateY(100%)";
      el.getBoundingClientRect(); // força reflow
      el.style.transition = "transform 0.48s cubic-bezier(0.76,0,0.24,1)";
      el.style.transform = "translateY(0%)";
    } else if (phase === "uncovering") {
      el.style.transition = "transform 0.52s cubic-bezier(0.76,0,0.24,1)";
      el.style.transform = "translateY(-100%)";
    } else {
      el.style.transition = "none";
      el.style.transform = "translateY(100%)";
      el.style.pointerEvents = "none";
    }
  }, [phase]);

  // Intercepta cliques em links internos (não-blank, não-modificados)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (a.target === "_blank") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(href);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [navigate]);

  // Marca primeira renderização para não animar nada no load inicial
  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 500,
          pointerEvents: "none",
          transform: "translateY(100%)",
          willChange: "transform",
        }}
      >
        {/* fio dourado nas duas bordas */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, #A67C3D 30%, #6B2033 70%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, #6B2033 30%, #A67C3D 70%, transparent 100%)",
          }}
        />

        {/* assinatura FBG no centro do wipe */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span
            className="pt-logo"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(2.6rem, 7vw, 5rem)",
              letterSpacing: "-0.04em",
              color: "#F4F2EE",
              lineHeight: 1.04,
              opacity: 0,
            }}
          >
            FBG
          </span>
          <span
            className="pt-logo-sub"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "0.55rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "#A67C3D",
              opacity: 0,
            }}
          >
            Freebong · Jeans Wear
          </span>
        </div>

        <style>{`
          [data-phase="covering"] .pt-logo {
            animation: ptLogoIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.22s both;
          }
          [data-phase="covering"] .pt-logo-sub {
            animation: ptLogoIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.32s both;
          }
          [data-phase="uncovering"] .pt-logo,
          [data-phase="uncovering"] .pt-logo-sub {
            animation: ptLogoOut 0.3s ease both;
          }
          @keyframes ptLogoIn {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes ptLogoOut {
            from { opacity: 1; }
            to   { opacity: 0; }
          }
        `}</style>
      </div>
    </TransitionCtx.Provider>
  );
}
