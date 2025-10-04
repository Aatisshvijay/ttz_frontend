import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import all components
import Header from './components/Header';
import HomePage from './components/HomePage';
import GodTemplesPage from './components/GodTemplesPage';
import AvatarTemplesPage from './components/AvatarTemplesPage';
import TempleDetailsPage from './components/TempleDetailsPage';
import BucketlistPage from './components/BucketlistPage';
import SearchPage from './components/SearchPage';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

// Import AuthContext
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Import API service
import { api } from './services/api';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const [bucketlist, setBucketlist] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    loadBucketlist();
  }, [isAuthenticated, token]);

  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Current search:', location.search);
  }, [location]);

  const loadBucketlist = async () => {
    try {
      setLoading(true);
      const bucketlistData = await api.bucketlist.getBucketlist(token); // FIXED
      setBucketlist(bucketlistData);
    } catch (error) {
      console.error("Failed to load bucketlist:", error);
      showNotification('Failed to load your bucketlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddToBucketlist = async (temple) => {
    try {
      setLoading(true);
      
      const isAlreadyInBucketlist = bucketlist.some(item => item.templeId === temple.templeId);
      if (isAlreadyInBucketlist) {
        showNotification(`${temple.templeName} is already in your bucketlist.`, 'info');
        return;
      }

      await api.bucketlist.addItem(token, temple.templeId); // FIXED
      setBucketlist(prev => [...prev, temple]);
      showNotification(`${temple.templeName} added to your bucketlist!`);
      
    } catch (error) {
      console.error('Failed to add to bucketlist:', error);
      if (error.message.includes('already in bucketlist')) {
        showNotification(`Temple is already in your bucketlist.`, 'info');
      } else {
        showNotification('Failed to add temple to bucketlist', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromBucketlist = async (templeId) => {
    try {
      setLoading(true);
      
      await api.bucketlist.removeItem(token, templeId); // FIXED
      setBucketlist(prev => prev.filter(item => item.templeId !== templeId));
      showNotification('Temple removed from bucketlist.', 'info');
      
    } catch (error) {
      console.error('Failed to remove from bucketlist:', error);
      showNotification('Failed to remove temple from bucketlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    console.log('Navigating to search with query:', query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        bucketlistCount={bucketlist.length}
        onSearch={handleSearch}
      />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {loading && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`px-4 py-2 rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                <span>Loading...</span>
              </div>
            </div>
          </div>
        )}
        
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                isDarkMode={isDarkMode} 
                navigate={navigate} 
              />
            } 
          />
          
          <Route 
            path="/search" 
            element={
              <SearchPage 
                isDarkMode={isDarkMode} 
                navigate={navigate} 
              />
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <LoginPage 
                isDarkMode={isDarkMode} 
              />
            } 
          />
          
          <Route 
            path="/bucketlist" 
            element={
              <BucketlistPage 
                bucketlist={bucketlist} 
                onRemove={handleRemoveFromBucketlist} 
                isDarkMode={isDarkMode} 
              />
            } 
          />
          
          <Route 
            path="/temple/:templeId" 
            element={
              <TempleDetailsPage 
                isDarkMode={isDarkMode} 
                bucketlist={bucketlist} 
                onAdd={handleAddToBucketlist} 
                onRemove={handleRemoveFromBucketlist} 
              />
            } 
          />
          
          <Route 
            path="/god/:godName/:categoryName" 
            element={
              <AvatarTemplesPage 
                isDarkMode={isDarkMode} 
              />
            } 
          />
          
          <Route 
            path="/god/:godName" 
            element={
              <GodTemplesPage 
                isDarkMode={isDarkMode} 
              />
            } 
          />
          
          <Route 
            path="*" 
            element={
              <div className="text-center py-16">
                <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Page Not Found
                </h2>
                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  The page you're looking for doesn't exist.
                </p>
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
            } 
          />
        </Routes>
      </main>

      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-500 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default App;