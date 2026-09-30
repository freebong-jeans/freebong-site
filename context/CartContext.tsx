"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { criarCheckoutUrl } from "@/lib/shopifyCheckout";

export type CartItem = {
  id: string;
  handle: string;
  title: string;
  price: string;
  variantId: string;
  variantTitle: string;
  imageSrc?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  drawerOpen: boolean;
  checkingOut: boolean;
  erroCheckout: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
};

const CartCtx = createContext<CartContextType>({
  items: [], count: 0, drawerOpen: false, checkingOut: false, erroCheckout: null,
  openDrawer: () => {}, closeDrawer: () => {},
  addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
  checkout: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [erroCheckout, setErroCheckout] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fbg_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("fbg_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === item.variantId);
      if (existing) {
        return prev.map(i =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setDrawerOpen(true);
  }

  function removeItem(variantId: string) {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  }

  function updateQty(variantId: string, qty: number) {
    if (qty <= 0) { removeItem(variantId); return; }
    setItems(prev => prev.map(i => i.variantId === variantId ? { ...i, quantity: qty } : i));
  }

  async function checkout() {
    if (items.length === 0 || checkingOut) return;
    setCheckingOut(true);
    setErroCheckout(null);
    try {
      const url = await criarCheckoutUrl(
        items.map((item) => ({ variantId: item.variantId, quantity: item.quantity }))
      );
      window.location.href = url;
    } catch (err) {
      console.error("Erro ao abrir o checkout da Shopify:", err);
      setErroCheckout(
        err instanceof Error ? err.message : "Nao foi possivel abrir o pagamento."
      );
      setCheckingOut(false);
    }
  }

  return (
    <CartCtx.Provider value={{
      items, count, drawerOpen, checkingOut, erroCheckout,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      removeItem,
      updateQty,
      clearCart: () => setItems([]),
      checkout,
    }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  return useContext(CartCtx);
}
