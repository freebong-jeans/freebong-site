"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getShopifyClient } from "@/lib/shopifyClient";

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
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
};

const CartCtx = createContext<CartContextType>({
  items: [], count: 0, drawerOpen: false, checkingOut: false,
  openDrawer: () => {}, closeDrawer: () => {},
  addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
  checkout: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

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
    try {
      const client = getShopifyClient();
      const shopifyCheckout = await client.checkout.create();
      const lineItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));
      const updated = await client.checkout.addLineItems(shopifyCheckout.id, lineItems);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.location.href = (updated as any).webUrl;
    } catch (err) {
      console.error("Erro ao criar checkout Shopify:", err);
      setCheckingOut(false);
    }
  }

  return (
    <CartCtx.Provider value={{
      items, count, drawerOpen, checkingOut,
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
