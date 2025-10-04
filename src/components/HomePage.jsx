import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Gita from "./Gita";
import { api } from '../services/api';

const HomePage = ({ isDarkMode, navigate }) => {
  const [deities, setDeities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded list defining the FINAL DISPLAY ORDER
  const originalDeities = [
    "Maha Avatars of Vishnu",
    "Lord Shiva", 
    "Goddess Shakti",
    "Goddess Lakshmi",
    "Lord Hanuman",
    "Lord Ganesha",
    "Lord Murugan",
    "Lord Ayyappa",
    "Navagraha Temples"
  ];
  
  useEffect(() => {
    const fetchDeities = async () => {
      try {
        setLoading(true);
        const data = await api.temples.getDeities(); 
        
        if (data && data.length > 0) {
          
          // 1. Create the lookup map (deity name -> deity object)
          const deityLookup = data.reduce((acc, deity) => {
            acc[deity.name] = deity;
            return acc;
          }, {});

          // 2. Identify the first 3 deities in the correct display order
          const top3Deities = originalDeities
            .filter(name => deityLookup[name]) // Only include available deities
            .slice(0, 3) // Take the first 3 names
            .map(name => deityLookup[name]); // Map back to the deity object

          // 3. Preload the images for the first 3 (CRITICAL FIX)
          const visiblePromises = top3Deities.map(deity => {
            return new Promise((resolve) => {
              if (deity.image) {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Resolve on error so a single failure doesn't block the UI
                img.src = deity.image;
              } else {
                resolve();
              }
            });
          });
          
          // Wait for the first 3 images to finish loading (or fail gracefully)
          await Promise.allSettled(visiblePromises);
          
          setDeities(data);
          setLoading(false);
          
          // NOTE: Removed the redundant data.slice(3) preload loop. 
          // The browser's default lazy loading is now sufficient.
          
        } else {
          setDeities(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching deities:', error);
        setError(error.message);
        setDeities([]);
        setLoading(false);
      }
    };

    fetchDeities();
  }, []); // Empty dependency array, runs once on mount

  const DeityCardSkeleton = () => (
    <div className={`rounded-xl shadow-lg overflow-hidden cursor-pointer p-8 flex flex-col items-center justify-center text-center animate-pulse ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`} style={{ minHeight: '320px' }}>
      <div className={`w-24 h-24 rounded-2xl mb-4 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}></div>
      <div className={`h-6 w-32 mb-2 rounded ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}></div>
      <div className={`h-4 w-48 mb-3 rounded ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}></div>
      <div className={`h-6 w-24 rounded-full ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}></div>
    </div>
  );

  const cardClass = `rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${
    isDarkMode
      ? "bg-gray-800 text-gray-100 hover:shadow-orange-500"
      : "bg-white text-gray-800"
  }`;

  const deityLookup = deities.reduce((acc, deity) => {
    acc[deity.name] = deity;
    return acc;
  }, {});

  const availableDeities = originalDeities.filter(name => deityLookup[name]);

  const getDisplayCount = (deityName) => {
    const deity = deityLookup[deityName];
    if (!deity) return "0 Temples";
    
    if (deityName === "Maha Avatars of Vishnu" || deityName === "Lord Shiva" || deityName === "Goddess Shakti") {
      return `${deity.categories} Categories`;
    }
    
    return `${deity.templeCount} Temples`;
  };

  const getDeityImage = (deityName) => {
    const deity = deities.find(d => d.name === deityName);
    
    if (deity && deity.image) {
      return deity.image;
    }
    
    return "";
  };

  const getDeityDescription = (deityName) => {
    const descriptions = {
      "Maha Avatars of Vishnu": "The divine incarnations of Lord Vishnu across different yugas",
      "Lord Shiva": "The destroyer and transformer, part of the Hindu trinity",
      "Goddess Shakti": "The divine feminine energy and mother of the universe",
      "Goddess Lakshmi": "The goddess of wealth, fortune, and prosperity",
      "Lord Hanuman": "The devoted follower of Lord Rama, symbol of strength and devotion",
      "Lord Ganesha": "The remover of obstacles and patron of arts and sciences",
      "Lord Murugan": "The god of war, victory, and wisdom",
      "Lord Ayyappa": "The divine protector and symbol of unity",
      "Navagraha Temples": "The nine celestial bodies governing cosmic energies"
    };
    
    return descriptions[deityName] || "Sacred temples and spiritual destinations";
  };

  if (loading) {
    return (
      <div>
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl shadow-xl mb-12 bg-gradient-to-br ${
          isDarkMode ? "from-orange-400 to-red-500" : "from-orange-400 to-red-500"
        } text-white`} style={{ minHeight: '300px' }}>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4">
            <img src="https://res.cloudinary.com/dto53p1cf/image/upload/v1759162414/na_pkhakb.png" className="max-h-40 w-auto" alt="Namaste" />
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Namaste</h2>
          <p className="text-xl md:text-2xl text-center opacity-90">
            Your spiritual journey starts here. Ready to find your next sacred vibe?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`text-center p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{ minHeight: '100px' }}>
            <div className="text-2xl font-bold text-orange-500">250+</div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Sacred Temples</div>
          </div>
          <div className={`text-center p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{ minHeight: '100px' }}>
            <div className="text-2xl font-bold text-orange-500">25+</div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Indian States</div>
          </div>
          <div className={`text-center p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{ minHeight: '100px' }}>
            <div className="text-2xl font-bold text-orange-500">5000+</div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Years of History</div>
          </div>
        </div>

        <Gita isDarkMode={isDarkMode} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ minHeight: '1000px' }}>
          {Array.from({ length: 9 }).map((_, index) => (
            <DeityCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Error Loading Data
        </h2>
        <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
            isDarkMode
              ? "bg-orange-600 text-white hover:bg-orange-500"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={`flex flex-col items-center justify-center py-16 rounded-2xl shadow-xl mb-12 bg-gradient-to-br ${
        isDarkMode ? "from-orange-400 to-red-500" : "from-orange-400 to-red-500"
      } text-white`} style={{ minHeight: '300px' }}>
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4">
          <img src="https://res.cloudinary.com/dto53p1cf/image/upload/v1759162414/na_pkhakb.png" className="max-h-40 w-auto" alt="Namaste" />
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Namaste</h2>
        <p className="text-xl md:text-2xl text-center opacity-90">
          Your spiritual journey starts here. Ready to find your next sacred vibe?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className={`text-center p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{ minHeight: '100px' }}>
          <div className="text-2xl font-bold text-orange-500">250+</div>
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Sacred Temples</div>
        </div>
        <div className={`text-center p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{ minHeight: '100px' }}>
          <div className="text-2xl font-bold text-orange-500">25+</div>
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Indian States</div>
        </div>
        <div className={`text-center p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`} style={{ minHeight: '100px' }}>
          <div className="text-2xl font-bold text-orange-500">5000+</div>
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Years of History</div>
        </div>
      </div>

      <Gita isDarkMode={isDarkMode} />

      <div className="text-center mb-5" style={{ minHeight: '80px' }}>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Choose Your Divine Journey
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container-100ms" style={{ minHeight: '1000px' }}>
        {availableDeities.map((deityName, index) => (
          <div
            key={deityName}
            onClick={() => {
              const deity = deityLookup[deityName];
              if (deity && deity.categories > 1) {
                navigate(`/god/${encodeURIComponent(deityName)}`);
              } else if (deity && deity.categoryList && deity.categoryList.length > 0) {
                navigate(`/god/${encodeURIComponent(deityName)}/${encodeURIComponent(deity.categoryList[0])}`);
              } else {
                navigate(`/god/${encodeURIComponent(deityName)}`);
              }
            }}
            className={`${cardClass} p-8 flex flex-col items-center justify-center text-center group stagger-card-base`}
            style={{ minHeight: '320px' }}
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 rounded-2xl">
              <img
                src={getDeityImage(deityName)}
                alt={deityName}
                className="object-contain max-h-full max-w-full rounded-2xl"
                // CRITICAL FIX: Use 'eager' for the first 3 images to prevent CLS
                loading={index < 3 ? 'eager' : 'lazy'} 
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{deityName}</h2>
            <p className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {getDeityDescription(deityName)}
            </p>
            <div className={`mt-3 text-xs px-3 py-1 rounded-full ${
              isDarkMode ? "bg-orange-900 text-orange-200" : "bg-orange-100 text-orange-800"
            }`}>
              {getDisplayCount(deityName)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;