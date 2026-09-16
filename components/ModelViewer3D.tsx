"use client";

import { useEffect, useRef, useState } from "react";

export default function ModelViewer3D({ src }: { src: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let destroyed = false;
    let animFrame = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any = null;

    (async () => {
      try {
        const THREE = await import("three");
        const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

        if (destroyed) return;

        // ── Scene ──────────────────────────────────────────────
        const scene = new THREE.Scene();

        // ── Camera ─────────────────────────────────────────────
        const W = mount.clientWidth;
        const H = mount.clientHeight || 560;
        const camera = new THREE.PerspectiveCamera(42, W / H, 0.01, 100);
        camera.position.set(0, 1.2, 3.2);

        // ── Renderer ───────────────────────────────────────────
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        mount.appendChild(renderer.domElement);

        // ── Iluminação — editorial de moda ─────────────────────
        // Ambiente suave
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        // Key light: frontal-direito, acima (quente)
        const key = new THREE.DirectionalLight(0xfff8f0, 1.8);
        key.position.set(3, 7, 4);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.bias = -0.0008;
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 30;
        key.shadow.camera.left = -4;
        key.shadow.camera.right = 4;
        key.shadow.camera.top = 5;
        key.shadow.camera.bottom = -2;
        scene.add(key);

        // Fill light: esquerda, tom areia (Cuban Sand)
        const fill = new THREE.DirectionalLight(0xB59672, 0.4);
        fill.position.set(-4, 3, 2);
        scene.add(fill);

        // Rim light: atrás — silhueta premium
        const rim = new THREE.DirectionalLight(0xe0e4ff, 1.0);
        rim.position.set(0, 5, -6);
        scene.add(rim);

        // Indigo uplighting de baixo (mood passarela FBG)
        const indigo = new THREE.PointLight(0x1b1a55, 5, 6);
        indigo.position.set(0, -0.2, 1.5);
        scene.add(indigo);

        // ── Chão ───────────────────────────────────────────────
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(12, 12),
          new THREE.MeshStandardMaterial({ color: 0x030406, roughness: 0.95 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // ── OrbitControls ─────────────────────────────────────
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI * 0.1;
        controls.maxPolarAngle = Math.PI * 0.88;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;

        // Para auto-rotate quando o usuário interage
        let idleTimer: ReturnType<typeof setTimeout>;
        renderer.domElement.addEventListener("pointerdown", () => {
          controls.autoRotate = false;
          clearTimeout(idleTimer);
        });
        renderer.domElement.addEventListener("pointerup", () => {
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => { controls.autoRotate = true; }, 2500);
        });

        // ── Paleta de materiais FBG ───────────────────────────
        const mat = {
          jeans: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#2D3748"), // Mood Indigo
            roughness: 0.88,
            metalness: 0.02,
          }),
          jacket: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#0C0C10"), // Preto profundo
            roughness: 0.75,
            metalness: 0.06,
          }),
          shirt: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#ECEAE4"), // Off-white
            roughness: 0.92,
            metalness: 0,
          }),
          skin: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#C68642"),
            roughness: 0.82,
            metalness: 0,
          }),
          shoe: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#0E0E0E"),
            roughness: 0.62,
            metalness: 0.18,
          }),
          hair: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1a1010"),
            roughness: 0.98,
            metalness: 0,
          }),
          accent: new THREE.MeshStandardMaterial({
            color: new THREE.Color("#B0864A"), // Cuban Sand (cinto/acessórios)
            roughness: 0.65,
            metalness: 0.22,
          }),
        };

        // ── Carregar FBX ──────────────────────────────────────
        const loader = new FBXLoader();
        loader.load(
          src,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fbx: any) => {
            if (destroyed) return;

            // Auto-escala: normaliza para 1.7 unidades de altura
            {
              const box = new THREE.Box3().setFromObject(fbx);
              const h = box.getSize(new THREE.Vector3()).y;
              fbx.scale.setScalar(1.7 / h);
            }

            // Centraliza com pés no chão (y = 0)
            {
              const box = new THREE.Box3().setFromObject(fbx);
              const center = box.getCenter(new THREE.Vector3());
              fbx.position.x -= center.x;
              fbx.position.z -= center.z;
              fbx.position.y -= box.min.y;
            }

            // Caixa final (após posicionamento)
            const totalBox = new THREE.Box3().setFromObject(fbx);
            const totalH = totalBox.max.y;
            const totalW = totalBox.max.x - totalBox.min.x;

            // Aplica o outfit completo FBG
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fbx.traverse((child: any) => {
              if (!(child.isMesh)) return;
              child.castShadow = true;
              child.receiveShadow = true;

              const n = (child.name || "").toLowerCase();

              // Match por nome do mesh (Ch36 + padrões genéricos Mixamo)
              if (/pant|jean|trouser|lower_body|ch36_pant|ch36_short/.test(n)) {
                child.material = mat.jeans;
              } else if (/jacket|coat|outer|ch36_jacket|ch36_coat|upper_body/.test(n)) {
                child.material = mat.jacket;
              } else if (/shirt|tshirt|t.shirt|ch36_shirt|ch36_top/.test(n)) {
                child.material = mat.shirt;
              } else if (/shoe|boot|sneaker|ch36_shoe|ch36_boot/.test(n)) {
                child.material = mat.shoe;
              } else if (/hair|ch36_hair/.test(n)) {
                child.material = mat.hair;
              } else if (/belt|buckle|zipper|accessory|ch36_belt|waist/.test(n)) {
                child.material = mat.accent;
              } else if (/skin|face|head|hand|arm|body|ch36_body|alpha_body|default/.test(n)) {
                child.material = mat.skin;
              } else {
                // Fallback por posição Y relativa ao total
                const cBox = new THREE.Box3().setFromObject(child);
                const cy = cBox.getCenter(new THREE.Vector3()).y;
                const rel = cy / totalH;

                if (rel > 0.82) child.material = mat.hair;
                else if (rel > 0.58) child.material = mat.jacket;
                else if (rel > 0.20) child.material = mat.jeans;
                else child.material = mat.shoe;
              }
            });

            // ── Banda da cueca FBG (visível acima das calças) ─
            {
              const radius = totalW * 0.46;
              const band = new THREE.Mesh(
                new THREE.CylinderGeometry(radius, radius, 0.03, 40, 1, true),
                new THREE.MeshStandardMaterial({
                  color: new THREE.Color("#111114"),
                  roughness: 0.85,
                  metalness: 0,
                  side: THREE.DoubleSide,
                })
              );
              band.position.set(0, totalH * 0.535, 0);
              fbx.add(band);
            }

            scene.add(fbx);

            // Enquadra câmera na altura do peito do personagem
            controls.target.set(0, totalH * 0.50, 0);
            camera.position.set(0, totalH * 0.54, totalH * 1.55);
            controls.update();

            setStatus("ready");
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e: any) => {
            if (e.total > 0) setLoadPct(Math.round((e.loaded / e.total) * 100));
          },
          (err: unknown) => {
            console.error("FBX load error:", err);
            if (!destroyed) setStatus("error");
          }
        );

        // ── Loop de renderização ──────────────────────────────
        const tick = () => {
          if (destroyed) return;
          animFrame = requestAnimationFrame(tick);
          controls.update();
          renderer.render(scene, camera);
        };
        tick();

        // ── Redimensionamento ─────────────────────────────────
        const onResize = () => {
          const w = mount.clientWidth;
          const h = mount.clientHeight || 560;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        // Cleanup registrado para quando o efeito desmontar
        const cleanup = () => {
          window.removeEventListener("resize", onResize);
          clearTimeout(idleTimer);
          Object.values(mat).forEach((m) => m.dispose());
        };
        // Armazena cleanup no ref para o return do useEffect
        (mount as HTMLDivElement & { _cleanup?: () => void })._cleanup = cleanup;

      } catch (err) {
        console.error("Three.js init error:", err);
        if (!destroyed) setStatus("error");
      }
    })();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animFrame);
      const m = mount as HTMLDivElement & { _cleanup?: () => void };
      m._cleanup?.();
      if (renderer) {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, [src]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", cursor: "grab" }}
      />

      {/* Loading */}
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "relative", width: "44px", height: "44px" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "1px solid rgba(146,144,195,0.08)",
                borderTopColor: "#B0864A",
                borderRadius: "50%",
                animation: "fbg3d-spin 1s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "8px",
                border: "1px solid rgba(83,92,145,0.12)",
                borderBottomColor: "#535c91",
                borderRadius: "50%",
                animation: "fbg3d-spin 1.8s linear infinite reverse",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.56rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 600,
            }}
          >
            {loadPct > 0 ? `carregando ${loadPct}%` : "carregando modelo 3D..."}
          </span>
          <style>{`
            @keyframes fbg3d-spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* Erro */}
      {status === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.18)",
            fontSize: "0.78rem",
            textAlign: "center",
            padding: "24px",
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          Não foi possível carregar o modelo 3D.
        </div>
      )}
    </div>
  );
}
