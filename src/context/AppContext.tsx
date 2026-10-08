import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, StoreSettings } from '../types';
import { api, getAdminToken, setAdminToken, removeAdminToken } from '../services/api';

interface AppContextType {
  // Navigation
  currentPath: string;
  navigate: (path: string) => void;
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  // Settings
  settings: StoreSettings | null;
  refreshSettings: () => Promise<void>;
  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUser: any | null;
  loginAdmin: (token: string, user: any) => void;
  logoutAdmin: () => void;
  checkAdminAuth: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

const CART_STORAGE_KEY = 'quotes_cart_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state syncing with browser history
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => !!getAdminToken());
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync window popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshSettings = async () => {
    try {
      const s = await api.getSettings();
      setSettings(s);
    } catch (err) {
      console.error('Failed to load store settings:', err);
    }
  };

  const checkAdminAuth = async (): Promise<boolean> => {
    const token = getAdminToken();
    if (!token) {
      setIsAdminLoggedIn(false);
      setAdminUser(null);
      return false;
    }
    try {
      const res = await api.adminMe();
      setAdminUser(res.user);
      setIsAdminLoggedIn(true);
      return true;
    } catch {
      removeAdminToken();
      setIsAdminLoggedIn(false);
      setAdminUser(null);
      return false;
    }
  };

  useEffect(() => {
    refreshSettings();
    if (isAdminLoggedIn) {
      checkAdminAuth();
    }
  }, []);

  // Cart actions
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.variantId === newItem.variantId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIdx].quantity + newItem.quantity,
          newItem.maxStock || 99
        );
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
        };
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const validQty = Math.min(quantity, item.maxStock || 99);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Admin actions
  const loginAdmin = (token: string, user: any) => {
    setAdminToken(token);
    setIsAdminLoggedIn(true);
    setAdminUser(user);
  };

  const logoutAdmin = () => {
    removeAdminToken();
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    navigate('/admin/login');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        settings,
        refreshSettings,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        checkAdminAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
