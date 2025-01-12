// @/utils/public-utils.js

export const validateImage = async (file) => {
    if (!file) {
      throw new Error('Please select an image');
    }
  
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, JPG, or PNG)');
    }
  
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB');
    }
  
    // Check dimensions
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src); // Clean up
        const minDimension = 300;
        const maxDimension = 4096;
  
        if (img.width < minDimension || img.height < minDimension) {
          reject(new Error(`Image dimensions must be at least ${minDimension}x${minDimension} pixels`));
        } else if (img.width > maxDimension || img.height > maxDimension) {
          reject(new Error(`Image dimensions must not exceed ${maxDimension}x${maxDimension} pixels`));
        } else {
          resolve();
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
  
      img.src = URL.createObjectURL(file);
    });
  };