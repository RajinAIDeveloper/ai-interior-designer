import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AIOutputDialog = ({openDialog, closeDialog, originalImage, aiImage}) => {
  const firstImage = {
    imageUrl: originalImage,
    width: '100%',
    height: '100%'
  };
  
  const secondImage = {
    imageUrl: aiImage,
    width: '100%',
    height: '100%'
  };

  const delimiterIconStyles = {
    width: '50px',
    height: '50px',
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const downloadImages = async () => {
    try {
      // Download original image
      const originalResponse = await fetch(originalImage);
      const originalBlob = await originalResponse.blob();
      const originalUrl = window.URL.createObjectURL(originalBlob);
      const originalLink = document.createElement('a');
      originalLink.href = originalUrl;
      originalLink.download = 'original-room.jpg';
      document.body.appendChild(originalLink);
      originalLink.click();
      document.body.removeChild(originalLink);
      window.URL.revokeObjectURL(originalUrl);

      // Download AI generated image
      const aiResponse = await fetch(aiImage);
      const aiBlob = await aiResponse.blob();
      const aiUrl = window.URL.createObjectURL(aiBlob);
      const aiLink = document.createElement('a');
      aiLink.href = aiUrl;
      aiLink.download = 'ai-generated-room.jpg';
      document.body.appendChild(aiLink);
      aiLink.click();
      document.body.removeChild(aiLink);
      window.URL.revokeObjectURL(aiUrl);

      toast.success('Images downloaded successfully!');
    } catch (error) {
      console.error('Error downloading images:', error);
      toast.error('Failed to download images. Please try again.');
    }
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={closeDialog}>
      <AlertDialogContent className="max-w-5xl p-6 bg-white rounded-lg shadow-2xl">
        <AlertDialogHeader className="relative mb-4">
          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
            Result:
          </AlertDialogTitle>
          <Button
            variant="ghost" 
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => closeDialog(false)}
          >
            <X className="h-6 w-6 text-gray-600" />
            <span className="sr-only">Close</span>
          </Button>
        </AlertDialogHeader>
        
        <div className="w-full h-[600px] relative rounded-lg overflow-hidden border border-gray-200">
          {originalImage && aiImage && (
            <ReactBeforeSliderComponent
              firstImage={firstImage}
              secondImage={secondImage}
              withResizeFeel={true}
              delimiterColor="#ffffff"
              delimiterIconStyles={delimiterIconStyles}
              className="h-full"
            />
          )}
        </div>

        <AlertDialogFooter className="mt-6">
          <div className="flex gap-4 w-full">
            <Button 
              onClick={() => closeDialog(false)}
              variant="outline"
              className="w-full py-2 text-lg"
            >
              Close
            </Button>
            <Button 
              className="w-full py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              onClick={downloadImages}
            >
              <Download className="w-5 h-5" />
              Download Both Images
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AIOutputDialog