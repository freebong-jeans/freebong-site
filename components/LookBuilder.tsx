"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/useProducts";
import type { ShopifyProduct } from "@/lib/hooks/useProducts";

/* ── Data ──────────────────────────────────────────────────────── */
type CategoriaLook = { name: string; available: boolean; products: ShopifyProduct[] };

/* As pecas do montador vem da loja. A escolha de quais linhas estao
   habilitadas segue a mesma de antes (so calca tem modelo 3D). */
function montarCategorias(catalogo: ShopifyProduct[]): Record<string, CategoriaLook> {
  const daLinha = (termo: string) =>
    catalogo
      .filter((p) => `${p.productType} ${p.title}`.toLowerCase().includes(termo))
      .slice(0, 6);

  return {
    calca:   { name: "Calças",   available: true,  products: daLinha("cal") },
    bermuda: { name: "Bermudas", available: false, products: [] },
    jaqueta: { name: "Jaquetas", available: false, products: [] },
  };
}

const JEANS_COLORS: Record<string, string> = {
  "calca-stratus-ca-059-01": "#8A8D91",
  "calca-stratus-ca-059-02": "#75787C",
  "calca-skinny-legacy-ca-053-02": "#3A5A8C",
  "calca-skinny-legacy-ca-053-03": "#2F4C7E",
  "calca-legacy-95-ca-053-01": "#4A6FA5",
  "calca-legacy-galaxy-ca-062-01": "#1B2C5C",
};

/* ── 3D Mannequin ──────────────────────────────────────────── */
function createMannequin(scene: THREE.Scene, jeanColor: string) {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: "#C8A882",
    roughness: 0.55,
    metalness: 0,
  });

  // Camiseta FBG — grafite escuro com leve variação
  const shirtMat = new THREE.MeshStandardMaterial({
    color: "#1C1C1C",
    roughness: 0.88,
    metalness: 0.0,
  });

  // Manga — mesmo tecido do torso
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: "#222222",
    roughness: 0.88,
    metalness: 0.0,
  });

  // Cós da calça — cor levemente mais escura que o jeans
  const beltMat = new THREE.MeshStandardMaterial({
    color: "#111111",
    roughness: 0.7,
    metalness: 0.05,
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(jeanColor),
    roughness: 0.9,
    metalness: 0.0,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: "#0A0A0A",
    roughness: 0.35,
    metalness: 0.3,
  });

  function createMesh(
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    rx = 0,
    ry = 0,
    rz = 0
  ): THREE.Mesh {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }

  // Pés — tênis escuro
  createMesh(new THREE.BoxGeometry(0.13, 0.075, 0.26), shoeMat, -0.112, 0.14, 0.03);
  createMesh(new THREE.BoxGeometry(0.13, 0.075, 0.26), shoeMat, 0.112, 0.14, 0.03);
  // Solado
  createMesh(new THREE.BoxGeometry(0.135, 0.025, 0.27), shoeMat, -0.112, 0.085, 0.03);
  createMesh(new THREE.BoxGeometry(0.135, 0.025, 0.27), shoeMat, 0.112, 0.085, 0.03);

  // Barra da calça (dobra)
  createMesh(new THREE.CylinderGeometry(0.086, 0.086, 0.035, 14), jeansMat, -0.112, 0.24, 0);
  createMesh(new THREE.CylinderGeometry(0.086, 0.086, 0.035, 14), jeansMat, 0.112, 0.24, 0);

  // Perna inferior (jeans)
  createMesh(new THREE.CylinderGeometry(0.092, 0.080, 0.44, 14), jeansMat, -0.112, 0.465, 0);
  createMesh(new THREE.CylinderGeometry(0.092, 0.080, 0.44, 14), jeansMat, 0.112, 0.465, 0);

  // Perna superior (jeans — ligeiramente mais larga)
  createMesh(new THREE.CylinderGeometry(0.112, 0.096, 0.46, 14), jeansMat, -0.112, 0.91, 0);
  createMesh(new THREE.CylinderGeometry(0.112, 0.096, 0.46, 14), jeansMat, 0.112, 0.91, 0);

  // Virilha (tampa entre as pernas)
  createMesh(new THREE.BoxGeometry(0.22, 0.10, 0.14), jeansMat, 0, 1.10, 0);

  // Cós (belt line) — detalhe
  createMesh(new THREE.BoxGeometry(0.40, 0.055, 0.18), beltMat, 0, 1.155, 0);

  // Torso — camiseta
  createMesh(new THREE.BoxGeometry(0.42, 0.58, 0.18), shirtMat, 0, 1.42, 0);

  // Ombros (parte da camiseta — sem pele exposta)
  createMesh(new THREE.SphereGeometry(0.08, 14, 14), sleeveMat, -0.255, 1.63, 0);
  createMesh(new THREE.SphereGeometry(0.08, 14, 14), sleeveMat, 0.255, 1.63, 0);

  // Manga superior (camiseta cobre braço até cotovelo)
  const leftArm  = createMesh(new THREE.CylinderGeometry(0.070, 0.060, 0.30, 12), sleeveMat, -0.295, 1.43, 0, 0, 0, 0.20);
  const rightArm = createMesh(new THREE.CylinderGeometry(0.070, 0.060, 0.30, 12), sleeveMat, 0.295, 1.43, 0, 0, 0, -0.20);

  // Antebraço (pele — manga curta termina aqui)
  createMesh(new THREE.CylinderGeometry(0.052, 0.046, 0.26, 12), skinMat, -0.348, 1.16, 0, 0, 0, 0.26);
  createMesh(new THREE.CylinderGeometry(0.052, 0.046, 0.26, 12), skinMat, 0.348, 1.16, 0, 0, 0, -0.26);

  // Mãos
  createMesh(new THREE.SphereGeometry(0.044, 12, 12), skinMat, -0.41, 0.97, 0);
  createMesh(new THREE.SphereGeometry(0.044, 12, 12), skinMat, 0.41, 0.97, 0);

  // Pescoço
  createMesh(new THREE.CylinderGeometry(0.052, 0.052, 0.12, 12), skinMat, 0, 1.74, 0);

  // Cabeça
  const head = createMesh(new THREE.SphereGeometry(0.135, 22, 22), skinMat, 0, 1.90, 0);

  group.position.set(0, -0.9, 0);
  scene.add(group);

  return { group, head, leftArm, rightArm, jeansMat };
}

/* ── Main Component ────────────────────────────────────────── */
export default function LookBuilder() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mannequin: ReturnType<typeof createMannequin>;
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState("calca");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { products: catalogo } = useProducts();
  const clothingItems = useMemo(() => montarCategorias(catalogo), [catalogo]);

  const currentCategory = clothingItems[activeCategory];
  const currentProduct = currentCategory.products[selectedIdx];
  const price = currentProduct
    ? parseFloat(currentProduct.variants[0]?.price ?? "0").toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "R$ 0,00";

  /* ── Initialize Three.js ──────────────────────────────────– */
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0A0A0A");
    scene.fog = new THREE.Fog("#0A0A0A", 10, 16);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 20);
    camera.position.set(0, 0.25, 3.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.target.set(0, 0.12, 0);

    // Lights
    scene.add(new THREE.AmbientLight("#ffffff", 0.55));

    const keyLight = new THREE.DirectionalLight("#fffef8", 1.8);
    keyLight.position.set(3, 5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -1.5;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 15;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#d4e4ff", 0.5);
    fillLight.position.set(-3.5, 2.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#A67C3D", 1.1);
    rimLight.position.set(0, 2.5, -5);
    scene.add(rimLight);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 64),
      new THREE.MeshStandardMaterial({
        color: "#0F0F0F",
        roughness: 0.95,
        metalness: 0,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.75;
    floor.receiveShadow = true;
    scene.add(floor);

    const jeanColor = JEANS_COLORS[currentProduct?.id ?? "mock-1"] ?? "#1B2C5C";
    const mannequin = createMannequin(scene, jeanColor);

    sceneRef.current = { scene, camera, renderer, controls, mannequin };
    setReady(true);

    // Animation loop
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { group, head, leftArm, rightArm } = mannequin;

      group.scale.y = 1 + Math.sin(t * 0.9) * 0.008;
      leftArm.rotation.x = Math.sin(t * 0.75) * 0.08;
      rightArm.rotation.x = -Math.sin(t * 0.75) * 0.08;
      head.rotation.y = Math.sin(t * 0.38) * 0.045;
      head.rotation.z = Math.sin(t * 0.52) * 0.022;

      controls.update();
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  /* ── Update jeans color ────────────────────────────────────– */
  useEffect(() => {
    if (!sceneRef.current || !currentProduct) return;
    const hex = JEANS_COLORS[currentProduct.id] ?? JEANS_COLORS["mock-1"];
    sceneRef.current.mannequin.jeansMat.color.set(hex);
    sceneRef.current.mannequin.jeansMat.needsUpdate = true;
  }, [selectedIdx, currentProduct?.id]);

  /* ── JSX ───────────────────────────────────────────────────────── */
  return (
    <main
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      {/* Header — paddingTop absorbs fixed navbar (~80px) */}
      <div
        style={{
          flexShrink: 0,
          padding: "clamp(12px, 3vw, 20px) clamp(16px, 4vw, 24px)",
          paddingTop: "clamp(96px, 13vw, 112px)",
          borderBottom: "1px solid rgba(166,124,61,0.1)",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "#A67C3D", margin: 0, textTransform: "uppercase" }}>
            Monte Seu Look
          </p>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: "#fff", margin: "4px 0 0", lineHeight: 1 }}>
            Vista em 3D
          </h1>
        </div>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            display: "none",
            background: "rgba(166,124,61,0.12)",
            border: "1px solid rgba(166,124,61,0.25)",
            color: "#A67C3D",
            width: "40px",
            height: "40px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          className="md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>
        {/* Sidebar — Hidden on mobile, visible on desktop */}
        <aside
          style={{
            width: "clamp(0px, 0vw, 280px)",
            flexShrink: 0,
            display: "none",
            flexDirection: "column",
            background: "rgba(0,0,0,0.2)",
            borderRight: "1px solid rgba(166,124,61,0.1)",
          }}
          className="hidden md:flex md:w-80"
        >
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: "4px", padding: "8px", borderBottom: "1px solid rgba(166,124,61,0.1)", background: "rgba(0,0,0,0.1)" }}>
            {Object.entries(clothingItems).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => cat.available && setActiveCategory(key)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  background: activeCategory === key ? "rgba(166,124,61,0.1)" : "transparent",
                  border: activeCategory === key ? "1px solid rgba(166,124,61,0.3)" : "1px solid transparent",
                  borderRadius: "3px",
                  color: activeCategory === key ? "#A67C3D" : cat.available ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: cat.available ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  opacity: cat.available ? 1 : 0.6,
                }}
              >
                {cat.name.charAt(0)}
              </button>
            ))}
          </div>

          {/* Product List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px", scrollbarWidth: "thin" }}>
            {currentCategory.products.map((p, idx) => {
              const isSelected = idx === selectedIdx;
              const img = p.images[0];
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                    padding: "8px 10px",
                    marginBottom: "6px",
                    background: isSelected ? "rgba(166,124,61,0.12)" : "rgba(255,255,255,0.02)",
                    border: isSelected ? "1px solid rgba(166,124,61,0.3)" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(166,124,61,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                    }
                  }}
                >
                  {img && (
                    <Image
                      src={img.src}
                      alt={p.title}
                      width={48}
                      height={64}
                      style={{ borderRadius: "3px", objectFit: "cover" }}
                    />
                  )}
                  <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: isSelected ? "#fff" : "rgba(255,255,255,0.6)", margin: 0, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.title}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "#A67C3D", margin: "2px 0 0", fontWeight: 600 }}>
                      {parseFloat(p.variants[0]?.price ?? "0").toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 3D Viewer */}
        <div
          ref={mountRef}
          style={{
            flex: 1,
            position: "relative",
            background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)",
            overflow: "hidden",
          }}
        />

        {/* Right Panel — Desktop Only */}
        <aside
          style={{
            width: "clamp(0px, 0vw, 260px)",
            flexShrink: 0,
            display: "none",
            flexDirection: "column",
            background: "rgba(0,0,0,0.2)",
            borderLeft: "1px solid rgba(166,124,61,0.1)",
            padding: "clamp(8px, 2vw, 16px)",
          }}
          className="hidden lg:flex"
        >
          {currentProduct && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", margin: 0, marginBottom: "6px", textTransform: "uppercase" }}>
                  {currentProduct.title}
                </h3>
                <p style={{ fontSize: "1.3rem", fontWeight: 900, color: "#A67C3D", margin: 0 }}>
                  {price}
                </p>
              </div>

              <p style={{ fontSize: "0.75rem", lineHeight: 1.5, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                {currentProduct.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "10px", background: "rgba(166,124,61,0.08)", borderRadius: "3px", border: "1px solid rgba(166,124,61,0.1)", fontSize: "0.7rem" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "#A67C3D", margin: 0, textTransform: "uppercase" }}>Material</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>100% Algodão</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "#A67C3D", margin: 0, textTransform: "uppercase" }}>Corte</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>Slim Fit</p>
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #A67C3D 0%, #8B6F47 100%)",
                  border: "none",
                  borderRadius: "3px",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Comprar
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile Bottom Sheet */}
      {showMobileMenu && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.95)",
            borderTop: "1px solid rgba(166,124,61,0.2)",
            maxHeight: "50vh",
            overflowY: "auto",
            zIndex: 50,
            padding: "12px",
          }}
          className="md:hidden"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            {currentCategory.products.map((p, idx) => {
              const isSelected = idx === selectedIdx;
              const img = p.images[0];
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedIdx(idx);
                    setShowMobileMenu(false);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px",
                    background: isSelected ? "rgba(166,124,61,0.15)" : "rgba(255,255,255,0.03)",
                    border: isSelected ? "1px solid rgba(166,124,61,0.4)" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {img && <Image src={img.src} alt={p.title} width={60} height={80} style={{ borderRadius: "3px", objectFit: "cover" }} />}
                  <div style={{ fontSize: "0.65rem", color: isSelected ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" }}>
                    {p.title.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {currentProduct && (
            <>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", margin: "0 0 4px", textTransform: "uppercase" }}>
                {currentProduct.title}
              </h3>
              <p style={{ fontSize: "1.2rem", fontWeight: 900, color: "#A67C3D", margin: "0 0 12px" }}>
                {price}
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #A67C3D 0%, #8B6F47 100%)",
                  border: "none",
                  borderRadius: "3px",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                🛒 Comprar Agora
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
