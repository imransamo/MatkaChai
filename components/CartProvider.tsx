'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, MenuItem } from '@/lib/types';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'matka-chai-cart-v1';

function normaliseStoredCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const item = entry as Partial<CartItem>;
    if (typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.price !== 'number') return [];
    return [{
      id: item.id,
      name: item.name,
      price: Math.max(0, item.price),
      image_url: typeof item.image_url === 'string' ? item.image_url : null,
      quantity: Math.min(20, Math.max(1, Number(item.quantity) || 1)),
    }];
  }).slice(0, 30);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setItems(normaliseStoredCart(JSON.parse(stored)));
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((item: MenuItem, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) => entry.id === item.id
          ? { ...entry, quantity: Math.min(20, entry.quantity + Math.max(1, quantity)) }
          : entry);
      }
      return [...current, {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        quantity: Math.min(20, Math.max(1, quantity)),
      }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.id !== itemId));
      return;
    }
    setItems((current) => current.map((item) => item.id === itemId
      ? { ...item, quantity: Math.min(20, Math.max(1, quantity)) }
      : item));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    hydrated,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
  }), [items, hydrated, addItem, removeItem, setQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
