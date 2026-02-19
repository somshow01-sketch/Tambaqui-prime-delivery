
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, AdminUser, CartItem } from '../types';
import { INITIAL_PRODUCTS, MAIN_ADMIN } from '../constants';

interface AppContextType {
  products: Product[];
  orders: Order[];
  admins: AdminUser[];
  cart: CartItem[];
  currentUser: AdminUser | null;
  appCoverImage: string;
  updateProduct: (updated: Product) => void;
  addOrder: (order: Order) => void;
  addAdmin: (admin: AdminUser) => boolean;
  login: (u: string, p: string, remember: boolean) => boolean;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  setAppCoverImage: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tp_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tp_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('tp_admins');
    return saved ? JSON.parse(saved) : [MAIN_ADMIN];
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('tp_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [appCoverImage, setAppCoverImage] = useState<string>(() => {
    return localStorage.getItem('tp_cover') || 'https://picsum.photos/seed/tambaqui/1200/400';
  });

  useEffect(() => {
    localStorage.setItem('tp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tp_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('tp_cover', appCoverImage);
  }, [appCoverImage]);

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addAdmin = (admin: AdminUser) => {
    if (admins.length >= 4) return false;
    setAdmins(prev => [...prev, admin]);
    return true;
  };

  const login = (u: string, p: string, remember: boolean) => {
    const found = admins.find(a => a.username === u && a.password === p);
    if (found) {
      setCurrentUser(found);
      if (remember) {
        localStorage.setItem('tp_current_user', JSON.stringify(found));
        localStorage.setItem('tp_remembered_username', u);
      } else {
        localStorage.removeItem('tp_current_user');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tp_current_user');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      products, orders, admins, cart, currentUser, appCoverImage,
      updateProduct, addOrder, addAdmin, login, logout,
      addToCart, removeFromCart, clearCart, setAppCoverImage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
