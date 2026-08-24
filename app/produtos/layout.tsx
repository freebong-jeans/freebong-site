import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produto",
  description: "Peças FBG Jeans. Qualidade premium, design e liberdade em cada item.",
  openGraph: {
    images: [{ url: "/images/freebong-instagram.jpg", width: 1200, height: 630, alt: "FBG Jeans" }],
  },
};

export default function ProdutosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
