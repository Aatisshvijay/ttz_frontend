import React, { useState, useEffect, useCallback } from 'react';
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

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);
  
  const handleAdd = useCallback((item) => {
    setBucketlist(prevList => {
      // Prevent duplicates in local state
      if (!prevList.some(i => i.templeId === item.templeId)) {
        return [...prevList, item];
      }
      return prevList;
    });
  }, []);

  const handleRemove = useCallback((templeId) => {
    setBucketlist(prevList => prevList.filter(item => item.templeId !== templeId));
  }, []);


  // Function to load/re-sync the entire bucketlist from the API
  const loadBucketlist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.bucketlist.getBucketlist(token);
      setBucketlist(data || []); // Ensure it's an array
    } catch (error) {
      console.error('Failed to load bucketlist:', error);
      if (isAuthenticated) {
         showNotification('error', 'Failed to load your bucketlist.');
      }
      setBucketlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, showNotification]);
  
  // FIX: New function to be passed down to force a full re-sync
  const handleSyncBucketlist = useCallback(() => {
    console.log("Forcing bucketlist re-sync from parent (App.jsx).");
    loadBucketlist();
  }, [loadBucketlist]);


  useEffect(() => {
    loadBucketlist();
  }, [isAuthenticated, token, loadBucketlist]); 

  // ... (handleToggleDarkMode remains unchanged)
  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={() => {
          // Assuming AuthContext handles the actual logout logic
          navigate('/');
        }}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
          <Route path="/deity/:godName" element={<GodTemplesPage isDarkMode={isDarkMode} />} />
          <Route path="/deity/:godName/category/:categoryName" element={<CategoryTemplesPage isDarkMode={isDarkMode} />} />
          
          <Route path="/temple/:id" element={
            <TempleDetailsPage 
              bucketlist={bucketlist} 
              onAdd={handleAdd} 
              onRemove={handleRemove} 
              onSync={handleSyncBucketlist} // FIX: Pass the new sync function
              isDarkMode={isDarkMode} 
              showNotification={showNotification}
            />
          } />

          <Route path="/bucketlist" element={
            <BucketlistPage 
              bucketlist={bucketlist} 
              onRemove={handleRemove} 
              isDarkMode={isDarkMode}
            />
          } />
          
          <Route path="/search" element={<SearchPage isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} />} />
          <Route path="/register" element={<LoginPage isDarkMode={isDarkMode} isRegister={true} />} />
          
          <Route path="*" element={
            <div className="text-center py-16">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>404 - Page Not Found</h2>
              <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors">Go to Home</button>
            </div>
          } />
        </Routes>
      </main>

      {/* ... (Notification UI remains unchanged) */}
    </div>
  );
};

export default App;