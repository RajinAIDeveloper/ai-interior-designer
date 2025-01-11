import { v4 as uuidv4 } from "uuid";
import axios from "axios";


export async function urlToUploadableFile(imageUrl, fileName = `${uuidv4()}.png`) {
    try {
      console.log('Fetching image from URL:', imageUrl);
      
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      
      // Create a File object that matches the format your input image uses
      const blob = new Blob([response.data], { type: 'image/png' });
      const file = new File([blob], fileName, { type: 'image/png' });
      
      // Add any properties that might be needed to match your input file format
      Object.defineProperty(file, 'name', {
        writable: true,
        value: fileName
      });
  
      return file;
    } catch (error) {
      console.error('Error converting URL to file:', error);
      throw error;
    }
  }