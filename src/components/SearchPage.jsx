import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { templeApi } from '../services/api';

const SearchPage = ({ isDarkMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Updated search suggestions based on your actual database structure (removed Ashtavinayak)
  const [searchSuggestions] = useState([
    // Major deity categories (exact matches from your database)
    'Maha Avatars of Vishnu', 'Lord Shiva', 'Goddess Shakti', 'Goddess Lakshmi', 
    'Lord Hanuman', 'Lord Ganesha', 'Lord Murugan', 'Lord Ayyappa', 'Navagraha Temples',
    
    // Subcategories (exact matches from your database)
    'Vishnu (108 Divya Desams)', 'Jyotirlingas', 'Pancha Bhoota Sthalams', 'Shakti Peethas',
    'Ganesha Temples', 'Arupadai Veedu Temples', 'Hanuman Temples', 'Lakshmi Temples',
    'Devi Temples', 'Other Famous Shiva Temples',
    
    // Avatar categories (exact matches)
    'Lord Krishna', 'Lord Sri Rama', 'Lord Narasimha', 'Lord Vamana', 'Lord Parshuram',
    'Lord Varaha', 'Kurma Avatar', 'Matsya Avatar',
    
    // Popular temple names and locations
    'Tirupati', 'Sabarimala', 'Palani', 'Kashi Vishwanath', 'Somnath',
    'Srirangam', 'Meenakshi', 'Kamakhya', 'Dagdusheth', 'Siddhivinayak',
    
    // States with many temples
    'Tamil Nadu', 'Maharashtra', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Gujarat'
  ]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchTemples();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const searchTemples = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Searching for:', searchQuery);
      const searchResults = await templeApi.searchTemples(searchQuery);
      console.log('Search results:', searchResults);
      setResults(searchResults || []);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to search temples. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced image fallback system based on your actual database structure
  const getImageWithFallback = (temple) => {
    if (!temple.image || temple.image.includes('placeholder')) {
      const deity = temple.deity?.toLowerCase() || '';
      const category = temple.category?.toLowerCase() || '';
      
      // Vishnu and avatars
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
      
      // Shiva temples
      else if (deity.includes('shiva')) {
        if (category.includes('jyotirlinga')) {
          return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147279/shiva_h9u69h.png';
        } else if (category.includes('pancha bhoota')) {
          return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147292/pb_ng5jll.png';
        } else {
          return 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147363/bh_y9yjn1.png';
        }
      }
      
      // Shakti temples
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

  // Enhanced search suggestions based on query
  const getFilteredSuggestions = () => {
    if (!searchQuery) return searchSuggestions.slice(0, 8);
    
    const query = searchQuery.toLowerCase();
    const filtered = searchSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query) || 
      query.includes(suggestion.toLowerCase().split(' ')[0])
    );
    
    return filtered.slice(0, 6);
  };

  // Enhanced category badge display
  const getCategoryDisplayName = (category) => {
    if (category === 'Vishnu (108 Divya Desams)') return 'Divya Desam';
    if (category === 'Arupadai Veedu Temples') return 'Arupadai Veedu';
    if (category === 'Pancha Bhoota Sthalams') return 'Pancha Bhoota';
    if (category === 'Other Famous Shiva Temples') return 'Shiva Temple';
    return category;
  };

  const getDeityDisplayName = (deity) => {
    if (deity === 'Maha Avatars of Vishnu') return 'Vishnu Avatar';
    if (deity === 'Goddess Shakti') return 'Shakti';
    if (deity === 'Goddess Lakshmi') return 'Lakshmi';
    return deity;
  };

  const cardClass = `rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${
    isDarkMode ? 'bg-gray-900 text-gray-100 hover:shadow-gray-700' : 'bg-white text-gray-800'
  }`;

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Search Results for "{searchQuery}"
        </h2>
        
        {/* Enhanced search suggestions */}
        {!loading && results.length === 0 && searchQuery && (
          <div className="mt-6">
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try searching for:
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {getFilteredSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(suggestion)}`)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Searching temples...
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className={`text-xl mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </p>
          <button 
            onClick={searchTemples}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
              isDarkMode ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Try Again
          </button>
        </div>
      ) : results.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg 
              className={`mx-auto h-24 w-24 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className={`text-xl mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No temples found matching "{searchQuery}"
          </p>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Try searching for temple names, locations, deity names, or categories like "Ganesha Temples", "Jyotirlingas", or "Divya Desam"
          </p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className={`text-center mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Found {results.length} temple{results.length !== 1 ? 's' : ''} matching your search
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((temple, index) => (
              <div 
                key={temple.id || temple._id || index} 
                className={cardClass} 
                onClick={() => navigate(`/temple/${temple.id || temple._id}`)}
              >
                <div className="relative">
                  <img 
                    src={getImageWithFallback(temple)} 
                    alt={temple.name} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = getImageWithFallback(temple);
                    }}
                  />
                  
                  {/* Enhanced category and deity badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {temple.deity && (
                      <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium ${
                        isDarkMode ? 'bg-purple-900 bg-opacity-90 text-purple-200' : 'bg-purple-500 bg-opacity-90 text-white'
                      }`}>
                        {getDeityDisplayName(temple.deity)}
                      </div>
                    )} 
                    {temple.category && (
                      <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium ${
                        isDarkMode ? 'bg-blue-900 bg-opacity-90 text-blue-200' : 'bg-blue-500 bg-opacity-90 text-white'
                      }`}>
                        {getCategoryDisplayName(temple.category)}
                      </div>
                    )}
                    {temple.state && (
                      <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium ${
                        isDarkMode ? 'bg-green-900 bg-opacity-90 text-green-200' : 'bg-green-500 bg-opacity-90 text-white'
                      }`}>
                        {temple.state}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {temple.name}
                  </h3>
                  
                  {temple.location && (
                    <p className={`text-sm mb-3 flex items-center ${
                      isDarkMode ? 'text-orange-300' : 'text-orange-600'
                    }`}>
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{temple.location}</span>
                    </p>
                  )}
                  
                  {temple.description && (
                    <p className={`text-sm mb-3 line-clamp-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {temple.description.length > 120 ? 
                        `${temple.description.substring(0, 120)}...` : 
                        temple.description
                      }
                    </p>
                  )}
                  
                  {temple.significance && (
                    <p className={`text-xs italic line-clamp-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="font-medium">Significance:</span> {temple.significance}
                    </p>
                  )}

                  {/* Enhanced best time and festivals info */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {temple.bestTime && (
                      <span className={`px-2 py-1 rounded ${
                        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Best: {temple.bestTime}
                      </span>
                    )}
                    {temple.festivals && (
                      <span className={`px-2 py-1 rounded ${
                        isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {temple.festivals.split(',')[0].trim()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SearchPage;