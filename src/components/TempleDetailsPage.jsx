import React, { useState, useEffect } from "react";
import { api, getImageUrl } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

// SimpleTempleMap and utility functions remain UNCHANGED
const SimpleTempleMap = ({ location, templeName, isDarkMode }) => {
  // ... (unchanged)
};

// Update props: ADD onSync and showNotification
const TempleDetailsPage = ({ bucketlist, onAdd, onRemove, onSync, isDarkMode, showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bucketlistLoading, setBucketlistLoading] = useState(false);
  
  // Existing logic to check if temple is in the local list
  const isInBucketlist = !!bucketlist.find(item => item.templeId === id);

  useEffect(() => {
    // ... (fetch temple details logic remains unchanged)
    const fetchTemple = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.temples.getTempleById(id);
            setTemple(data);
        } catch (err) {
            setError(err.message || 'Failed to load temple details');
        } finally {
            setLoading(false);
        }
    };
    fetchTemple();
  }, [id]);
  
  const handleBucketlistToggle = async () => {
    if (bucketlistLoading || !temple) return;

    setBucketlistLoading(true);
    try {
      if (isInBucketlist) {
        // --- REMOVE LOGIC ---
        await api.bucketlist.removeItem(token, temple.id);
        onRemove(temple.id);
        if (showNotification) showNotification('success', `${temple.name} removed from bucketlist.`);
        
      } else {
        // --- ADD LOGIC ---
        const itemPayload = {
          templeId: temple.id,
          templeName: temple.name,
          templeLocation: temple.location,
          templeImage: temple.image,
          deity: temple.deity,       
          category: temple.category, 
        };
        
        // This is the call that throws the "already present" error
        await api.bucketlist.addItem(token, itemPayload);
        
        // If successful, update the local state via parent
        onAdd({ 
          ...itemPayload,
          addedAt: new Date().toISOString()
        });

        if (showNotification) showNotification('success', `${temple.name} added to bucketlist!`);
      }
    } catch (error) {
      console.error('Failed to update bucketlist:', error);
      
      const errorMessage = error.message || 'Failed to update bucketlist.';
      
      // FIX: State synchronization logic
      if (
        errorMessage.toLowerCase().includes('already in bucketlist') || 
        errorMessage.toLowerCase().includes('duplicate key')
      ) {
        
        console.warn('Detected state mismatch (backend says already present). Forcing full bucketlist re-sync.');
        
        // Call the onSync prop from App.jsx to force a full DB fetch
        if (onSync) onSync(); 
        
        // Notify the user the UI state has been corrected
        if (showNotification) {
          showNotification('info', `${temple.name} was already present. List corrected.`);
        }
      } else {
        // Handle other, real errors
        if (showNotification) {
          showNotification('error', errorMessage);
        }
      }
      
    } finally {
      setBucketlistLoading(false);
    }
  };

  if (loading) return <div className={`text-center py-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading...</div>;
  if (error) return <div className={`text-center py-16 text-red-500`}>{error}</div>;
  if (!temple) return <div className={`text-center py-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Temple not found.</div>;
  
  // ... (rest of the component JSX remains unchanged)
  return (
    // ... (JSX unchanged)
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
          {bucketlistLoading ? 'Processing...' : (isInBucketlist ? "— Remove from Bucketlist" : "+ Add to Bucketlist")}
        </button>
      </div>
    // ...
  );
};

export default TempleDetailsPage;