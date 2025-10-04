import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleTravelPlannerModal from "./SimpleTravelPlannerModal";
import { getImageWithFallback } from "../services/api"; // ADD THIS IMPORT

const BucketlistPage = ({ bucketlist, onRemove, isDarkMode }) => {
  const navigate = useNavigate();
  const [showTravelPlanner, setShowTravelPlanner] = useState(false);

  const cardClass = `rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
    isDarkMode
      ? "bg-gray-800 text-gray-100 hover:shadow-gray-700"
      : "bg-white text-gray-800"
  }`;

  const validBucketlist = bucketlist.filter(
    (item) => item && item.templeId && item.templeName
  );

  if (validBucketlist.length === 0) {
    return (
      <div className="text-center py-16">
        <h2
          className={`text-3xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Your Temple Bucketlist is Empty
        </h2>
        <p
          className={`text-xl mb-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Start adding temples to unlock free journey planner!!
        </p>
        <button
          onClick={() => navigate("/")}
          className={`px-8 py-4 rounded-full font-semibold transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white"
          }`}
        >
          Explore Temples
        </button>
      </div>
    );
  }

  const sortedBucketlist = [...validBucketlist].sort((a, b) => {
    const dateA = new Date(a.addedAt || a.createdAt || Date.now());
    const dateB = new Date(b.addedAt || b.createdAt || Date.now());
    return dateB - dateA;
  });

  const handleTravelPlannerOpen = () => {
    console.log("Opening travel planner with bucketlist:", validBucketlist);
    setShowTravelPlanner(true);
  };

  // ADD THIS HELPER FUNCTION
  const getTempleImage = (item) => {
    // If image exists and is a full URL, use it
    if (item.templeImage && item.templeImage.startsWith('http')) {
      return item.templeImage;
    }
    
    // Otherwise use fallback based on temple name/location
    return getImageWithFallback({
      image: item.templeImage,
      name: item.templeName,
      location: item.templeLocation,
      deity: item.deity || '',
      category: item.category || ''
    });
  };

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          My Bucketlist 
        </h1>
        <p
          className={`text-m mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {validBucketlist.length} temple
          {validBucketlist.length !== 1 ? "s" : ""} on your spiritual journey
        </p>

        {validBucketlist.length >= 2 && (
          <button
            onClick={handleTravelPlannerOpen}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white"
                : "bg-gradient-to-r from-orange-500 to-red-500 to-blue-500 hover:from-red-500 hover:to-orange-500 text-white"
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Plan Your Temple Journey for free
          </button>
        )}

        {validBucketlist.length === 1 && (
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm ${
              isDarkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Add more temples to unlock travel planning features
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedBucketlist.map((item, index) => (
          <div
            key={item._id || item.templeId || `item-${index}`}
            className={cardClass}
          >
            <div className="relative">
              <img
                src={getTempleImage(item)} 
                alt={item.templeName}
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
                onClick={() => navigate(`/temple/${item.templeId}`)}
                onError={(e) => {
                  // UPDATED: Fallback if image fails to load
                  e.target.src = 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png';
                }}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.templeId);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-300 shadow-lg"
                title="Remove from bucketlist"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <h3
                className="text-xl font-bold mb-2 cursor-pointer hover:text-orange-500 transition-colors duration-300"
                onClick={() => navigate(`/temple/${item.templeId}`)}
              >
                {item.templeName}
              </h3>

              <p
                className={`text-sm mb-3 flex items-center ${
                  isDarkMode ? "text-orange-300" : "text-orange-600"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-1"
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
                {item.templeLocation}
              </p>

              <p
                className={`text-xs flex items-center mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Added{" "}
                {new Date(
                  item.addedAt || item.createdAt || Date.now()
                ).toLocaleDateString()}
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/temple/${item.templeId}`)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SimpleTravelPlannerModal
        isOpen={showTravelPlanner}
        onClose={() => setShowTravelPlanner(false)}
        bucketlist={validBucketlist}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default BucketlistPage;