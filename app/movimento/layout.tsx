import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O Movimento",
  description:
    "Conheça a história e o manifesto da FBG Jeans. FBG não é sobre seguir tendência. É sobre construir padrão. Desde 2013.",
  alternates: { canonical: "https://fbg-jeans.vercel.app/movimento" },
  openGraph: {
    title: "O Movimento · FBG Jeans",
    description: "FBG não é sobre seguir tendência. É sobre construir padrão.",
    url: "https://fbg-jeans.vercel.app/movimento",
    images: [{ url: "/images/freebong-instagram.jpg", width: 1200, height: 630, alt: "O Movimento FBG Jeans" }],
  },
};

export default function MovimentoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
