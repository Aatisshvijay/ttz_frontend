import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const PackageTemplesPage = ({ isDarkMode }) => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'https://ttz-backend.onrender.com';
        
        const [pkgResponse, templesResponse] = await Promise.all([
          fetch(`${API_BASE}/temples/packages/${packageId}`),
          fetch(`${API_BASE}/temples/packages/${packageId}/temples`)
        ]);
        
        if (!pkgResponse.ok || !templesResponse.ok) {
          throw new Error('Failed to fetch package data');
        }
        
        const pkgData = await pkgResponse.json();
        const templesData = await templesResponse.json();
        
        setPackageInfo(pkgData);
        setTemples(templesData);
      } catch (error) {
        console.error('Error fetching package:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (packageId) {
      fetchData();
    }
  }, [packageId]);

  const handleTempleClick = useCallback((templeId) => {
    navigate(`/temple/${templeId}`);
  }, [navigate]);

  const getImageWithFallback = (temple) => {
    if (temple.image && temple.image.startsWith('http')) {
      return temple.image;
    }
    return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png';
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'Moderate': return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'Challenging': return isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading package details...
        </div>
      </div>
    );
  }

  if (error || !packageInfo) {
    return (
      <div className="text-center py-12">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Package not found
        </h2>
        <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {error || 'The requested package could not be found.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
            isDarkMode
              ? 'bg-orange-600 text-white hover:bg-orange-500'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          Go to Home
        </button>
      </div>
    );
  }

  const cardClass = `rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${
    isDarkMode ? 'bg-gray-800 text-gray-100 hover:shadow-gray-700' : 'bg-white text-gray-800'
  }`;

  return (
    <div className="py-8">
      <div className="text-center mb-12">
       
        
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {packageInfo.name}
        </h1>
        
        <p className={`text-lg max-w-3xl mx-auto mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {packageInfo.description}
        </p>


        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {temples.length} temple{temples.length !== 1 ? 's' : ''} in this spiritual journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container-75ms">
        {temples.map((temple, index) => (
          <div
            key={temple._id || temple.id || index}
            onClick={() => handleTempleClick(temple.id || temple._id)}
            className={`${cardClass} stagger-card-base`}
            style={{ minHeight: '320px' }}
          >
            <img
              src={getImageWithFallback(temple)}
              alt={temple.name}
              className="w-full h-48 object-cover"
              loading={index < 3 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.target.src = 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png';
              }}
            />
            
            <div className="p-6">
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {temple.name}
              </h3>
              
              {temple.location && (
                <p className={`text-sm mb-3 flex items-center ${
                  isDarkMode ? 'text-orange-300' : 'text-orange-600'
                }`}>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {temple.location}
                </p>
              )}
              
              {temple.description && (
                <p className={`text-sm mb-3 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {temple.description.length > 120 
                    ? `${temple.description.substring(0, 120)}...` 
                    : temple.description}
                </p>
              )}

              <div className="flex items-center justify-center space-x-2 w-full mt-4">
                <div className="flex items-center w-full max-w-xs mx-auto">
                  <div className={`flex-grow h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <p className={`px-3 text-xs italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-medium flex items-center space-x-1">
                      <span>view details</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </p>
                  <div className={`flex-grow h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageTemplesPage;