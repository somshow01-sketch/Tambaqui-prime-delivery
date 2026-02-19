
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import StoreFront from './pages/Customer/StoreFront';
import CartPage from './pages/Customer/CartPage';
import CheckoutPage from './pages/Customer/CheckoutPage';
import ReceiptPage from './pages/Customer/ReceiptPage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/admin/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<StoreFront />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/receipt/:orderId" element={<ReceiptPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
