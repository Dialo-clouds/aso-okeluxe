'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [subtotalKobo, setSubtotalKobo] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data.items || []);
      setSubtotalKobo(data.subtotalKobo || 0);
    } catch (err) {
      setItems([]);
      setSubtotalKobo(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId, quantity = 1) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    await refresh();
    return res.ok;
  };

  const updateItem = async (itemId, quantity) => {
    await fetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    await refresh();
  };

  const removeItem = async (itemId) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
    await refresh();
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, subtotalKobo, itemCount, loading, addItem, updateItem, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside a <CartProvider>');
  }
  return ctx;
}
