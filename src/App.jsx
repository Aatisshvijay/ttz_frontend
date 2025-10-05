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
import ScrollToTop from './components/ScrollToTop'; 

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
  const [isLoadingBucketlist, setIsLoadingBucketlist] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, isAuthenticated } = useAuth();

  // Load bucketlist when auth state changes
  useEffect(() => {
    if (isAuthenticated && token) {
      loadBucketlist();
    } else if (isAuthenticated === false) {
      // Clear bucketlist when logged out
      setBucketlist([]);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Current search:', location.search);
  }, [location]);

  const loadBucketlist = async () => {
    // Don't try to load if not authenticated
    if (!isAuthenticated || !token) {
      setBucketlist([]);
      return;
    }
    
    if (isLoadingBucketlist) return; // Prevent concurrent loads
    
    setIsLoadingBucketlist(true);
    try {
      console.log('Loading bucketlist from backend...');
      const bucketlistData = await api.bucketlist.getBucketlist(token);
      console.log('Bucketlist loaded:', bucketlistData.length, 'items');
      setBucketlist(bucketlistData);
    } catch (error) {
      console.error("Failed to load bucketlist:", error);
      // Don't show error notification on initial load
      if (bucketlist.length > 0) {
        showNotification('Failed to load your bucketlist', 'error');
      }
    } finally {
      setIsLoadingBucketlist(false);
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

  // FIXED: Properly handle backend state sync
  const handleAddToBucketlist = async (temple) => {
    const templeId = temple.templeId || temple.id;
    const templeName = temple.templeName || temple.name;
    
    // Check local state first
    const isAlreadyInList = bucketlist.some(item => item.templeId === templeId);
    
    if (isAlreadyInList) {
      showNotification(`${templeName} is already in your bucketlist.`, 'info');
      return;
    }
    
    try {
      // Optimistic update
      const optimisticItem = {
        _id: `temp-${Date.now()}`,
        templeId,
        templeName,
        templeLocation: temple.location || '',
        templeImage: temple.image || '',
        deity: temple.deity || '',
        category: temple.category || '',
        addedAt: new Date().toISOString()
      };
      
      setBucketlist(prev => [optimisticItem, ...prev]);
      showNotification(`${templeName} added to your bucketlist!`);
      
      // Add to backend
      const newItem = await api.bucketlist.addItem(token, templeId);
      
      // Replace optimistic item with real one
      setBucketlist(prev => 
        prev.map(item => item._id === optimisticItem._id ? newItem : item)
      );
      
    } catch (error) {
      console.error('Failed to add to bucketlist:', error);
      
      // Rollback optimistic update
      setBucketlist(prev => prev.filter(item => item.templeId !== templeId));
      
      // Check if it's a duplicate error
      if (error.message && error.message.includes('already in bucketlist')) {
        // Silently sync with backend without showing notification
        console.log('Temple already exists in backend, syncing...');
        await loadBucketlist(); // Refresh from backend
      } else {
        showNotification('Failed to add temple to bucketlist', 'error');
      }
    }
  };

  // FIXED: Optimistic update with better error handling
  const handleRemoveFromBucketlist = async (templeId) => {
    const removedItem = bucketlist.find(item => item.templeId === templeId);
    
    if (!removedItem) {
      console.log('Item not found in local state');
      return;
    }
    
    try {
      // Optimistic update - remove from UI immediately
      setBucketlist(prev => prev.filter(item => item.templeId !== templeId));
      showNotification('Temple removed from bucketlist.', 'info');
      
      // Then update backend
      await api.bucketlist.removeItem(token, templeId);
      
    } catch (error) {
      console.error('Failed to remove from bucketlist:', error);
      
      // Rollback - add item back
      setBucketlist(prev => [removedItem, ...prev]);
      showNotification('Failed to remove temple from bucketlist', 'error');
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
      <ScrollToTop />
      <main className="container mx-auto px-4 py-8 flex-grow" style={{ minHeight: 'calc(100vh - 80px - 200px)' }}>
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
                showNotification={showNotification}
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