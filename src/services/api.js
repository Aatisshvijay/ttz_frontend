// API service for handling all backend calls
const BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// ===========================================
// CRITICAL FIX: ENSURE '/api' PREFIX IS ALWAYS USED
// ===========================================
// This function prepends '/api' if it's not already present (and if a full URL is provided)
// This solves the '.../bucketlist' error by making it '.../api/bucketlist'
const buildApiUrl = (endpoint) => {
    // If BASE_URL is a full URL (prod), append /api/ to the endpoint
    if (BASE_URL.startsWith('http')) {
        // Remove leading slash from endpoint if present
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        return `${BASE_URL}/api/${cleanEndpoint}`;
    }
    // If BASE_URL is '/api' (dev), just append the endpoint
    return `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};
// ===========================================


// FULL HD QUALITY: q_auto:best for maximum sharpness
export const optimizeCloudinaryUrl = (url, width = 800) => {
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)
// ... (rest of image functions remain unchanged)

export const api = {
  auth: {
    register: async (name, email, password) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('auth/register'), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ name, email, password })
      });
      return handleResponse(response);
    },

    login: async (email, password) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('auth/login'), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },

    logout: async (token) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('auth/logout'), {
        method: 'POST',
        headers: createHeaders(token, true)
      });
      return handleResponse(response);
    },

    getMe: async (token) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('auth/me'), {
        method: 'GET',
        headers: createHeaders(token, true)
      });
      return handleResponse(response);
    }
  },

  temples: {
    getAll: async () => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('temples'));
      return handleResponse(response);
    },

    getFeaturedTemples: async () => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('temples'));
      return handleResponse(response);
    },

    getById: async (id) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl(`temples/${id}`));
      return handleResponse(response);
    },

    getByDeity: async (deity) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl(`temples/deity/${encodeURIComponent(deity)}`));
      return handleResponse(response);
    },

    getByDeityAndCategory: async (deity, category) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl(`temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`));
      return handleResponse(response);
    },

    search: async (query, limit = 50) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl(`temples/search?q=${encodeURIComponent(query)}&limit=${limit}`));
      return handleResponse(response);
    },

    getDeities: async () => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl('temples/deities'));
      return handleResponse(response);
    },

    getDeitiesWithCategories: async (deity) => {
      // FIX APPLIED HERE
      const response = await fetch(buildApiUrl(`temples/deities/${encodeURIComponent(deity)}/categories`));
      return handleResponse(response);
    }
  },

  getBucketlist: async (token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl('bucketlist'), {
      method: 'GET',
      headers
    });
    return handleResponse(response);
  },

  addToBucketlist: async (templeId, token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl('bucketlist'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ templeId })
    });
    return handleResponse(response);
  },

  removeFromBucketlist: async (templeId, token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl(`bucketlist/${templeId}`), {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },

  clearBucketlist: async (token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl('bucketlist'), {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },

  migrateBucketlist: async (token) => {
    const sessionId = getSessionId();
    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl('bucketlist/migrate'), {
      method: 'POST',
      headers: createHeaders(token, true),
      body: JSON.stringify({ sessionId })
    });
    return handleResponse(response);
  }
};

export const templeApi = {
  ...api.temples,
  getGodTemples: async (deity) => {
    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl(`temples/deity/${encodeURIComponent(deity)}`));
    return handleResponse(response);
  },
  
  getCategoryTemples: async (deity, category) => {
    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl(`temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`));
    return handleResponse(response);
  },
  
  getAvatarTemples: async (deity, category) => {
    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl(`temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`));
    return handleResponse(response);
  },

  getTempleById: async (id) => {
    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl(`temples/${id}`));
    return handleResponse(response);
  },

  searchTemples: async (query, limit = 50) => {
    // FIX APPLIED HERE
    const response = await fetch(buildApiUrl(`temples/search?q=${encodeURIComponent(query)}&limit=${limit}`));
    return handleResponse(response);
  }
};

export const bucketlistApi = {
  getBucketlist: api.getBucketlist,
  addToBucketlist: api.addToBucketlist,
  removeFromBucketlist: api.removeFromBucketlist,
  clearBucketlist: api.clearBucketlist
};

export default api;