import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const invoiceService = {
  // Get all invoices (paginated)
  getInvoices: async () => {
    try {
      const response = await api.get('/api/invoices/');
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get single invoice by ID
  getInvoice: async (id) => {
    try {
      const response = await api.get(`/api/invoices/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Approve invoice
  approveInvoice: async (id, notes) => {
    try {
      const response = await api.patch(`/api/invoices/approve/${id}/`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error approving invoice:', error);
      throw error;
    }
  },

  // Process new invoice
  processInvoice: async (formData) => {
    try {
      const response = await api.post('/api/process-invoice/', formData);
      return response.data;
    } catch (error) {
      console.error('Error processing invoice:', error);
      throw error;
    }
  },
};
