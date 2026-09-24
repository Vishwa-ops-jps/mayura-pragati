import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Search from './pages/Search';
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';
import CustomerForgotPassword from './pages/CustomerForgotPassword';
import CustomerAccount from './pages/CustomerAccount';
import NotFound from './pages/NotFound';
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboardPage from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AdminCategories from './admin/pages/Categories';
import AdminCollections from './admin/pages/Collections';
import AdminInventory from './admin/pages/Inventory';
import AdminOrders from './admin/pages/Orders';
import AdminPayments from './admin/pages/Payments';
import AdminCustomers from './admin/pages/Customers';
import AdminGifts from './admin/pages/Gifts';
import AdminOffers from './admin/pages/Offers';
import AdminBanners from './admin/pages/Banners';
import AdminReviews from './admin/pages/Reviews';
import AdminReports from './admin/pages/Reports';
import AdminSettings from './admin/pages/Settings';
import './styles/App.css';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/gifts" element={<AdminGifts />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/:category" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/signup" element={<CustomerSignup />} />
          <Route path="/forgot-password" element={<CustomerForgotPassword />} />
          <Route path="/account" element={<CustomerAccount />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
}

export default App;
