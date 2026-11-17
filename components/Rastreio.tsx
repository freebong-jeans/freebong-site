"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { carregarRastreio, consentiu, rastrear, CONSENTIMENTO_EVENTO } from "@/lib/rastreio";

/** Carrega GTM + Pixel apos o consentimento e marca PageView a cada pagina. */
export default function Rastreio() {
  const pathname = usePathname();
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const ligar = () => {
      if (!consentiu()) return;
      carregarRastreio();
      setAtivo(true);
    };
    ligar();
    window.addEventListener(CONSENTIMENTO_EVENTO, ligar);
    return () => window.removeEventListener(CONSENTIMENTO_EVENTO, ligar);
  }, []);

  useEffect(() => {
    if (ativo) rastrear("PageView");
  }, [ativo, pathname]);

  return null;
}
