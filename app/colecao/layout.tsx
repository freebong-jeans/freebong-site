import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coleção",
  description:
    "Explore a coleção completa FBG Jeans. Calças slim, skinny e reta, bermudas, jaquetas e muito mais. Qualidade premium, desde 2013.",
  alternates: { canonical: "https://fbg-jeans.vercel.app/colecao" },
  openGraph: {
    title: "Coleção FBG Jeans",
    description: "Explore a coleção completa. Jeans premium, streetwear e identidade.",
    url: "https://fbg-jeans.vercel.app/colecao",
    images: [{ url: "/images/freebong-instagram.jpg", width: 1200, height: 630, alt: "Coleção FBG Jeans" }],
  },
};

export default function ColecaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
