// src/services/api.js

// ============================================
// CRITICAL: Update with your actual Render URL
// NOTE: Ensure VITE_API_URL is set in your Vercel/local environment
// ============================================
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ttz-backend.onrender.com'; 

console.log('🌐 API Base URL:', BASE_URL);

// Session ID management
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('temple_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('temple_session_id', sessionId);
  }
  return sessionId;
};

// Enhanced fetch with retry logic and better error handling
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}/${retries}: ${url}`);
      
      const response = await fetch(url, options);
      
      // Handle successful response
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Request successful');
        return data;
      }
      
      // Handle error response
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || `HTTP ${response.status}`;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}`;
      }
      
      console.error(`❌ API Error (${response.status}):`, errorMessage);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(errorMessage);
      }
      
      // Retry on server errors (5xx) or network issues
      if (attempt === retries - 1) {
        throw new Error(`Failed after ${retries} attempts: ${errorMessage}`);
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
    } catch (error) {
      console.error(`❌ Fetch attempt ${attempt + 1} failed:`, error.message);
      
      // If it's the last attempt, throw the error
      if (attempt === retries - 1) {
        throw new Error(`Network error after ${retries} attempts: ${error.message}`);
      }
      
      // Wait before retrying
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Helper to create headers
const createHeaders = (token, includeContentType = true) => {
  const headers = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ============================================
// Cloudinary Image Optimization
// ============================================
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

// ============================================
// Image Fallback System 
// ============================================
export const getImageWithFallback = (temple) => {
  if (!temple.image || temple.image.includes('placeholder')) {
    const deity = temple.deity?.toLowerCase() || '';
    const category = temple.category?.toLowerCase() || '';
    
    // Vishnu avatars
    if (deity.includes('maha avatars of vishnu') || category.includes('divya desam')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png';
    } else if (deity.includes('krishna') || category.includes('krishna')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147334/krishna_cwqrsj.png';
    } else if (deity.includes('rama') || category.includes('rama')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147283/rama_jb7c67.png';
    } else if (deity.includes('narasimha') || category.includes('narasimha')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147309/narasimha_zuqnth.png';
    } else if (deity.includes('varaha') || category.includes('varaha')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147273/varaha_dbildy.png';
    } else if (deity.includes('vamana') || category.includes('vamana')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147283/vamana_bfz0nq.png';
    } else if (deity.includes('parshuram') || category.includes('parshuram')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147298/parshurama_jrryj4.png';
    } else if (deity.includes('matsya') || category.includes('matsya')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147315/matsya_nr5z9h.png';
    } else if (deity.includes('kurma') || category.includes('kurma')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147338/kurmam_clsc26.png';
    }
    // Shiva
    else if (deity.includes('shiva')) {
      if (category.includes('jyotirlinga')) {
        return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147279/shiva_h9u69h.png';
      } else if (category.includes('pancha bhoota')) {
        return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147292/pb_ng5jll.png';
      } else {
        return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147363/bh_y9yjn1.png';
      }
    }
    // Shakti
    else if (deity.includes('shakti') || deity.includes('goddess shakti')) {
      if (category.includes('shakti peetha')) {
        return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147281/shakti_e7kaaz.png';
      } else {
        return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147392/dt2_oyytsm.png';
      }
    }
    // Other deities
    else if (deity.includes('lakshmi') || deity.includes('goddess lakshmi')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147323/laxmi_su1sgk.png';
    } else if (deity.includes('hanuman')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147343/hanuman_smnyyx.png';
    } else if (deity.includes('ganesha')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147355/ganesha_xgclup.png';
    } else if (deity.includes('murugan')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147315/murugan_djfmgk.png';
    } else if (deity.includes('ayyappa')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147367/ayyapa_btcxp1.png';
    } else if (deity.includes('navagraha') || category.includes('navagraha')) {
      return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147307/navagraha_v5uk7h.png';
    }
    
    // Default fallback
    return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png';
  }
  return temple.image;
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png';
  }
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `${BASE_URL.replace('/api', '')}${imageUrl}`;
};

// ============================================
// Authentication API
// ============================================
const authApi = {
  login: async (email, password) => {
    return await fetchWithRetry(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(null, true),
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    return await fetchWithRetry(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(null, true),
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe: async (token) => {
    return await fetchWithRetry(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: createHeaders(token, false),
    });
  },
  
  logout: async (token) => {
    return await fetchWithRetry(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: createHeaders(token, false),
    });
  }
};

// ============================================
// Bucketlist API
// ============================================
const bucketlistApi = {
  getBucketlist: async (token) => {
    const sessionId = getSessionId();
    return await fetchWithRetry(`${BASE_URL}/bucketlist`, {
      method: 'GET',
      headers: {
        ...createHeaders(token, false),
        'x-session-id': sessionId
      },
    });
  },

  addItem: async (token, templeId) => {
    const sessionId = getSessionId();
    return await fetchWithRetry(`${BASE_URL}/bucketlist`, {
      method: 'POST',
      headers: {
        ...createHeaders(token, true),
        'x-session-id': sessionId
      },
      body: JSON.stringify({ templeId })
    });
  },

  removeItem: async (token, templeId) => {
    const sessionId = getSessionId();
    return await fetchWithRetry(`${BASE_URL}/bucketlist/${templeId}`, {
      method: 'DELETE',
      headers: {
        ...createHeaders(token, false),
        'x-session-id': sessionId
      },
    });
  },

  checkItem: async (token, templeId) => {
    const sessionId = getSessionId();
    return await fetchWithRetry(`${BASE_URL}/bucketlist/check/${templeId}`, {
      method: 'GET',
      headers: {
        ...createHeaders(token, false),
        'x-session-id': sessionId
      },
    });
  },
  
  migrateBucketlist: async (token) => {
    const sessionId = getSessionId();
    return await fetchWithRetry(`${BASE_URL}/bucketlist/migrate`, {
      method: 'POST',
      headers: createHeaders(token, true),
      body: JSON.stringify({ sessionId })
    });
  }
};

// ============================================
// Temple API
// ============================================
const templeApi = {
  getDeities: async () => {
    return await fetchWithRetry(`${BASE_URL}/temples/deities`);
  },
  
  getGodTemples: async (deity) => {
    return await fetchWithRetry(
      `${BASE_URL}/temples/deity/${encodeURIComponent(deity)}`
    );
  },
  
  getCategoryTemples: async (deity, category) => {
    return await fetchWithRetry(
      `${BASE_URL}/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`
    );
  },

  getAvatarTemples: async (deity, category) => {
    return await fetchWithRetry(
      `${BASE_URL}/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`
    );
  },

  getTempleById: async (id) => {
    return await fetchWithRetry(`${BASE_URL}/temples/${id}`);
  },

  searchTemples: async (query, limit = 50) => {
    return await fetchWithRetry(
      `${BASE_URL}/temples/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }
};

// ============================================
// Main API Export
// ============================================
export const api = {
  auth: authApi,
  bucketlist: bucketlistApi,
  temples: templeApi
};