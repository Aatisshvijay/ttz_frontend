import { getSessionId } from './utils/session'; // Assuming you have this helper function

// API service for handling all backend calls
const BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';

// --- Helper Functions ---

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network or server error occurred' }));
    throw new Error(errorData.error || errorData.message || 'Failed to fetch');
  }
  return response.json();
};

const createHeaders = (token, isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// FULL HD QUALITY: q_auto:best for maximum sharpness
export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto:best,w_${width},fl_progressive,dpr_auto/${parts[1]}`;
  }
  return url;
};

// Get blur placeholder (tiny 20px version for instant loading)
export const getBlurPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_20,e_blur:1000,q_auto:low,f_auto/${parts[1]}`;
  }
  return null;
};

// Get optimized image URL with specific width
export const getOptimizedImageUrl = (url, width = 400) => {
  return optimizeCloudinaryUrl(url, width);
};

// --- API Service Definitions ---

const authApi = {
  login: async (email, password) => {
    // Correct Path: ${BASE_URL}/api/auth/login
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: createHeaders(null, true),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name, email, password) => {
    // Correct Path: ${BASE_URL}/api/auth/register
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: createHeaders(null, true),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  getMe: async (token) => {
    // Correct Path: ${BASE_URL}/api/auth/me
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: createHeaders(token, false),
    });
    return handleResponse(response);
  },
  
  logout: async (token) => {
    // Correct Path: ${BASE_URL}/api/auth/logout
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: createHeaders(token, false),
    });
    return handleResponse(response);
  }
};

const bucketlistApi = {
  getBucketlist: async (token) => {
    const sessionId = getSessionId();
    // Correct Path: ${BASE_URL}/api/bucketlist
    const response = await fetch(`${BASE_URL}/api/bucketlist`, {
      method: 'GET',
      headers: createHeaders(token, false),
      // CRITICAL: Ensure sessionId is sent for unauthenticated users if your backend requires it
      headers: { 
        ...createHeaders(token, false), 
        'x-session-id': sessionId 
      },
    });
    return handleResponse(response);
  },

  // ... other bucketlist methods (addItem, removeItem, checkItem) ...
  
  migrateBucketlist: async (token) => {
    const sessionId = getSessionId();
    // Correct Path: ${BASE_URL}/api/bucketlist/migrate
    const response = await fetch(`${BASE_URL}/api/bucketlist/migrate`, {
      method: 'POST',
      headers: createHeaders(token, true),
      body: JSON.stringify({ sessionId })
    });
    return handleResponse(response);
  }
};

const templeApi = {
  getDeities: async () => {
    // Correct Path: ${BASE_URL}/api/temples/deities
    const response = await fetch(`${BASE_URL}/api/temples/deities`);
    return handleResponse(response);
  },
  
  getGodTemples: async (deity) => {
    // Correct Path: ${BASE_URL}/api/temples/deity/:deity
    const response = await fetch(`${BASE_URL}/api/temples/deity/${encodeURIComponent(deity)}`);
    return handleResponse(response);
  },
  
  getCategoryTemples: async (deity, category) => {
    // Correct Path: ${BASE_URL}/api/temples/deity/:deity/:category
    const response = await fetch(`${BASE_URL}/api/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },

  getTempleById: async (id) => {
    // Correct Path: ${BASE_URL}/api/temples/:id
    const response = await fetch(`${BASE_URL}/api/temples/${id}`);
    return handleResponse(response);
  },

  searchTemples: async (query, limit = 50) => {
    // Correct Path: ${BASE_URL}/api/temples/search?q=...
    const response = await fetch(`${BASE_URL}/api/temples/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return handleResponse(response);
  }
};


// Combine all APIs into a single export object
export const api = {
  auth: authApi,
  bucketlist: bucketlistApi,
  temples: templeApi
};

// Export the base functions for use in other utilities/components
export * from './utils/cloudinary'; // Assuming you have your cloudinary utilities in a separate file