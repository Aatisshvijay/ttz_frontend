// --- CRITICAL FIX: DEFINE MISSING SESSION FUNCTION LOCALLY ---
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('temple_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('temple_session_id', sessionId);
  }
  return sessionId;
};

// API service for handling all backend calls
const BASE_URL = import.meta.env.VITE_APP_API_URL || '';

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

// --- Cloudinary Utilities ---
export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto:best,w_${width},fl_progressive,dpr_auto/${parts[1]}`;
  }
  return url;
};

export const getBlurPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_20,e_blur:1000,q_auto:low,f_auto/${parts[1]}`;
  }
  return null;
};

export const getOptimizedImageUrl = (url, width = 400) => {
  return optimizeCloudinaryUrl(url, width);
};

// Helper function to get image with fallback
export const getImageWithFallback = (temple) => {
  return temple.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
};

export const getImageUrl = (imageUrl) => {
  return imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
};

// --- API Service Definitions ---
const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: createHeaders(null, true),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: createHeaders(null, true),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  getMe: async (token) => {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: createHeaders(token, false),
    });
    return handleResponse(response);
  },
  
  logout: async (token) => {
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
    const response = await fetch(`${BASE_URL}/api/bucketlist`, {
      method: 'GET',
      headers: { 
        ...createHeaders(token, false), 
        'x-session-id': sessionId 
      },
    });
    return handleResponse(response);
  },

  addItem: async (token, templeId) => {
    const sessionId = getSessionId();
    const response = await fetch(`${BASE_URL}/api/bucketlist`, {
      method: 'POST',
      headers: { 
        ...createHeaders(token, true), 
        'x-session-id': sessionId 
      },
      body: JSON.stringify({ templeId })
    });
    return handleResponse(response);
  },

  removeItem: async (token, templeId) => {
    const sessionId = getSessionId();
    const response = await fetch(`${BASE_URL}/api/bucketlist/${templeId}`, {
      method: 'DELETE',
      headers: { 
        ...createHeaders(token, false), 
        'x-session-id': sessionId 
      },
    });
    return handleResponse(response);
  },

  checkItem: async (token, templeId) => {
    const sessionId = getSessionId();
    const response = await fetch(`${BASE_URL}/api/bucketlist/check/${templeId}`, {
      method: 'GET',
      headers: { 
        ...createHeaders(token, false), 
        'x-session-id': sessionId 
      },
    });
    return handleResponse(response);
  },
  
  migrateBucketlist: async (token) => {
    const sessionId = getSessionId();
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
    const response = await fetch(`${BASE_URL}/api/temples/deities`);
    return handleResponse(response);
  },
  
  getGodTemples: async (deity) => {
    const response = await fetch(`${BASE_URL}/api/temples/deity/${encodeURIComponent(deity)}`);
    return handleResponse(response);
  },
  
  getCategoryTemples: async (deity, category) => {
    const response = await fetch(`${BASE_URL}/api/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },

  // ADDED: Missing function used in AvatarTemplesPage and CategoryTemplesPage
  getAvatarTemples: async (deity, category) => {
    const response = await fetch(`${BASE_URL}/api/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },

  getTempleById: async (id) => {
    const response = await fetch(`${BASE_URL}/api/temples/${id}`);
    return handleResponse(response);
  },

  searchTemples: async (query, limit = 50) => {
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