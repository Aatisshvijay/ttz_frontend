import React, { useState, useEffect, useMemo } from 'react';

const DEFAULT_FALLBACK_URL = "https://res.cloudinary.com/dto53p1cf/image/upload/v1759147364/balaji_m7oo1u.png";

const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto:best,w_${width},fl_progressive,dpr_auto/${parts[1]}`;
  }
  return url;
};

const getBlurPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_20,e_blur:1000,q_auto:low,f_auto/${parts[1]}`;
  }
  return null;
};

const OptimizedImage = ({ 
    src, 
    alt, 
    className = "", 
    width = 400, 
    height = 250, 
    eagerLoad = false, 
    isDarkMode = false,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);

    const optimizedUrl = useMemo(() => optimizeCloudinaryUrl(src || DEFAULT_FALLBACK_URL, width), [src, width]);
    const blurPlaceholderUrl = useMemo(() => getBlurPlaceholder(src || DEFAULT_FALLBACK_URL), [src]);
    const srcSet = useMemo(() => [400, 800, 1200].map(w => `${optimizeCloudinaryUrl(src || DEFAULT_FALLBACK_URL, w)} ${w}w`).join(', '), [src]);
    
    // Calculate aspect ratio - FIXED
    const aspectRatio = useMemo(() => {
        if (!width || !height || width <= 0 || height <= 0) return '16 / 9'; // Default fallback
        return `${width} / ${height}`;
    }, [width, height]);

    // Preload image for eager loading
    useEffect(() => {
        if (eagerLoad && src) {
            const img = new Image();
            img.src = optimizedUrl;
            img.onload = () => {
                setImgSrc(optimizedUrl);
                setImageLoaded(true);
            };
            img.onerror = () => setImageError(true);
        } else if (src) {
            setImgSrc(optimizedUrl);
        }
    }, [src, optimizedUrl, eagerLoad]);

    const handleLoad = () => setImageLoaded(true);
    const handleError = () => {
        console.error('Image failed to load:', src);
        setImageError(true);
    };

    return (
        <div 
            className={`relative w-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            style={{ 
                aspectRatio: aspectRatio,
                minHeight: '192px' // Prevent collapse during load
            }}
        >
            {/* Blur Placeholder */}
            {blurPlaceholderUrl && !imageLoaded && !imageError && (
                <img
                    src={blurPlaceholderUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ aspectRatio: aspectRatio }}
                    aria-hidden="true"
                />
            )}

            {/* Loading Spinner - Removed to reduce CLS */}
            
            {/* Error State */}
            {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 p-2 text-center text-xs">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Image unavailable</span>
                </div>
            )}

            {/* Main Image */}
            {imgSrc && !imageError && (
                <img
                    src={imgSrc}
                    alt={alt}
                    srcSet={srcSet}
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
                    className={`${className} absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ aspectRatio: aspectRatio }}
                    width={width}
                    height={height}
                    loading={eagerLoad ? "eager" : "lazy"}
                    decoding={eagerLoad ? "sync" : "async"}
                    fetchpriority={eagerLoad ? "high" : "auto"}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    );
};

export default OptimizedImage;