/**
 * Image URL Utilities
 * Handles image URL construction with proper backend path resolution
 */

/**
 * Get full image URL from backend path or remote URL
 * @param imagePath - Image path or URL from API (e.g., "/uploads/image.jpg" or "https://...")
 * @returns Full image URL ready for img src
 */
export const getImageUrl = (imagePath: string | undefined | null): string => {
  // Handle missing/null/empty paths
  if (!imagePath || imagePath.trim() === '') {
    return getPlaceholderUrl('No image available');
  }

  // Already a full URL (http/https) or base64 data
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Prepend backend URL for all local paths (e.g. /uploads/..., uploads/..., /products/...)
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  const baseUrl = (rawUrl && rawUrl !== 'undefined')
    ? rawUrl.replace(/\/api\/?$/, '')
    : 'http://localhost:5000';
    
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
};

/**
 * Get placeholder URL with optional message
 * @param message - Optional message to display
 * @returns Placeholder image URL
 */
export const getPlaceholderUrl = (message: string = 'Image not available'): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://via.placeholder.com/300?text=${encodedMessage}`;
};

/**
 * Batch process multiple image paths
 * @param imagePaths - Array of image paths
 * @returns Array of full image URLs
 */
export const getImageUrls = (imagePaths: (string | undefined)[]): string[] => {
  return imagePaths.map(getImageUrl);
};

/**
 * Get safe image URL with fallback
 * @param primaryPath - Primary image path
 * @param fallbackPath - Fallback image path if primary fails
 * @returns Primary URL or fallback URL
 */
export const getSafeImageUrl = (
  primaryPath: string | undefined,
  fallbackPath?: string | undefined
): string => {
  const primary = getImageUrl(primaryPath);
  
  // If primary looks like an error placeholder, try fallback
  if (primary.includes('placeholder') && fallbackPath) {
    const fallback = getImageUrl(fallbackPath);
    if (!fallback.includes('placeholder')) {
      return fallback;
    }
  }
  
  return primary;
};

/**
 * Handle image error with fallback
 * @param event - Image element event
 * @param fallbackUrl - URL to use on error
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl?: string
): void => {
  const img = event.currentTarget;
  
  if (fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    img.src = getPlaceholderUrl('Image failed to load');
  }
  
  // Add visual indication of error
  img.classList.add('opacity-75', 'grayscale');
};

/**
 * Preload image to check if it's accessible
 * @param url - Image URL to preload
 * @returns Promise that resolves if image loads, rejects if it fails
 */
export const preloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

/**
 * Get image from multiple sources, trying each until one loads
 * @param imagePaths - Array of image paths to try in order
 * @returns Promise with first accessible image URL
 */
export const getFirstAccessibleImage = async (
  imagePaths: (string | undefined)[]
): Promise<string> => {
  const urls = imagePaths.map(getImageUrl);
  
  for (const url of urls) {
    try {
      await preloadImage(url);
      return url;
    } catch (err) {
      // Try next URL
      continue;
    }
  }
  
  // All failed, return placeholder
  return getPlaceholderUrl('No accessible images');
};

/**
 * Format image object from API into display format
 * @param imageData - Image data from API
 * @returns Formatted image with URL and metadata
 */
export interface FormattedImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const formatImage = (
  imagePath: string | undefined,
  alt: string,
  metadata?: { width?: number; height?: number; loading?: 'lazy' | 'eager' }
): FormattedImage => {
  return {
    src: getImageUrl(imagePath),
    alt,
    width: metadata?.width,
    height: metadata?.height,
    loading: metadata?.loading || 'lazy',
  };
};

/**
 * Format multiple images
 * @param images - Array of image paths
 * @param altBase - Base for alt text (will be indexed)
 * @returns Array of formatted images
 */
export const formatImages = (
  images: (string | undefined)[],
  altBase: string = 'Image'
): FormattedImage[] => {
  return images.map((img, index) => formatImage(img, `${altBase} ${index + 1}`));
};

/**
 * Clean image URL (remove query params, normalize)
 * @param url - Image URL to clean
 * @returns Cleaned URL
 */
export const cleanImageUrl = (url: string): string => {
  try {
    const cleanUrl = new URL(url);
    cleanUrl.search = ''; // Remove query params
    return cleanUrl.toString();
  } catch {
    // If not a valid URL, return as-is
    return url.split('?')[0]; // Remove query string
  }
};

/**
 * Get image dimensions if available
 * @param url - Image URL
 * @returns Promise with dimensions
 */
export const getImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};

// Export all utilities
export default {
  getImageUrl,
  getPlaceholderUrl,
  getImageUrls,
  getSafeImageUrl,
  handleImageError,
  preloadImage,
  getFirstAccessibleImage,
  formatImage,
  formatImages,
  cleanImageUrl,
  getImageDimensions,
};