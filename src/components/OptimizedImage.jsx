import React, { useState, useMemo } from 'react';

const DEFAULT_FALLBACK_URL = "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png";

// Optimization function to ensure q_auto:best
const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto:best,w_${width},fl_progressive,dpr_auto/${parts[1]}`;
  }
  return url;
};

// Blur placeholder function for progressive rendering
const getBlurPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_20,e_blur:1000,q_auto:low,f_auto/${parts[1]}`;
  }
  return null;
};

/**
 * Renders an optimized, responsive, and lazy-loaded image with loading animations.
 * Features:
 * ✅ Full HD Quality (q_auto:best)
 * ✅ Responsive Images (srcset)
 * ✅ CLS Prevention (explicit dimensions)
 * ✅ Performance (lazy loading, blur placeholders)
 * ✅ Production Ready (error boundaries, loading states, accessibility)
 * ✅ Dark Mode support
 */
const OptimizedImage = ({ 
    src, 
    alt, 
    className = "", 
    width = 400, 
    height = 250, 
    eagerLoad = false, 
    isDarkMode = false, 
    ...errorProps // Spread remaining props to the error div for unique key/id if needed
}) => {
    
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [placeholderLoaded, setPlaceholderLoaded] = useState(false);

    const initialOptimizedUrl = useMemo(() => optimizeCloudinaryUrl(src || DEFAULT_FALLBACK_URL, width), [src, width]);
    const blurPlaceholderUrl = useMemo(() => getBlurPlaceholder(src || DEFAULT_FALLBACK_URL), [src]);
    const srcSet = useMemo(() => [400, 800, 1200].map(w => `${optimizeCloudinaryUrl(src || DEFAULT_FALLBACK_URL, w)} ${w}w`).join(', '), [src]);
    const sizes = `(max-width: 600px) 400px, 800px`;

    const handleLoad = () => {
        setImageLoaded(true);
    };

    const handleError = (e) => {
        console.error('Image failed to load:', src, e);
        setImageError(true);
        // Fallback to default if needed, but error state handles it visually
    };

    const handlePlaceholderLoad = () => {
        setPlaceholderLoaded(true);
    };

    // Calculate the aspect ratio padding for CLS prevention using useMemo for stability
    // This calculates (Height / Width) * 100%
    const aspectRatioPadding = useMemo(() => {
        if (!width || !height || width <= 0 || height <= 0) return 0;
        return (height / width) * 100;
    }, [width, height]);


    return (
        /* * FIX: Use Padding-Bottom to establish the Aspect Ratio container
        * This ensures the browser reserves the vertical space (height/width) * 100% 
        * before the image content is drawn.
        */
        <div 
            className={`relative w-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            // Remove Tailwind h-48 or similar classes from the parent div if they conflict with the aspect ratio box
            style={{ 
                paddingBottom: `${aspectRatioPadding}%`,
            }}
        >
            
            {/* Blur Placeholder */}
            {blurPlaceholderUrl && (
                <img
                    src={blurPlaceholderUrl}
                    alt={`${alt} placeholder`}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${placeholderLoaded && !imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handlePlaceholderLoad}
                    aria-hidden="true" // Hide from screen readers
                />
            )}

            {/* Loading Spinner */}
            {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-300 border-t-orange-500 z-10"></div>
                </div>
            )}
            
            {/* Error State */}
            {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 p-2 text-center text-xs z-10" {...errorProps}>
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Image Error</span>
                </div>
            )}

            {/* Main Image */}
            <img
                src={initialOptimizedUrl}
                alt={alt}
                srcSet={srcSet}
                sizes={sizes}
                /* IMPORTANT: Make the image absolute to fit the aspect ratio container */
                className={`${className} absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${imageError ? 'hidden' : ''}`}
                width={width}
                height={height}
                loading={eagerLoad ? "eager" : "lazy"}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};

export default OptimizedImage;