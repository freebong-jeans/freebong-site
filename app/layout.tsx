import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import { PageTransitionProvider } from "@/components/PageTransition";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ClientPopups from "@/components/ClientPopups";
import "./globals.css";

const BASE_URL = "https://fbg-jeans.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FBG Jeans · Liberdade que se Veste",
    template: "%s | FBG Jeans",
  },
  description:
    "FBG Jeans Wear. Premium Quality Since 2013. Jeans premium, streetwear e identidade. Liberdade que se veste, qualidade que se sente.",
  keywords: ["FBG Jeans", "FBG", "Freebong", "jeans premium", "streetwear masculino", "moda masculina Brasil", "calça jeans premium"],
  authors: [{ name: "FBG Jeans" }],
  creator: "FBG Jeans",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "FBG Jeans",
    title: "FBG Jeans · Liberdade que se Veste",
    description: "Jeans premium, streetwear e identidade. Premium Quality Since 2013.",
    images: [
      {
        url: "/images/freebong-instagram.jpg",
        width: 1200,
        height: 630,
        alt: "FBG Jeans · Liberdade que se Veste",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBG Jeans · Liberdade que se Veste",
    description: "Jeans premium, streetwear e identidade. Premium Quality Since 2013.",
    images: ["/images/freebong-instagram.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <PageTransitionProvider>
            <Navbar />
            {children}
          </PageTransitionProvider>
          <CartDrawer />
          <WhatsAppFloat />
          <ClientPopups />
        </CartProvider>
      </body>
    </html>
  );
}
