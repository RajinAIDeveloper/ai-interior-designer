'use client'

export const validateImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Check if image dimensions are within acceptable range
        if (img.width < 256 || img.height < 256) {
          reject(new Error('Image dimensions must be at least 256x256 pixels'));
        } else if (img.width > 4096 || img.height > 4096) {
          reject(new Error('Image dimensions must not exceed 4096x4096 pixels'));
        } else {
          resolve(true);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const validateImage = async (file) => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Please select only JPG or PNG images');
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size should be less than 5MB');
  }

  // Check dimensions
  await validateImageDimensions(file);
  
  return true;
};