import axios from 'axios';
import { LoginRequest, LoginResponse, Flower, Order, CreateOrderRequest, Contact, CreateContactRequest } from '../types';

const API_BASE_URL = 'http://localhost:5140/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  register: async (userData: { username: string; email: string; password: string }): Promise<any> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },
};

export const flowersAPI = {
  getAll: async (): Promise<Flower[]> => {
    try {
      const response = await api.get('/flowers');
      return response.data;
    } catch (error) {
      console.error('Get flowers API error:', error);
      throw error;
    }
  },
  getAllForAdmin: async (): Promise<Flower[]> => {
    try {
      const response = await api.get('/flowers/admin');
      return response.data;
    } catch (error) {
      console.error('Get flowers for admin API error:', error);
      throw error;
    }
  },
  getById: async (id: number): Promise<Flower> => {
    try {
      const response = await api.get(`/flowers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get flower by ID API error:', error);
      throw error;
    }
  },
  create: async (flowerData: { name: string; description: string; price: number; stockQuantity: number; imageUrl?: string }): Promise<Flower> => {
    try {
      const response = await api.post('/flowers', flowerData);
      return response.data;
    } catch (error) {
      console.error('Create flower API error:', error);
      throw error;
    }
  },
  update: async (id: number, flowerData: { name: string; description: string; price: number; stockQuantity: number; imageUrl?: string }): Promise<Flower> => {
    try {
      const response = await api.put(`/flowers/${id}`, flowerData);
      return response.data;
    } catch (error) {
      console.error('Update flower API error:', error);
      throw error;
    }
  },
  updateStatus: async (id: number, isAvailable: boolean): Promise<Flower> => {
    try {
      const response = await api.put(`/flowers/${id}/status`, { isAvailable });
      return response.data;
    } catch (error) {
      console.error('Update flower status API error:', error);
      throw error;
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      const response = await api.delete(`/flowers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete flower API error:', error);
      throw error;
    }
  },
};

export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Get orders API error:', error);
      throw error;
    }
  },
  getMyOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      console.error('Get my orders API error:', error);
      throw error;
    }
  },
  getById: async (id: number): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID API error:', error);
      throw error;
    }
  },
  create: async (order: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await api.post('/orders', order);
      return response.data;
    } catch (error) {
      console.error('Create order API error:', error);
      throw error;
    }
  },
  updateStatus: async (orderId: number, status: string): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status API error:', error);
      throw error;
    }
  },
};

export const contactAPI = {
  getAll: async (): Promise<Contact[]> => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('Get contacts API error:', error);
      throw error;
    }
  },
  create: async (contact: CreateContactRequest): Promise<Contact> => {
    try {
      const response = await api.post('/contacts', contact);
      return response.data;
    } catch (error) {
      console.error('Create contact API error:', error);
      throw error;
    }
  },
  markAsRead: async (id: number): Promise<Contact> => {
    try {
      const response = await api.put(`/contacts/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark contact as read API error:', error);
      throw error;
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      const response = await api.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete contact API error:', error);
      throw error;
    }
  },
};

export default api; 