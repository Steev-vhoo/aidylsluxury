"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type CartLine = {
  key: string; // productId:variantId
  productId: number | string;
  slug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  unitPesewas: number;
  qty: number;
  minQty: number;
  image?: string;
};

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

// --- tiny localStorage-backed store ---
const STORAGE_KEY = "aidyls-cart-v1";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: CartLine[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const noop = () => () => {};
const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noop, () => true, () => false);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    const key = `${line.productId}:${line.variantId}`;
    const prev = read();
    const existing = prev.find((l) => l.key === key);
    write(existing ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l)) : [...prev, { ...line, key, qty: Math.max(line.qty, line.minQty) }]);
  }, []);
  const setQty = useCallback((key: string, qty: number) => write(read().map((l) => (l.key === key ? { ...l, qty: Math.max(l.minQty, qty) } : l))), []);
  const remove = useCallback((key: string) => write(read().filter((l) => l.key !== key)), []);
  const clear = useCallback(() => write(EMPTY), []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      ready,
      count: lines.reduce((a, l) => a + l.qty, 0),
      subtotal: lines.reduce((a, l) => a + l.qty * l.unitPesewas, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, ready, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
