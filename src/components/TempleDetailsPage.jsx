import React, { useState, useEffect } from "react";
import { api, getImageUrl } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ADD THIS IMPORT

const SimpleTempleMap = ({ location, templeName, isDarkMode }) => {
  const [mapError, setMapError] = useState(false);
  
  const searchQuery = encodeURIComponent(templeName + ' ' + location);
  const googleMapsSearchUrl = `https://maps.google.com/?q=${searchQuery}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${searchQuery}`;
  const mapIframeSrc = `https://maps.google.com/maps?q=${searchQuery}&output=embed&z=15&iwloc=near&hl=en`;

  return (
    <div className="w-full space-y-3">
      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg overflow-hidden shadow-lg relative bg-gray-200">
        
        {!mapError ? (
          <iframe
            src={mapIframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title={`Map of ${templeName}`}
            className="rounded-lg"
            onError={() => setMapError(true)} 
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center p-4 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
          }`}>
            <div className="text-center space-y-4">
              <div className="text-4xl mb-2">🛕</div>
              <h4 className="font-semibold text-sm sm:text-base">{templeName}</h4>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">{location}</p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a 
                  href={googleMapsSearchUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  🗺️ Google Maps
                </a>
              </div>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 left-2 right-2">
          <div className="flex justify-center">
            <div className={`px-3 py-1.5 rounded-lg shadow-md max-w-xs sm:max-w-sm ${
              isDarkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'
            } backdrop-blur-sm`}>
              <h4 className="font-semibold text-xs text-center truncate">{templeName}</h4>
              <p className="text-xs text-gray-500 text-center truncate">{location}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-center gap-2">
            <a 
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors shadow-lg"
            >
              📍 Directions
            </a>
            <a 
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-lg"
            >
              🗺️ View Full Map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const TempleDetailsPage = ({ isDarkMode, bucketlist, onAdd, onRemove }) => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); // ADD THIS LINE
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bucketlistLoading, setBucketlistLoading] = useState(false); // ADD THIS

  useEffect(() => {
    loadTemple();
  }, [templeId]);

  const loadTemple = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageLoaded(false);
      const templeData = await api.temples.getTempleById(templeId);
      setTemple(templeData);
      setTimeout(() => setShowContent(true), 50);
    } catch (error) {
      console.error("Error fetching temple:", error);
      setError("Temple not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Loading temple details...
        </div>
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="text-center py-12">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Temple not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
            isDarkMode
              ? "bg-orange-600 text-white hover:bg-orange-500"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Go to Home
        </button>
      </div>
    );
  }

  const isInBucketlist = bucketlist.some((item) => item.templeId === temple.id);

const handleBucketlistToggle = async () => {
  if (bucketlistLoading) return;
  
  setBucketlistLoading(true);
  try {
    if (isInBucketlist) {
      await api.bucketlist.removeItem(token, temple.id);
      onRemove(temple.id);
    } else {
      await api.bucketlist.addItem(token, temple.id);
      
      // Fetch the actual item from backend to get correct data
      const updatedBucketlist = await api.bucketlist.getBucketlist(token);
      const addedItem = updatedBucketlist.find(item => item.templeId === temple.id);
      
      if (addedItem) {
        onAdd(addedItem); // Pass the actual backend item
      }
    }
  } catch (error) {
    console.error('Failed to update bucketlist:', error);
    
    // Don't show "already in bucketlist" if it's actually in the list
    if (error.message && error.message.includes('already in bucketlist')) {
      // Just silently ignore - it's already there
      return;
    }
    alert('Failed to update bucketlist. Please try again.');
  } finally {
    setBucketlistLoading(false);
  }
};

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:space-x-12 items-start">
          <div className={`w-full lg:w-1/2 space-y-4 transition-all duration-700 ease-out transform ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="aspect-4/3 overflow-hidden rounded-2xl bg-gray-100 max-w-lg mx-auto">
              <img
                src={getImageUrl(temple.image)}
                alt={temple.name}
                className={`w-full h-full object-cover transition-all duration-700 ease-out transform ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } hover:scale-105`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            <span className="text-xs text-gray-500 italic text-center block">
              *AI-generated image — actual temple may differ
            </span>
            <hr className="max-w-lg mx-auto"/>
            <br />
          </div>

          <div className={`w-full lg:w-1/2 space-y-6 transition-all duration-700 ease-out transform ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '100ms' }}>
            {temple.category && (
              <div className={`text-sm font-medium uppercase tracking-wide ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {temple.category}
              </div>
            )}

            <h1 className={`text-3xl lg:text-4xl font-bold leading-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {temple.name}
            </h1>

            {temple.location && (
              <div className={`flex items-center space-x-2 text-lg ${
                isDarkMode ? "text-orange-300" : "text-orange-600"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{temple.location}</span>
              </div>
            )}

            {temple.description && (
              <div className="space-y-3">
                <h4 className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  Temple Story
                </h4>
                <p className={`text-base leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {temple.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {temple.significance && (
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Significance
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {temple.significance}
                  </p>
                </div>
              )}

              {temple.bestTime && (
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Best Time to Visit
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {temple.bestTime}
                  </p>
                </div>
              )}

              {temple.festivals && (
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}>
                    Major Festivals
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {temple.festivals}
                  </p>
                </div>
              )}
            </div>

            {temple.location && (
              <div className="space-y-3">
                <h4 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Location Map
                </h4>
                <SimpleTempleMap 
                  location={temple.location} 
                  templeName={temple.name} 
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            <div className="flex justify-center pt-6">
              <button
                onClick={handleBucketlistToggle}
                disabled={bucketlistLoading}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  bucketlistLoading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isInBucketlist
                    ? isDarkMode
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    : isDarkMode
                    ? "bg-orange-600 hover:bg-orange-500 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {bucketlistLoading ? 'Processing...' : (isInBucketlist ? "- Remove from Bucketlist" : "+ Add to Bucketlist")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetailsPage;