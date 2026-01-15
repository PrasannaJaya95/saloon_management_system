import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import WebsiteLayout from './layouts/WebsiteLayout';

// Pages
import Home from './pages/website/Home';
import Booking from './pages/website/Booking';
import Shop from './pages/website/Shop';
import ProductDetails from './pages/website/ProductDetails';
import Cart from './pages/website/Cart';
import Checkout from './pages/website/Checkout';
import Services from './pages/website/Services';
import About from './pages/website/About';
import Contact from './pages/website/Contact';
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
import AdminLogin from './pages/auth/AdminLogin';

// Customer Portal
import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyBookings from './pages/customer/MyBookings';
import MyOrders from './pages/customer/MyOrders';
import Profile from './pages/customer/Profile';

// Protected Route Component with Role Check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    // If trying to access admin route, go to admin login, else site login
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Role Based Access Control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user tries to access admin, but is just a User -> Go to customer dashboard
    if (user.role === 'User') return <Navigate to="/dashboard" replace />;
    // If admin tries to access customer restricted? (Usually admins can access everything, but let's stick to logic)
    return <Navigate to="/" replace />;
  }

  return children;
};

import { useLocation } from 'react-router-dom';

import { ShopProvider } from './context/ShopContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <ThemeProvider>
            <ToastProvider>
              <CartProvider>
                <Routes>
                  {/* Public Website Routes */}
                  <Route path="/" element={<WebsiteLayout />}>
                    <Route index element={<Home />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="shop/product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="services" element={<Services />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Customer Portal Routes (Simplified URLs) */}
                  <Route element={
                    <ProtectedRoute allowedRoles={['User', 'SuperAdmin', 'Admin']}> {/* Admins can view portal too if they want */}
                      <CustomerLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/dashboard" element={<CustomerDashboard />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  {/* Admin Dashboard Routes (Protected & Restricted) */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'SalonAdmin', 'HRAdmin', 'Manager']}>
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
                    <Route path="profile" element={<Profile />} />
                    <Route path="chairs" element={<Chairs />} />
                  </Route>
                </Routes>
              </CartProvider>
            </ToastProvider>
          </ThemeProvider>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
