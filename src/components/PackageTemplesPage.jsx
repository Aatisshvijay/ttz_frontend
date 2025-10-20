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
    
    if (packageId) fetchData();
  }, [packageId]);

  const handleTempleClick = useCallback(
    (templeId) => {
      navigate(`/temple/${templeId}`);
    },
    [navigate]
  );
  
  // --- NEW LOGIC: Determine button content and route ---
  const getDeityButtonProps = (pkgId) => {
    // Check for Divya Desam
    if (pkgId === 'divya-desam-south' || pkgId === 'divya-desam-north') { 
      return {
        text: 'View All 108 Divya Desams',
        // Route format: /god/:godName/:categoryName
        route: `/god/${encodeURIComponent('Maha Avatars of Vishnu')}/${encodeURIComponent('Vishnu (108 Divya Desams)')}`,
      };
    // Check for Shakti Peetha
    } else if (pkgId === 'shakti-peetha') { 
      return {
        text: 'View All 51 Shakti Peethas',
        // Route format: /god/:godName/:categoryName
        route: `/god/${encodeURIComponent('Goddess Shakti')}/${encodeURIComponent('Shakti Peethas')}`,
      };
    }
    return null; // For all other packages, no button is needed
  };

  const deityButton = getDeityButtonProps(packageId);
  // ---------------------------------------------------


  if (loading)
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${
            isDarkMode ? "border-orange-500" : "border-orange-700"
          }`}
        ></div>
        <p className={`ml-4 text-xl ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Loading package details...
        </p>
      </div>
    );

  if (error || !packageInfo)
    return (
      <div
        className={`text-center py-16 ${
          isDarkMode ? "text-red-400" : "text-red-700"
        }`}
      >
        <h2 className="text-3xl font-bold mb-4">
          Failed to Load Package
        </h2>
        <p className="text-lg">
          {error || "The requested package could not be found."}
        </p>
      </div>
    );

  // Styling for Temple Card
  const cardClass = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
    : "bg-white hover:bg-gray-50 shadow-lg border border-gray-200";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1
          className={`text-3xl sm:text-4xl font-extrabold mb-3 ${
            isDarkMode ? "text-grey-200" : "text-grey-600"
          }`}
        >
          {packageInfo.name}
        </h1>
        <p
          className={`text-xl font-medium mb-4 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {packageInfo.description}
        </p>
       
      </div>
      
      {/* --- NEW ELEMENT: Conditional Button for Deity Pages (Placed after package header) --- */}
      {deityButton && (
        <div className="text-center mb-12 mt-4"> {/* Added margin top for spacing */}
          <button
            onClick={() => navigate(deityButton.route)}
            // Used a new, distinct color (purple) to differentiate from the primary orange/red buttons
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md text-white ${
              isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            <span className="flex items-center space-x-2">
                <span>{deityButton.text}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.5 8.5l4 4-4 4M21 12H3"></path></svg>
            </span>
          </button>
        </div>
      )}
      {/* ---------------------------------------------------- */}

      <h2
        className={`text-2xl font-bold mb-8 text-center ${
          isDarkMode ? "text-grey-300" : "text-gray-700"
        }`}
      >
        Temples Included in This Package ({temples.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {temples.map((temple, index) => (
          <div
            key={temple.id || index}
            onClick={() => handleTempleClick(temple.id)}
            className={`rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${cardClass}`}
          >
            {/* Temple Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={temple.image || packageInfo.image}
                alt={temple.name}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
            </div>

            <div className="p-5">
              {/* Temple Name */}
             <h3
                className={`text-xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {temple.name}
              </h3>
             {temple.location && (
                <p
                  className={`text-sm mb-3 flex items-center ${
                    isDarkMode ? "text-orange-300" : "text-orange-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {temple.location}
                </p>
              )}
              
              {/* Temple Description Snippet */}
              {temple.description && (
                <p
                  className={`text-sm mb-3 line-clamp-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {temple.description.length > 150
                    ? `${temple.description.substring(0, 150)}...`
                    : temple.description}
                </p>
              )}

      <div className="flex items-center justify-center space-x-2 w-full mb-3">
                <div className="flex items-center w-full max-w-xs mx-auto my-1">
                  {/* Left Separator Line */}
                  <div
                    className={`flex-grow h-px ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  ></div>

                  {/* Text: view details with Arrow */}
                  <p
                    className={`px-3 text-xs italic ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span className="font-medium flex items-center space-x-1">
                      <span>view details</span>
                      {/* Right-pointing arrow */}
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </span>
                  </p>

                  {/* Right Separator Line */}
                  <div
                    className={`flex-grow h-px ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  ></div>
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