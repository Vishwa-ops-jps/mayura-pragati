import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import customerAuthService from '../services/customerAuthService';
import '../styles/CustomerAccount.css';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const CustomerAccount = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState('6months');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const customer = customerAuthService.getCustomer();

  useEffect(() => {
    document.title = 'My Account | Mayura Regalia';
  }, []);

  useEffect(() => {
    if (!customerAuthService.isAuthenticated()) return;
    setLoading(true);
    setError('');
    customerAuthService
      .getMyOrders(range)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [range]);

  if (!customerAuthService.isAuthenticated()) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    customerAuthService.logout();
    navigate('/');
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <div>
          <span className="account-eyebrow">MAYURA REGALIA</span>
          <h1>My Account</h1>
          <p>Welcome back, {customer?.name || 'there'}.</p>
        </div>
        <button className="account-logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="account-orders-toolbar">
        <h2>Order History</h2>
        <div className="account-range-toggle">
          <button
            className={range === '6months' ? 'active' : ''}
            onClick={() => setRange('6months')}
          >
            Last 6 months
          </button>
          <button
            className={range === 'all' ? 'active' : ''}
            onClick={() => setRange('all')}
          >
            All orders
          </button>
        </div>
      </div>

      {loading && <div className="account-state">Loading your orders...</div>}
      {!loading && error && <div className="account-state account-state-error">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="account-state">
          No orders found {range === '6months' ? 'in the last 6 months' : ''}.
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="account-orders-list">
          {orders.map((order) => (
            <div className="account-order-card" key={order.id}>
              <div className="account-order-top">
                <div>
                  <span className="account-order-number">{order.orderNumber}</span>
                  <span className="account-order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className="account-order-status">
                  <span className={`status-pill status-${order.orderStatus}`}>{order.orderStatus}</span>
                  <span className={`status-pill status-${order.paymentStatus}`}>{order.paymentStatus}</span>
                </div>
              </div>

              <div className="account-order-items">
                {(order.items || []).map((item) => (
                  <div className="account-order-item" key={item.id}>
                    {item.image && <img src={item.image} alt={item.productName} />}
                    <div>
                      <p className="item-name">{item.productName}</p>
                      <p className="item-meta">Qty {item.quantity} · ₹{Number(item.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="account-order-bottom">
                <span>Total</span>
                <strong>₹{Number(order.total).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerAccount;
