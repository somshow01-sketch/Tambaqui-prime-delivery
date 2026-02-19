
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, AdminUser, CartItem } from '../types';
import { INITIAL_PRODUCTS, MAIN_ADMIN } from '../constants';

// Endpoint de armazenamento persistente (Simulando um Backend)
const CLOUD_STORAGE_URL = 'https://api.npoint.io/44c781d6f46759714856'; 

interface AppContextType {
  products: Product[];
  orders: Order[];
  admins: AdminUser[];
  cart: CartItem[];
  currentUser: AdminUser | null;
  appCoverImage: string;
  isSyncing: boolean;
  updateProduct: (updated: Product) => Promise<void>;
  addOrder: (order: Order) => void;
  addAdmin: (admin: AdminUser) => boolean;
  login: (u: string, p: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  setAppCoverImage: (url: string) => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([MAIN_ADMIN]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appCoverImage, setAppCoverImage] = useState<string>('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop');
  const [isSyncing, setIsSyncing] = useState(false);

  // Carregamento inicial global
  useEffect(() => {
    const savedUser = localStorage.getItem('tp_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    syncWithCloud();
  }, []);

  const syncWithCloud = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(CLOUD_STORAGE_URL);
      if (response.ok) {
        const cloudData = await response.json();
        if (cloudData.products && Array.isArray(cloudData.products)) {
          setProducts(cloudData.products);
          localStorage.setItem('tp_products', JSON.stringify(cloudData.products));
        }
        if (cloudData.appCoverImage) {
          setAppCoverImage(cloudData.appCoverImage);
          localStorage.setItem('tp_cover', cloudData.appCoverImage);
        }
        console.log("Sistema sincronizado globalmente.");
      }
    } catch (e) {
      console.warn("Conexão com a nuvem falhou, operando em modo local.");
    } finally {
      setIsSyncing(false);
    }
  };

  const pushToCloud = async (currentProducts: Product[], currentCover: string) => {
    setIsSyncing(true);
    try {
      await fetch(CLOUD_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: currentProducts,
          appCoverImage: currentCover,
          lastUpdate: new Date().toISOString()
        })
      });
      console.log("Alterações publicadas para todos os usuários.");
    } catch (e) {
      console.error("Erro ao publicar na nuvem:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts(prev => {
      const newProducts = prev.map(p => p.id === updated.id ? updated : p);
      localStorage.setItem('tp_products', JSON.stringify(newProducts));
      // Se for admin, envia para a nuvem
      if (currentUser) {
        pushToCloud(newProducts, appCoverImage);
      }
      return newProducts;
    });
  };

  const handleSetAppCoverImage = async (url: string) => {
    setAppCoverImage(url);
    localStorage.setItem('tp_cover', url);
    if (currentUser) {
      await pushToCloud(products, url);
    }
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const login = async (u: string, p: string, remember: boolean) => {
    const found = admins.find(a => a.username === u && a.password === p);
    if (found) {
      setCurrentUser(found);
      if (remember) {
        localStorage.setItem('tp_current_user', JSON.stringify(found));
      }
      await syncWithCloud();
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tp_current_user');
  };

  const addToCart = (item: CartItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      products, orders, admins, cart, currentUser, appCoverImage, isSyncing,
      updateProduct, addOrder, addAdmin: () => false, login, logout,
      addToCart, removeFromCart, clearCart, 
      setAppCoverImage: handleSetAppCoverImage, syncWithCloud
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
