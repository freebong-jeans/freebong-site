"use client";

import { useEffect, useRef } from "react";

const ARC_REL_LEN = 0.4;
const FLIGHT_TIME = 1000;
const NUM_RINGS = 3;
const RINGS_MAX_R = 5;
const RING_PROPAGATION_SPEED = 5;

/* Sede Freebong — Rua Luiz de Camões, 85, Cruzeiro, Justinópolis (Ribeirão das Neves/MG) */
const FREEBONG_HQ = {
  lat: -19.8117,
  lng: -44.0069,
  label: "FREEBONG · Justinópolis, MG · Brasil",
  __hq: true,
};

export default function GlobeViz() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    function initGlobe() {
      const el = wrapRef.current;
      if (!el) return;
      const Globe = (window as any).Globe;
      if (!Globe) return;

      const sz = el.offsetWidth || 320;
      let prevCoords = { lat: 0, lng: 0 };

      const globe = Globe()(el)
        .width(sz)
        .height(sz)
        .globeImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
        .arcColor(() => "#B59672")
        .arcDashLength(ARC_REL_LEN)
        .arcDashGap(2)
        .arcDashInitialGap(1)
        .arcDashAnimateTime(FLIGHT_TIME)
        .arcsTransitionDuration(0)
        .ringColor((d: any) =>
          d.__hq
            ? (t: number) => `rgba(34,197,94,${0.8 * (1 - t)})`
            : (t: number) => `rgba(181,150,114,${1 - t})`
        )
        .ringMaxRadius(RINGS_MAX_R)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod((FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS)
        .backgroundColor("rgba(0,0,0,0)")
        /* Ponto verde fixo — sede Freebong */
        .pointsData([FREEBONG_HQ])
        .pointColor(() => "#22C55E")
        .pointAltitude(0.02)
        .pointRadius(0.6)
        .pointLabel((d: any) => `<div style="font-family:Helvetica,sans-serif;font-size:11px;letter-spacing:0.08em;background:rgba(10,10,10,0.9);color:#22C55E;padding:6px 10px;border:1px solid rgba(34,197,94,0.4);white-space:nowrap;">${d.label}</div>`)
        .onGlobeClick(emitArc);

      /* Anel verde pulsando permanentemente na sede */
      globe.ringsData([FREEBONG_HQ]);

      /* Globo abre focado no Brasil, com a sede visível */
      globe.pointOfView({ lat: -19.8117, lng: -44.0069, altitude: 2.2 }, 0);

      globeRef.current = globe;

      // Sem auto-rotate e sem zoom/pan, mas drag livre (mouse e touch)
      const ctrl = globe.controls();
      ctrl.autoRotate = false;
      ctrl.enableZoom = false;
      ctrl.enablePan = false;

      // Responsivo: atualiza dimensões quando o container redimensiona
      roRef.current = new ResizeObserver(([entry]) => {
        const w = Math.round(entry.contentRect.width);
        if (w > 0 && globeRef.current) globeRef.current.width(w).height(w);
      });
      roRef.current.observe(el);

      function emitArc({ lat: endLat, lng: endLng }: { lat: number; lng: number }) {
        const { lat: startLat, lng: startLng } = prevCoords;
        setTimeout(() => { prevCoords = { lat: endLat, lng: endLng }; }, FLIGHT_TIME);

        const arc = { startLat, startLng, endLat, endLng };
        globe.arcsData([...globe.arcsData(), arc]);
        setTimeout(() => globe.arcsData(globe.arcsData().filter((d: any) => d !== arc)), FLIGHT_TIME * 2);

        const srcRing = { lat: startLat, lng: startLng };
        globe.ringsData([...globe.ringsData(), srcRing]);
        setTimeout(() => globe.ringsData(globe.ringsData().filter((r: any) => r !== srcRing)), FLIGHT_TIME * ARC_REL_LEN);

        setTimeout(() => {
          const targetRing = { lat: endLat, lng: endLng };
          globe.ringsData([...globe.ringsData(), targetRing]);
          setTimeout(() => globe.ringsData(globe.ringsData().filter((r: any) => r !== targetRing)), FLIGHT_TIME * ARC_REL_LEN);
        }, FLIGHT_TIME);
      }
    }

    const existing = document.querySelector('script[src*="globe.gl"]');
    if (existing) {
      if ((window as any).Globe) initGlobe();
      else existing.addEventListener("load", initGlobe);
    } else {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/globe.gl";
      script.onload = initGlobe;
      document.head.appendChild(script);
    }

    return () => {
      roRef.current?.disconnect();
      try { globeRef.current?._destructor?.(); } catch {}
      if (wrapRef.current) wrapRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", cursor: "crosshair" }}
    />
  );
}
