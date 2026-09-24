import { API_URL } from './api';

// Customer portal auth - separate storage keys from the admin auth service
// (services/authService.js) so the two never clash.
const TOKEN_KEY = 'mayura_customer_token';
const CUSTOMER_KEY = 'mayura_customer';

const customerAuthService = {
  async signup(name, phone, password, shippingAddress = {}) {
    const response = await fetch(`${API_URL}/customer-auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password, ...shippingAddress }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Signup failed');

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data.customer));
    return data;
  },

  async login(phone, password) {
    const response = await fetch(`${API_URL}/customer-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data.customer));
    return data;
  },

  async forgotPassword(phone) {
    const response = await fetch(`${API_URL}/customer-auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Unable to send verification code');
    return data;
  },

  async resetPassword(phone, otp, newPassword) {
    const response = await fetch(`${API_URL}/customer-auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, newPassword }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Unable to reset password');
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCustomer() {
    try {
      return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || 'null');
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  // Last 6 months by default; pass 'all' for the full order history.
  async getMyOrders(range = '6months') {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/customer-auth/me/orders${range === 'all' ? '?range=all' : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to load your orders');
    return data;
  },
};

export default customerAuthService;
