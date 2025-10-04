import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getImageWithFallback } from '../services/api';
import OptimizedImage from './OptimizedImage';

const CategoryTemplesPage = ({ isDarkMode }) => {
  const { godName, categoryName } = useParams();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shouldEagerLoad = (index) => index < 3;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.temples.getAvatarTemples(godName, categoryName);
        if (Array.isArray(response)) {
          setTemples(response);
        } else {
          setTemples([]);
        }
      } catch (error) {
        setError('No temples found for this category or failed to load');
        setTemples([]);
      } finally {
        setLoading(false);
      }
    };
    if (godName && categoryName) fetchData();
  }, [godName, categoryName]);

  const handleTempleClick = useCallback((templeId) => {
    navigate(`/temple/${templeId}`);
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading temples for "{categoryName}"...</div></div>;
  if (error || temples.length === 0) return <div className="text-center py-12"><h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{error || 'No temples found for this category.'}</h2><p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>The divine shrines are yet to be added or the data is unavailable.</p></div>;
  
  const cardClass = `rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${isDarkMode ? 'bg-gray-800 text-gray-100 hover:shadow-gray-700' : 'bg-white text-gray-800'}`;

  return (
    <div className="py-8">
      <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{categoryName} Temples</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container-75ms">
        {temples.map((temple, index) => (
          <div
            key={temple.id || temple._id}
            onClick={() => handleTempleClick(temple.id || temple._id)}
            className={`${cardClass} stagger-card-base`}
            style={{ minHeight: '400px' }}
          >
            <OptimizedImage 
              src={getImageWithFallback(temple)} 
              alt={temple.name} 
              className="w-full object-cover rounded-t-xl"
              width={400} 
              height={192} 
              eagerLoad={shouldEagerLoad(index)}
            />
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{temple.name}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{temple.location}</p>
              {temple.significance && <p className={`text-xs italic mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{temple.significance}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTemplesPage;