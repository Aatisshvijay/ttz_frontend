import React, { useState, useEffect } from 'react';

const SimpleTravelPlannerModal = ({ isOpen, onClose, bucketlist, isDarkMode }) => {
  const [selectedTemples, setSelectedTemples] = useState([]);
  const [travelPlan, setTravelPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');

  // Request user location
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Location services not supported by your browser');
      return;
    }

    setLocationStatus('requesting');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLocationStatus('granted');
      },
      (error) => {
        console.warn('Location access denied:', error);
        setLocationStatus('denied');
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  };

  useEffect(() => {
    if (isOpen && locationStatus === 'idle') {
      requestLocation();
    }
  }, [isOpen]);

  const handleTempleSelection = (templeId) => {
    setSelectedTemples(prev => 
      prev.includes(templeId) 
        ? prev.filter(id => id !== templeId)
        : [...prev, templeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTemples.length === bucketlist.length) {
      setSelectedTemples([]);
    } else {
      setSelectedTemples(bucketlist.map(item => item.templeId));
    }
  };

const generateSimplePlan = async () => {
  if (selectedTemples.length === 0) {
    setError('Please select at least one temple');
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    // FIX: Use the correct BASE_URL from api.js
    const BASE_URL = import.meta.env.VITE_API_URL || 'https://ttz-backend.onrender.com';
    
    const response = await fetch(`${BASE_URL}/temples/plan-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        templeIds: selectedTemples,
        userLocation: userLocation,
        preferences: { maxDailyTravel: 400, tripDuration: 'flexible' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate travel plan');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'No travel plan could be generated');
    }

    const optimizedRoute = data.planningOptions?.optimizedRoute;
    if (optimizedRoute) {
      setTravelPlan({
        temples: optimizedRoute.temples || [],
        stats: optimizedRoute.stats || {},
        totalTemples: selectedTemples.length
      });
    } else {
      throw new Error('No optimized route found in response');
    }
    
  } catch (err) {
    console.error('Travel planning error:', err);
    setError(`Failed to generate travel plan: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
};

  const resetPlanner = () => {
    setTravelPlan(null);
    setError(null);
    setSelectedTemples([]);
  };

  const handleClose = () => {
    resetPlanner();
    setLocationStatus('idle');
    setUserLocation(null);
    onClose();
  };

  const getTravelModeDisplay = (travelMode, travelSuggestion) => {
    const modes = {
      flight: { icon: '✈️', color: 'text-purple-600', bg: isDarkMode ? 'bg-purple-900' : 'bg-purple-100' },
      train: { icon: '🚆', color: 'text-blue-600', bg: isDarkMode ? 'bg-blue-900' : 'bg-blue-100' },
      road: { icon: '🚗', color: 'text-green-600', bg: isDarkMode ? 'bg-green-900' : 'bg-green-100' }
    };
    
    return modes[travelMode] || modes.road;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4" 
         style={{
           background: isDarkMode 
             ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)' 
             : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
           backdropFilter: 'blur(8px)'
         }}>
      <div className={`max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-sm ${
        isDarkMode ? 'bg-gray-900/95 text-white border border-gray-700' : 'bg-white/95 text-gray-900 border border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={` px-4 sm:px-6 py-3 sm:py-4 border-b rounded-t-xl sm:rounded-t-2xl ${
          isDarkMode 
            ? 'border-gray-700 bg-gray-900/98 backdrop-blur-sm' 
            : 'border-gray-200 bg-white/98 backdrop-blur-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold bg-orange-500 bg-clip-text text-transparent">
                Smart Temple Travel Planner
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Optimized routes based on your location
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          {!travelPlan ? (
            // Selection Phase
            <div>
              <div className="text-center mb-4 sm:mb-6">
                <h4 className="text-xl sm:text-2xl font-bold mb-2 bg-orange-500 bg-clip-text text-transparent">
                  Plan Your Temple Journey
                </h4>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We'll create an optimal visit order based on your location to save you time.
                </p>
              </div>

              {/* Location Status Card */}
              <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 ${
                locationStatus === 'granted' ? 
                  'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800' :
                locationStatus === 'requesting' ?
                  'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-400 text-blue-800' :
                locationStatus === 'denied' ?
                  'bg-gradient-to-r from-amber-50 to-yellow-50 border-yellow-400 text-yellow-800' :
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-gray-200'
                    : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 text-gray-700'
              }`}>
                {locationStatus === 'granted' && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full items-center justify-center">
                      <span className="text-lg sm:text-xl">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Location Detected</p>
                      <p className="text-xs sm:text-sm opacity-90">Route will start from your current location</p>
                    </div>
                  </div>
                )}
                {locationStatus === 'requesting' && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Requesting Location</p>
                      <p className="text-xs sm:text-sm opacity-90">Getting your location for optimal routing...</p>
                    </div>
                  </div>
                )}
                {locationStatus === 'denied' && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg sm:text-xl">⚠️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Location Access Denied</p>
                      <p className="text-xs sm:text-sm opacity-90">We'll find the best starting point for you</p>
                    </div>
                  </div>
                )}
                {locationStatus === 'idle' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-lg sm:text-xl">🎯</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Enable Location</p>
                        <p className="text-xs sm:text-sm opacity-90">For personalized route planning</p>
                      </div>
                    </div>
                    <button
                      onClick={requestLocation}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-red-500 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Enable Location
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors"
                >
                  {selectedTemples.length === bucketlist.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedTemples.length} of {bucketlist.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
                {bucketlist.map((item, index) => (
                  <div
                    key={item.templeId || index}
                    onClick={() => handleTempleSelection(item.templeId)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                      selectedTemples.includes(item.templeId)
                        ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg'
                        : isDarkMode
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTemples.includes(item.templeId)
                          ? 'border-orange-500 bg-orange-500'
                          : isDarkMode
                          ? 'border-gray-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedTemples.includes(item.templeId) && (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        )}
                      </div>
                      <img
                        src={item.templeImage}
                        alt={item.templeName}
                        className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded-md sm:rounded-lg shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className={`font-semibold text-base sm:text-lg truncate ${
                          selectedTemples.includes(item.templeId)
                            ? 'text-orange-700'
                            : isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.templeName}
                        </h5>
                        <p className={`text-xs sm:text-sm flex items-center gap-1 truncate ${
                          selectedTemples.includes(item.templeId)
                            ? 'text-orange-600'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {item.templeLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <button
                onClick={generateSimplePlan}
                disabled={isLoading || selectedTemples.length === 0}
                className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 ${
                  isLoading || selectedTemples.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                    <span className="text-sm sm:text-base">Planning your optimal route...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Plan Journey for {selectedTemples.length} Temple{selectedTemples.length !== 1 ? 's' : ''}
                  </span>
                )}
              </button>
            </div>
          ) : (
            // Travel Plan Display
            <div>
              {/* Plan New Route Button */}
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={resetPlanner}
                  className={`w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md ${
                    isDarkMode 
                      ? 'bg-gray-800 text-orange-400 hover:bg-gray-700 border-2 border-orange-500/30' 
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-2 border-orange-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Plan New Route
                </button>
              </div>

              {/* Journey Summary */}
              <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-gray-800 to-gray-700' 
                  : 'from-blue-50 to-indigo-50'
              } border ${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`}>
                <h5 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">Journey Overview</h5>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">
                      {travelPlan.stats.estimatedDays || travelPlan.totalTemples}
                    </div>
                    <div className="text-xs sm:text-sm opacity-75">days recommended</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">
                      {travelPlan.totalTemples}
                    </div>
                    <div className="text-xs sm:text-sm opacity-75">temples</div>
                  </div>
                </div>
              

                {travelPlan.stats.multipleRegions && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} text-center">
                    <p className="text-xs sm:text-sm opacity-75">
                      <span className="font-semibold">States Covered: </span>
                      {travelPlan.stats.regions.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Temple Route with Travel Mode Indicators */}
              <div className="space-y-3 sm:space-y-4">
                <h5 className="font-bold text-base sm:text-lg">Recommended Visit Order</h5>
                {travelPlan.temples.map((temple, index) => (
                  <div key={temple.id || temple._id || index}>
                    {/* Temple Card */}
                    <div className={`p-3 sm:p-5 rounded-lg sm:rounded-xl border transition-all duration-200 hover:shadow-lg ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-start gap-2 sm:gap-4">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-sm sm:text-lg">
                          {index + 1}
                        </div>
                        <img
                          src={temple.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=60&fit=crop'}
                          alt={temple.name}
                          className="flex-shrink-0 w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-md sm:rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=60&fit=crop';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h6 className="font-bold text-base sm:text-lg truncate">{temple.name}</h6>
                          <p className={`text-xs sm:text-sm flex items-center gap-1 mt-1 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {temple.location}
                          </p>
                          {temple.category && (
                            <span className={`inline-block mt-1 sm:mt-2 px-2 py-0.5 sm:px-3 sm:py-1 text-xs rounded-full ${
                              isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {temple.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Travel Mode Indicator (between temples) */}
                    {index < travelPlan.temples.length - 1 && temple.travelMode && (
                      <div className="flex justify-center py-2">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                          temple.travelMode === 'flight' 
                            ? isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'
                            : temple.travelMode === 'train'
                            ? isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700' 
                            : isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                        }`}>
                          <span className="text-lg">
                            {temple.travelMode === 'flight' ? '✈️' : temple.travelMode === 'train' ? '🚆' : '🚗'}
                          </span>
                          <span>{temple.travelSuggestion || temple.travelMode}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Smart Tips */}
              <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg sm:rounded-xl border-l-4 border-orange-400 ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-orange-50'
              }`}>
                <h6 className="font-bold text-base sm:text-lg mb-3 text-orange-600">Smart Travel Tips</h6>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Visit temples early morning for peaceful darshan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Check temple timings and special festival dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Carry appropriate clothing for temple visits</span>
                  </li>
                  {travelPlan.stats.flightSegments > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Book flights in advance for long-distance segments</span>
                    </li>
                  )}
                  {travelPlan.stats.multipleRegions && (
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Consider breaking this into multiple trips by region</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTravelPlannerModal;