import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    nationalId: string;
  }) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { fullName?: string; email?: string; phone?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// ─── Bank ──────────────────────────────────────────────
export const bankAPI = {
  getAccounts: () => api.get('/bank/accounts'),
  createAccount: (accountType: string, initialBalance: number) =>
    api.post('/bank/accounts', { accountType, initialBalance }),
  transfer: (data: {
    fromAccountId: string;
    toAccountNumber: string;
    amount: number;
    description?: string;
  }) => api.post('/bank/transfer', data),
  deposit: (accountId: string, amount: number) =>
    api.post('/bank/deposit', { accountId, amount }),
  withdraw: (accountId: string, amount: number) =>
    api.post('/bank/withdraw', { accountId, amount }),
  getTransactions: (page?: number, limit?: number) =>
    api.get('/bank/transactions', { params: { page, limit } }),
};

// ─── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserAccounts: (userId: string) => api.get(`/admin/users/${userId}/accounts`),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getTransactions: () => api.get('/admin/transactions'),
  getLogs: (page?: number, limit?: number) =>
    api.get('/admin/logs', { params: { page, limit } }),
  adjustBalance: (data: { accountId: string; amount: number; type: 'CREDIT' | 'DEBIT'; reason?: string }) =>
    api.post('/admin/adjust-balance', data),
  updateAccountStatus: (data: { accountId: string; status: 'ACTIVE' | 'FROZEN' | 'CLOSED' }) =>
    api.post('/admin/account-status', data),
  getStats: () => api.get('/admin/stats'),
};

export default api;
