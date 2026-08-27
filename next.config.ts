import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Image Optimization ────────────────────────── */
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for versioned images
    // Fotos de produto sobem pela Shopify e chegam via CDN da própria Shopify:
    // sem isso o next/image recusa a URL e a foto nunca aparece.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.myshopify.com" },
    ],
  },

  /* ── Compression & Performance ─────────────────── */
  compress: true,
  productionBrowserSourceMaps: false,

  /* ── Headers & Security ────────────────────────── */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // O globo 3D da página de revendedores carrega a lib globe.gl por um <script> externo
          // do jsDelivr: sem liberar esse host aqui o CSP bloqueia o script e o globo some.
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https://*.myshopify.com https://fbg-jeans.vercel.app https://cdn.jsdelivr.net; font-src 'self' data:; frame-ancestors 'none';" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  /* ── Redirects & Rewrites ──────────────────────── */
  async redirects() {
    return [
      { source: "/shop", destination: "/colecao", permanent: true },
      { source: "/collection", destination: "/colecao", permanent: true },
    ];
  },

  /* ── SWR & ISR Configuration ────────────────────── */
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },

};

export default nextConfig;
