// API service for handling all backend calls
const BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

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

// Deity image mapping
const deityImageMap = {
  "Vishnu (108 Divya Desams)": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png",
  "Maha Avatars of Vishnu": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png",
  "Lord Krishna": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147334/krishna_cwqrsj.png",
  "Lord Narasimha": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147309/narasimha_zuqnth.png",
  "Lord Parshuram": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147298/parshurama_jrryj4.png",
  "Lord Sri Rama": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147283/rama_jb7c67.png",
  "Lord Vamana": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147283/vamana_bfz0nq.png",
  "Lord Varaha": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147273/varaha_dbildy.png",
  "Matsya Avatar": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147315/matsya_nr5z9h.png",
  "Kurma Avatar": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147338/kurmam_clsc26.png",
  "Jyotirlingas": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147342/jyotirlingas_dpmmxs.png",
  "Pancha Bhoota Sthalams": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147292/pb_ng5jll.png",
  "Other Famous Shiva Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147363/bh_y9yjn1.png",
  "Shakti Peethas": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147281/shakti_e7kaaz.png",
  "Devi Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147391/dt1_hwfpkt.png",
  "Lakshmi Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147323/laxmi_su1sgk.png",
  "Hanuman Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147343/hanuman_smnyyx.png",
  "Ganesha Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147355/ganesha_xgclup.png",
  "Arupadai Veedu Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147315/murugan_djfmgk.png",
  "Ayyappa Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147367/ayyapa_btcxp1.png",
  "Navagraha Temples": "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147307/navagraha_v5uk7h.png",
};

// Deity descriptions
const deityDescriptions = {
  "Maha Avatars of Vishnu": "The supreme preserver of the universe in his various incarnations",
  "Lord Shiva": "The destroyer and transformer in the Hindu trinity",
  "Goddess Shakti": "The divine feminine creative power and cosmic energy",
  "Lord Ganesha": "The remover of obstacles and lord of beginnings",
  "Lord Hanuman": "The epitome of devotion, strength and service",
  "Lord Murugan": "The god of war, victory and wisdom",
  "Lord Ayyappa": "The deity of dharma and righteousness",
  "Navagraha": "The nine celestial bodies influencing human life"
};

export const getDeityImage = (deityName) => {
  return deityImageMap[deityName] || "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png";
};

export const getDeityDescription = (deityName) => {
  return deityDescriptions[deityName] || "Explore sacred temples";
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return optimizeCloudinaryUrl('https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png', 800);
  }
  
  if (imagePath.startsWith('http')) {
    return optimizeCloudinaryUrl(imagePath, 800);
  }
  
  if (imagePath.startsWith('/Temples/')) {
    return `${window.location.origin}${imagePath}`;
  }
  
  return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

export const getImageWithFallback = (temple, width = 400) => {
  if (temple.image && !temple.image.includes('placeholder')) {
    return optimizeCloudinaryUrl(temple.image, width);
  }

  if (temple.category && deityImageMap[temple.category]) {
    return optimizeCloudinaryUrl(deityImageMap[temple.category], width);
  }

  if (temple.deity && deityImageMap[temple.deity]) {
    return optimizeCloudinaryUrl(deityImageMap[temple.deity], width);
  }

  return optimizeCloudinaryUrl("https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png", width);
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

const createHeaders = (token = null, includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('temple_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('temple_session_id', sessionId);
  }
  return sessionId;
};

export const api = {
  auth: {
    register: async (name, email, password) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ name, email, password })
      });
      return handleResponse(response);
    },

    login: async (email, password) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },

    logout: async (token) => {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: createHeaders(token, true)
      });
      return handleResponse(response);
    },

    getMe: async (token) => {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: createHeaders(token, true)
      });
      return handleResponse(response);
    }
  },

  temples: {
    getAll: async () => {
      const response = await fetch(`${BASE_URL}/temples`);
      return handleResponse(response);
    },

    getFeaturedTemples: async () => {
      const response = await fetch(`${BASE_URL}/temples`);
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${BASE_URL}/temples/${id}`);
      return handleResponse(response);
    },

    getByDeity: async (deity) => {
      const response = await fetch(`${BASE_URL}/temples/deity/${encodeURIComponent(deity)}`);
      return handleResponse(response);
    },

    getByDeityAndCategory: async (deity, category) => {
      const response = await fetch(`${BASE_URL}/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`);
      return handleResponse(response);
    },

    search: async (query, limit = 50) => {
      const response = await fetch(`${BASE_URL}/temples/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return handleResponse(response);
    },

    getDeities: async () => {
      const response = await fetch(`${BASE_URL}/temples/deities`);
      return handleResponse(response);
    },

    getDeitiesWithCategories: async (deity) => {
      const response = await fetch(`${BASE_URL}/temples/deities/${encodeURIComponent(deity)}/categories`);
      return handleResponse(response);
    }
  },

  getBucketlist: async (token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    const response = await fetch(`${BASE_URL}/bucketlist`, {
      method: 'GET',
      headers
    });
    return handleResponse(response);
  },

  addToBucketlist: async (templeId, token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    const response = await fetch(`${BASE_URL}/bucketlist`, {
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

    const response = await fetch(`${BASE_URL}/bucketlist/${templeId}`, {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },

  clearBucketlist: async (token = null) => {
    const headers = token 
      ? createHeaders(token, true)
      : { ...createHeaders(), 'x-session-id': getSessionId() };

    const response = await fetch(`${BASE_URL}/bucketlist`, {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },

  migrateBucketlist: async (token) => {
    const sessionId = getSessionId();
    const response = await fetch(`${BASE_URL}/bucketlist/migrate`, {
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
    const response = await fetch(`${BASE_URL}/temples/deity/${encodeURIComponent(deity)}`);
    return handleResponse(response);
  },
  
  getCategoryTemples: async (deity, category) => {
    const response = await fetch(`${BASE_URL}/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },
  
  getAvatarTemples: async (deity, category) => {
    const response = await fetch(`${BASE_URL}/temples/deity/${encodeURIComponent(deity)}/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },

  getTempleById: async (id) => {
    const response = await fetch(`${BASE_URL}/temples/${id}`);
    return handleResponse(response);
  },

  searchTemples: async (query, limit = 50) => {
    const response = await fetch(`${BASE_URL}/temples/search?q=${encodeURIComponent(query)}&limit=${limit}`);
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