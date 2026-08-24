"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import TickerBar from "@/components/TickerBar";
import DiscoveryNav from "@/components/DiscoveryNav";

const DenimRunway     = dynamic(() => import("@/components/DenimRunway"),     { ssr: false });
const EssenceSection  = dynamic(() => import("@/components/EssenceSection"),  { ssr: false });
const BrandStats      = dynamic(() => import("@/components/BrandStats"),      { ssr: false });
const StatementSection= dynamic(() => import("@/components/StatementSection"),{ ssr: false });
const BrandSection    = dynamic(() => import("@/components/BrandSection"),    { ssr: false });
const OMovimento      = dynamic(() => import("@/components/OMovimento"),      { ssr: false });
const MockupSection   = dynamic(() => import("@/components/MockupSection"),   { ssr: false });
const Footer          = dynamic(() => import("@/components/Footer"),          { ssr: false });

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Hero />
      <TickerBar />
      <DiscoveryNav />
      <DenimRunway />
      <EssenceSection />
      <BrandStats />
      <StatementSection />
      <BrandSection />
      <OMovimento />
      <MockupSection />
      <Footer />
    </main>
  );
}
