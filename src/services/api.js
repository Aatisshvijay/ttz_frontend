import axios from 'axios';
import { getSessionId } from './utils/session';

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://your-render-backend-url.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cloudinary Utilities
export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  return parts.length === 2 
    ? `${parts[0]}/upload/f_auto,q_auto:best,w_${width},fl_progressive,dpr_auto/${parts[1]}`
    : url;
};

export const getBlurPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  return parts.length === 2 
    ? `${parts[0]}/upload/w_20,e_blur:1000,q_auto:low,f_auto/${parts[1]}`
    : null;
};

export const getOptimizedImageUrl = (url, width = 400) => {
  return optimizeCloudinaryUrl(url, width);
};

// API Services
const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await axiosInstance.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  getMe: async (token) => {
    const response = await axiosInstance.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  logout: async (token) => {
    const response = await axiosInstance.post('/api/auth/logout', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

const bucketlistApi = {
  getBucketlist: async (token) => {
    const sessionId = getSessionId();
    const response = await axiosInstance.get('/api/bucketlist', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  migrateBucketlist: async (token) => {
    const sessionId = getSessionId();
    const response = await axiosInstance.post('/api/bucketlist/migrate', 
      { sessionId },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  }
};

const templeApi = {
  getDeities: async () => {
    const response = await axiosInstance.get('/api/temples/deities');
    return response.data;
  },

  getGodTemples: async (deity) => {
    const response = await axiosInstance.get(`/api/temples/deity/${encodeURIComponent(deity)}`);
    return response.data;
  },

  getCategoryTemples: async (deity, category) => {
    const response = await axiosInstance.get(
      `/api/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`
    );
    return response.data;
  },

  getTempleById: async (id) => {
    const response = await axiosInstance.get(`/api/temples/${id}`);
    return response.data;
  },

  searchTemples: async (query, limit = 50) => {
    const response = await axiosInstance.get(`/api/temples/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  }
};

export const api = {
  auth: authApi,
  bucketlist: bucketlistApi,
  temples: templeApi
};