import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import WebsiteLayout from './layouts/WebsiteLayout';

// Pages
import Home from './pages/website/Home';
import Booking from './pages/website/Booking';
import Shop from './pages/website/Shop';
import Cart from './pages/website/Cart';
import Checkout from './pages/website/Checkout';
import Dashboard from './pages/admin/Dashboard';
import POS from './pages/admin/POS';
import Staff from './pages/admin/Staff';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Bookings from './pages/admin/Bookings';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import Chairs from './pages/admin/Chairs';
import Login from './pages/auth/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<WebsiteLayout />}>
              <Route index element={<Home />} />
              <Route path="booking" element={<Booking />} />
              <Route path="shop" element={<Shop />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="services" element={<div className="p-20 text-center text-white">Services Page Coming Soon</div>} />
              <Route path="about" element={<div className="p-20 text-center text-white">About Page Coming Soon</div>} />
              <Route path="contact" element={<div className="p-20 text-center text-white">Contact Page Coming Soon</div>} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Dashboard Routes (Protected) */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="orders" element={<Orders />} />
              <Route path="staff" element={<Staff />} />
              <Route path="pos" element={<POS />} />

              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chairs" element={<Chairs />} />
            </Route>
          </Routes>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
