const API_BASE_URL = 'https://portfolio-backend-ckqx.onrender.com';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return `${API_BASE_URL}/uploads/blog/default.jpg`;
  

  if (imagePath.startsWith('http')) return imagePath;
  
  
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${API_BASE_URL}${normalizedPath}`;
};

export const handleImageError = (e, fallbackImage = `${API_BASE_URL}/uploads/blog/default.jpg`) => {
  console.error('Image load failed:', {
    originalSrc: e.target.src,
    fallback: fallbackImage
  });
  
  if (!e.target.src.includes('default.jpg')) {
    e.target.src = fallbackImage;
  }
};
