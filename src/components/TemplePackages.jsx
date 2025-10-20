import React, { useRef, useState } from 'react';

const TemplePackages = ({ isDarkMode, onPackageClick }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const packages = [
    {
      id: 'char-dham',
      name: 'Char Dham Yatra',
      duration: '10-12 Days',
      temples: ['Badrinath', 'Puri', 'Dwarka', 'rameshwaram'],
      
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1760706892/dd105_svznf8.jpg',
      
      season: 'May-October',
      description: 'Complete sacred circuit of Uttarakhand\'s four holy shrines'
    },
    {
      id: 'divya-desam-south',
      name: 'South India Divya Desam Tour',
      duration: '7 Days',
      temples: ['Srirangam', 'Tirupati', 'Kanchipuram', 'Madurai'],
      
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1760705799/dd1_beavbf.jpg',
      
      season: 'Oct-March',
      description: 'Visit the most important Vishnu temples in South India'
    },
    {
      id: 'jyotirlinga-circuit',
      name: '12 Jyotirlinga Darshan',
      duration: '14 Days',
      temples: ['Somnath', 'Mahakaleshwar', 'Omkareshwar', 'Kedarnath'],
     
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147388/j1_t07hmo.png',
      
      season: 'Year-round',
      description: 'Complete pilgrimage of all 12 sacred Shiva shrines'
    },
    {
      id: 'arupadai-veedu',
      name: 'Arupadai Veedu (6 Abodes)',
      duration: '5 Days',
      temples: ['Palani', 'Thiruchendur', 'Swamimalai', 'Thiruparankundram'],
      
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147323/m1_vrxbv9.png',
      
      season: 'Oct-March',
      description: 'Complete tour of Lord Murugan\'s six sacred abodes'
    },
    {
      id: 'shakti-peetha',
      name: 'Shakti Peetha Yatra',
      duration: '12 Days',
      temples: ['Kamakhya', 'Kalighat', 'Vaishno Devi', 'Jwalamukhi'],
      
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147281/shakti_e7kaaz.png',
      
      season: 'Year-round',
      description: 'Sacred journey to powerful Goddess Shakti temples'
    },
    {
      id: 'pancha-bhoota',
      name: 'Pancha Bhoota Sthalams',
      duration: '4 Days',
      temples: ['Ekambareswarar', 'Jambukeswarar', 'Annamalaiyar', 'Srikalahasti'],
     
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147292/pb_ng5jll.png',
      
      season: 'Oct-March',
      description: 'Visit temples representing five elements of nature'
    },
    {
      id: 'hanuman-circuit',
      name: 'Hanuman Temple Circuit',
      duration: '6 Days',
      temples: ['Sankat Mochan', 'Mahavir Mandir', 'Salasar Balaji', 'Panchmukhi'],
      
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147343/hanuman_smnyyx.png',
      
      season: 'Year-round',
      description: 'Powerful circuit of Lord Hanuman\'s sacred shrines'
    },
    {
      id: 'ashtavinayak',
      name: 'Ashtavinayak Yatra',
      duration: '2 Days',
      temples: ['Mayureshwar', 'Siddhivinayak', 'Ballaleshwar', 'Varadavinayak'],
      
      image: 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759147355/ganesha_xgclup.png',
      
      season: 'Year-round',
      description: 'Complete 8 sacred Ganesha temples in Maharashtra'
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'Moderate': return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'Challenging': return isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  return (
    <div className={`py-12 rounded-2xl mb-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
             Curated Temple Packages ✨
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Handpicked spiritual journeys for every Temple Traveller
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-900'
              }`}
              style={{ marginLeft: '-16px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-900'
              }`}
              style={{ marginRight: '-16px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Package Cards */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`flex-shrink-0 w-80 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={() => onPackageClick && onPackageClick(pkg)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                  
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  
                  <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pkg.description}
                  </p>

                  {/* Key Temples */}
                  <div className="mb-3">
                    <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      KEY TEMPLES:
                    </p>
                    <div className="flex flex-wrap gap-1 ">
                      {pkg.temples.slice(0, 3).map((temple, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-xl ${
                            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {temple}
                        </span>
                      ))}
                      {pkg.temples.length > 3 && (
                        <span className={`text-xs px-2 py-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          +{pkg.temples.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                        Best Season
                      </p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                        {pkg.season}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm ${
                      isDarkMode ? 'bg-blue-900 bg-opacity-90 text-blue-200' : 'bg-blue-500 bg-opacity-90 text-white'
                    }`}>
                      {pkg.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TemplePackages;