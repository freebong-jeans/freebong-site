import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parceiros FBG",
  description:
    "Mais de 200 lojas parceiras em 27 estados. Encontre a loja FBG Jeans Wear mais perto de você ou traga a marca para a sua loja.",
  alternates: { canonical: "https://fbg-jeans.vercel.app/parceiros" },
  openGraph: {
    title: "Parceiros FBG · Encontre uma loja perto de você",
    description: "Mais de 200 lojas parceiras em 27 estados do Brasil.",
    url: "https://fbg-jeans.vercel.app/parceiros",
    images: [{ url: "/images/campaign/dsc01536.jpg", width: 1200, height: 630, alt: "Parceiros FBG" }],
  },
};

export default function ParceirosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
