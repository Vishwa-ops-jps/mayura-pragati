import React, { useEffect } from 'react';
import { NavLink, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import '../styles/AdminDashboard.css';

const MENU = [
  { to: '/admin/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/admin/products', icon: '◇', label: 'Products' },
  { to: '/admin/categories', icon: '◈', label: 'Categories' },
  { to: '/admin/collections', icon: '❖', label: 'Collections' },
  { to: '/admin/inventory', icon: '▥', label: 'Inventory' },
  { to: '/admin/orders', icon: '▤', label: 'Orders' },
  { to: '/admin/payments', icon: '¤', label: 'Payments' },
  { to: '/admin/customers', icon: '♙', label: 'Customers' },
  { to: '/admin/gifts', icon: '⁂', label: 'Gifts' },
  { to: '/admin/offers', icon: '%', label: 'Offers / Coupons' },
  { to: '/admin/banners', icon: '▭', label: 'Banners' },
  { to: '/admin/reviews', icon: '★', label: 'Reviews' },
  { to: '/admin/reports', icon: '▲', label: 'Reports' },
  { to: '/admin/settings', icon: '⚙', label: 'Settings' },
];

const TITLES = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/collections': 'Collections',
  '/admin/inventory': 'Inventory',
  '/admin/orders': 'Orders',
  '/admin/payments': 'Payments',
  '/admin/customers': 'Customers',
  '/admin/gifts': 'Gifts',
  '/admin/offers': 'Offers & Coupons',
  '/admin/banners': 'Banners',
  '/admin/reviews': 'Reviews',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = authService.getAdmin();
  const title = TITLES[location.pathname] || 'Admin';

  useEffect(() => {
    document.title = `${title} · Mayura Regalia Admin`;
  }, [title]);

  if (!authService.isAuthenticated()) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    authService.logout();
    navigate('/admin/login', { replace: true });
  };

  const initial = (admin?.name || 'A').trim().charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src="/LOGO_Mayura_Regalia.png" alt="Mayura Regalia" />
          <span>ADMIN PANEL</span>
        </div>
        <nav>
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>↪ Logout</button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-mobile-label">MAYURA REGALIA</span>
            <h1>{title}</h1>
          </div>
          <div className="admin-profile">
            <span className="admin-date-chip">📅 {today}</span>
            <div className="avatar">{initial}</div>
            <div><strong>{admin?.name || 'Admin'}</strong><small>Administrator</small></div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
