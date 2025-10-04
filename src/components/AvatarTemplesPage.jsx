import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, getImageWithFallback } from "../services/api";
import OptimizedImage from "./OptimizedImage";

const AvatarTemplesPage = ({ isDarkMode }) => {
  const { godName, categoryName } = useParams();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTemples, setShowTemples] = useState(false);

  const shouldEagerLoad = (index) => index < 3;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
       const response = await api.temples.getAvatarTemples(godName, categoryName);
        if (Array.isArray(response)) {
          setTemples(response);
          setTimeout(() => setShowTemples(true), 50);
        } else {
          setTemples([]);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch temple data");
        setTemples([]);
      } finally {
        setLoading(false);
      }
    };
    if (godName && categoryName) fetchData();
  }, [godName, categoryName]);

  // Added useCallback for the click handler
  const handleTempleClick = useCallback((templeId) => {
    navigate(`/temple/${templeId}`);
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>Loading temples for {categoryName}...</div></div>;
  if (error) return <div className="text-center py-12"><h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Error Loading Temples</h2><p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p><button onClick={() => window.location.reload()} className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${isDarkMode ? "bg-orange-600 text-white hover:bg-orange-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}>Retry</button></div>;
  if (temples.length === 0) return <div className="text-center py-12"><h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>No temples found</h2><p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>No temples were found for "{categoryName}" under "{godName}".</p><button onClick={() => navigate("/")} className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${isDarkMode ? "bg-orange-600 text-white hover:bg-orange-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}>Go to Home</button></div>;

const cardClass = `rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${isDarkMode ? "bg-gray-800 text-gray-100 hover:shadow-gray-700" : "bg-white text-gray-800"}`;
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{categoryName}</h1>
        <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Explore the sacred temples dedicated to {categoryName} ({temples.length} temple{temples.length !== 1 ? "s" : ""} found)</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container-75ms">
        {temples.map((temple, index) => (
         <div
  key={temple._id || temple.id || index}
  onClick={() => handleTempleClick(temple.id || temple._id)}
  className={`${cardClass} stagger-card-base stagger-card-d500 ${showTemples ? 'is-visible' : ''}`}
  style={{ minHeight: '400px' }}
>
            {/* // Before: className="w-full h-48 object-cover rounded-t-xl" */}
<OptimizedImage
  src={getImageWithFallback(temple)}
  alt={temple.name}
  // FIX: Removed h-48 as OptimizedImage now manages vertical space via aspect ratio
  className="w-full object-cover rounded-t-xl"
  width={400}
  height={192} 
  eagerLoad={shouldEagerLoad(index)}
/>
            <div className="p-6">
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{temple.name}</h3>
              {temple.location && <p className={`text-sm mb-3 flex items-center ${isDarkMode ? "text-orange-300" : "text-orange-600"}`}><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 8 0111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{temple.location}</p>}
              {temple.description && <p className={`text-sm mb-3 line-clamp-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{temple.description.length > 150 ? `${temple.description.substring(0, 150)}...` : temple.description}</p>}
              {temple.significance && <p className={`text-xs italic mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}><span className="font-medium">Significance:</span> {temple.significance}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarTemplesPage;