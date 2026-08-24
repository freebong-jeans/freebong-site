import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/conta/recuperar"],
      },
    ],
    sitemap: "https://fbg-jeans.vercel.app/sitemap.xml",
    host: "https://fbg-jeans.vercel.app",
  };
}
