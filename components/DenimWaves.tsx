"use client";

/**
 * DenimWaves — tecido jeans 3D vivo (three.js shader)
 * Camada sutil sobre o vídeo do hero: ondas de tecido índigo com trama
 * de sarja procedural, reagindo ao movimento do mouse.
 * Desktop only · pausa fora da viewport · respeita prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseForce;
  varying vec2 vUv;
  varying float vElev;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Ondas de tecido — três frequências sobrepostas
    float w1 = sin(pos.x * 1.6 + uTime * 0.55) * 0.22;
    float w2 = sin(pos.y * 2.3 - uTime * 0.4) * 0.14;
    float w3 = sin((pos.x + pos.y) * 3.1 + uTime * 0.7) * 0.07;

    // Ondulação a partir do mouse (ripple suave)
    float d = distance(uv, uMouse);
    float ripple = sin(d * 18.0 - uTime * 2.2) * exp(-d * 4.5) * uMouseForce * 0.35;

    float elev = w1 + w2 + w3 + ripple;
    pos.z += elev;
    vElev = elev;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElev;

  void main() {
    // Paleta índigo denim
    vec3 deep   = vec3(0.043, 0.071, 0.153); // índigo profundo
    vec3 mid    = vec3(0.106, 0.173, 0.361); // índigo médio
    vec3 warm   = vec3(0.710, 0.588, 0.447); // dourado FBG (#A67C3D)

    // Trama de sarja diagonal (twill)
    float twill = smoothstep(0.42, 0.58, fract((vUv.x - vUv.y) * 120.0));
    float weft  = smoothstep(0.35, 0.65, fract(vUv.y * 240.0)) * 0.5;

    // Luz pelo relevo da onda
    float light = smoothstep(-0.4, 0.5, vElev);

    vec3 col = mix(deep, mid, light);
    col = mix(col, col * 1.28, twill * 0.35 + weft * 0.12);
    // brilho dourado só nas cristas mais altas
    col += warm * smoothstep(0.28, 0.5, vElev) * 0.16;

    // vinheta para fundir com o hero
    float vig = smoothstep(1.05, 0.35, distance(vUv, vec2(0.5)));
    gl_FragColor = vec4(col, vig * 0.9);
  }
`;

export default function DenimWaves({ opacity = 0.5 }: { opacity?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Guardas: touch / reduced motion / WebGL
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0, 6);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseForce: { value: 0 },
    };

    const geo = new THREE.PlaneGeometry(16, 9, 140, 90);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -0.28;
    scene.add(mesh);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* Mouse — coordenadas UV suavizadas */
    const target = new THREE.Vector2(0.5, 0.5);
    let force = 0;
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      force = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* Pausa fora da viewport */
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.06);
      force *= 0.97;
      uniforms.uMouseForce.value = THREE.MathUtils.lerp(uniforms.uMouseForce.value, force, 0.08);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ opacity, mixBlendMode: "screen" }}
    />
  );
}
