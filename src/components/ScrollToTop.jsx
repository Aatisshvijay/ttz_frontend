// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This runs every time the route (pathname) changes
    window.scrollTo(0, 0);
  }, [pathname]); // Rerun the effect whenever the path changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;