/**
 * Utility functions for handling image URLs
 */

/**
 * Fix image URL to use the correct API base URL
 * @param imageUrl - The original image URL from API
 * @returns Corrected image URL
 */
export const fixImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // If imageUrl is already a full URL with the correct domain, return as is
  if (imageUrl.includes(apiUrl.replace('/api', ''))) {
    return imageUrl;
  }
  
  // If it's a relative URL or uses localhost/127.0.0.1, fix it
  if (imageUrl.startsWith('/uploads/') || 
      imageUrl.includes('127.0.0.1:8000/uploads/') ||
      imageUrl.includes('localhost:8000/uploads/')) {
    
    // Extract the path part
    let imagePath = imageUrl;
    if (imagePath.includes('/uploads/')) {
      imagePath = imagePath.substring(imagePath.indexOf('/uploads/'));
    }
    
    // Construct the correct URL
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's already a complete URL, return as is
  return imageUrl;
};

/**
 * Get image preview URL for display
 * @param imageUrl - The original image URL
 * @returns URL suitable for preview
 */
export const getImagePreviewUrl = (imageUrl: string): string => {
  return fixImageUrl(imageUrl);
};