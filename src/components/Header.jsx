import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Search, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Header = ({ isDarkMode, toggleDarkMode, bucketlistCount, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionRef = useRef(null);
  const userMenuRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();

  // Preload header logo on mount
  useEffect(() => {
    const preloadLogo = () => {
      const img = new Image();
      img.src = 'https://res.cloudinary.com/dto53p1cf/image/upload/v1759162425/logo3_r9jcyb.png';
    };
    
    preloadLogo();
  }, []);

  // Enhanced search suggestions with categories
  const searchSuggestions = [
    { term: 'Murugan Arupadai veedu (6 Houses) of Lord Murugan', category: 'Murugan Category', description: 'Six sacred abodes of Lord Murugan' },
    { term: 'Jyotirlingas', category: 'Shiva Category', description: '12 self-manifested Shiva shrines' },
    { term: 'Divya Desams', category: 'Vishnu Category', description: '108 sacred Vishnu temples' },
    { term: 'Shakti Peethas', category: 'Goddess Category', description: 'Sacred goddess sati temples' },
    { term: 'Navagraha', category: 'Planetary Category', description: 'Nine planetary temples' },
    { term: 'Palani', category: 'Temple Name', description: 'Famous Murugan temple' },
    { term: 'Tirupati', category: 'Temple Name', description: 'Venkateswara temple' },
    { term: 'Sabarimala', category: 'Temple Name', description: 'Lord Ayyappa temple' },
    { term: 'Tamil Nadu', category: 'Location', description: 'Temples in Tamil Nadu' },
    { term: 'Maharashtra', category: 'Location', description: 'Temples in Maharashtra' },
    { term: 'Kerala', category: 'Location', description: 'Temples in Kerala' },
    { term: 'Karnataka', category: 'Location', description: 'Temples in Karnataka' },
    { term: 'Andhra Pradesh', category: 'Location', description: 'Temples in Andhra Pradesh' }
  ];

  // Filter suggestions based on search query
  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) return searchSuggestions.slice(0, 6);
    
    return searchSuggestions.filter(suggestion => 
      suggestion.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.term);
    setShowSuggestions(false);
    onSearch(suggestion.term);
    navigate(`/search?q=${encodeURIComponent(suggestion.term)}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search suggestions
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      
      // Close user menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close suggestions on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 shadow-2xl relative z-50 md:sticky md:top-0">
      <div className="container mx-auto px-3 flex flex-col items-center md:flex-row md:justify-between md:items-center md:gap-6">
        {/* Left Section: Logo and TTZ Wording */}
       <div className="flex justify-center items-center w-full md:w-auto md:flex-shrink-0">
  <div 
    className="flex items-center cursor-pointer" 
    onClick={() => navigate('/')}
  >
    <img 
      src="https://res.cloudinary.com/dto53p1cf/image/upload/v1760019413/final_mby3yk.png" 
      width={80} 
      height={80} 
      alt="TempleTravellerZ Logo"
      loading="eager"
      className="-mt-1.5" 
    />
    <div className="flex flex-col mt-0.5"> 
      <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">
        TempleTravellerZ
      </h1>
      <span className='text-xs md:text-sm px-1 font-normal whitespace-nowrap'>Mandir Tales, Modern Trails</span>
    </div>
  </div>
</div>

        {/* Center: Enhanced Search Bar */}
        <div className="relative w-full md:flex-grow mt-4 md:mt-0 mx-auto md:max-w-xs lg:max-w-sm">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search temples, categories, locations..." 
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="w-full px-4 py-2 pr-20 rounded-full border border-amber-50 text-white
                         focus:outline-none focus:ring-2 focus:ring-white 
                         bg-opacity-20 backdrop-blur-sm placeholder-white"
              />
              
              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-white hover:text-amber-100 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              
              {/* Search button */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-amber-100 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && getFilteredSuggestions().length > 0 && (
            <div 
              ref={suggestionRef}
              className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border max-h-80 overflow-y-auto z-50 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {getFilteredSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-opacity-80 transition-colors duration-150 flex items-start justify-between group ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-white' 
                      : 'hover:bg-gray-50 text-gray-900'
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${
                    index === getFilteredSuggestions().length - 1 ? 'rounded-b-lg' : 'border-b border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium mb-1">{suggestion.term}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {suggestion.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.category === 'Murugan Category' 
                        ? isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                      : suggestion.category === 'Ganesha Category'
                        ? isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      : suggestion.category === 'Shiva Category'
                        ? isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      : suggestion.category === 'Location'
                        ? isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {suggestion.category}
                    </span>
                    <Search 
                      size={14} 
                      className={`mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} 
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center justify-center md:justify-start space-x-2 mt-4 md:mt-0 w-full md:w-auto md:flex-nowrap">
          <button
            onClick={() => navigate('/')}
            className="py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:text-orange-600"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/bucketlist')}
            className="py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:text-orange-600 relative"
          >
            Bucketlist
            {bucketlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-orange-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {bucketlistCount > 99 ? '99+' : bucketlistCount}
              </span>
            )}
          </button>
          
          {/* User Authentication Section */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:text-orange-600 flex items-center space-x-2"
              >
                <User size={20} />
                <span className="hidden md:inline">{user?.name || 'User'}</span>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="px-3 py-1">
                    <div className={` py-3 text-sm border-b ${
                      isDarkMode 
                        ? 'text-gray-300 border-gray-700' 
                        : 'text-gray-700 border-gray-200'
                    }`}>

                      <p className="font-medium ">{user?.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user?.email}
                      </p>
                    
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className={`w-full py-2 text-left text-sm hover:bg-opacity-80 transition-colors duration-150 flex items-center space-x-2 ${
                        isDarkMode 
                          ? 'text-red-400 hover:bg-gray-700' 
                          : 'text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                    
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:text-orange-600"
            >
              Login
            </button>
          )}
          
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:text-orange-600"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun size={24} />
              
            ) : (
              <Moon size={24} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;