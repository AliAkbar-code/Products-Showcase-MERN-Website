import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import Catalog from './pages/public/Catalog';
import ProductDetail from './pages/public/ProductDetail';
import AboutUs from './pages/public/AboutUs';
import Services from './pages/public/Services';
import ContactUs from './pages/public/ContactUs';
import AdminLogin from './pages/admin/AdminLogin';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import DashboardLayout from './pages/admin/DashboardLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageSettings from './pages/admin/ManageSettings';
import ManageHomepage from './pages/admin/ManageHomepage';
import ManageMessages from './pages/admin/ManageMessages';
import AdminSettings from './pages/admin/AdminSettings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Reviews from './pages/admin/Reviews';
import ScrollToTop from './components/ScrollToTop'; 
import './index.css';

export const AuthContext = createContext();

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      <Router>
        <ScrollToTop />
        <Navbar />
        <main
          style={{
            minHeight: 'calc(100vh - 80px)',
            backgroundColor: '#fff'
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Auth Route */}
            <Route path="/login" element={isAdmin ? <Navigate to="/admin/overview" /> : <AdminLogin />} />
            <Route path="/forgot-password" element={isAdmin ? <Navigate to="/admin/overview" /> : <ForgotPassword />} />
            <Route path="/reset-password/:token" element={isAdmin ? <Navigate to="/admin/overview" /> : <ResetPassword />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={isAdmin ? <DashboardLayout /> : <Navigate to="/login" />}>
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="homepage" element={<ManageHomepage />} />
              <Route path="site-settings" element={<ManageSettings />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="reviews" element={<Reviews />} />
              <Route index element={<Navigate to="overview" />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
