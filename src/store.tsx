import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialState } from './data';
import type { DemoRole, DemoState, LocalTask, Product } from './types';

type ToastKind = 'success' | 'error' | 'info';
interface ToastState { message: string; kind: ToastKind }
interface AppContextValue {
  data: DemoState;
  toast: ToastState | null;
  notify: (message: string, kind?: ToastKind) => void;
  setRole: (role: DemoRole) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addTask: (task: LocalTask) => void;
  updateTask: (id: string, patch: Partial<LocalTask>) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateArtisanVerification: (status: DemoState['artisanVerificationStatus'], note: string) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = 'kalasetu-prototype-v1';
const AppContext = createContext<AppContextValue | null>(null);

function loadSavedState(): DemoState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed = JSON.parse(saved) as Partial<DemoState>;
    return {
      ...initialState,
      ...parsed,
      products: Array.isArray(parsed.products) ? parsed.products : initialState.products,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : initialState.tasks,
      cart: Array.isArray(parsed.cart) ? parsed.cart : initialState.cart,
    };
  } catch {
    return initialState;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoState>(loadSavedState);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('KalaSetu demo state could not be saved locally.', error);
    }
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = useCallback((message: string, kind: ToastKind = 'success') => setToast({ message, kind }), []);
  const setRole = useCallback((role: DemoRole) => setData((current) => ({ ...current, role })), []);
  const addProduct = useCallback((product: Product) => setData((current) => ({ ...current, products: [product, ...current.products] })), []);
  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setData((current) => ({ ...current, products: current.products.map((product) => product.id === id ? { ...product, ...patch } : product) }));
  }, []);
  const addTask = useCallback((task: LocalTask) => setData((current) => ({ ...current, tasks: [task, ...current.tasks] })), []);
  const updateTask = useCallback((id: string, patch: Partial<LocalTask>) => {
    setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, ...patch } : task) }));
  }, []);
  const addToCart = useCallback((productId: string) => {
    setData((current) => {
      const found = current.cart.find((line) => line.productId === productId);
      return { ...current, cart: found
        ? current.cart.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current.cart, { productId, quantity: 1 }] };
    });
  }, []);
  const removeFromCart = useCallback((productId: string) => {
    setData((current) => ({ ...current, cart: current.cart.filter((line) => line.productId !== productId) }));
  }, []);
  const clearCart = useCallback(() => setData((current) => ({ ...current, cart: [] })), []);
  const updateArtisanVerification = useCallback((status: DemoState['artisanVerificationStatus'], note: string) => {
    setData((current) => ({ ...current, artisanVerificationStatus: status, coordinatorNote: note }));
  }, []);
  const resetDemo = useCallback(() => {
    setData({ ...initialState, products: initialState.products, tasks: initialState.tasks, cart: [] });
    localStorage.removeItem(STORAGE_KEY);
    setToast({ message: 'Demo reset to the original KalaSetu story.', kind: 'info' });
  }, []);

  const value = useMemo(() => ({ data, toast, notify, setRole, addProduct, updateProduct, addTask, updateTask, addToCart, removeFromCart, clearCart, updateArtisanVerification, resetDemo }), [data, toast, notify, setRole, addProduct, updateProduct, addTask, updateTask, addToCart, removeFromCart, clearCart, updateArtisanVerification, resetDemo]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
