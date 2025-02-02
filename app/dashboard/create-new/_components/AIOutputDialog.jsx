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
    width: 'clamp(2rem, 5vw, 3.125rem)',
    height: 'clamp(2rem, 5vw, 3.125rem)',
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: 'clamp(0.5rem, 1vw, 0.625rem)',
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
      <AlertDialogContent className="max-w-[95vw] w-full lg:max-w-5xl max-h-screen bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Fixed Header */}
        <AlertDialogHeader className="relative p-2 sm:p-3 lg:p-6 border-b border-gray-200">
          <AlertDialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Result:
          </AlertDialogTitle>
          <Button
            variant="ghost" 
            className="absolute right-2 top-2 p-1 sm:p-1.5 lg:p-2 hover:bg-gray-100 rounded-full"
            onClick={() => closeDialog(false)}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
            <span className="sr-only">Close</span>
          </Button>
        </AlertDialogHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-6">
          <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] relative rounded-lg overflow-hidden border border-gray-200">
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
        </div>

        {/* Fixed Footer */}
        <AlertDialogFooter className="border-t border-gray-200 p-2 sm:p-3 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 w-full">
            <Button 
              onClick={() => closeDialog(false)}
              variant="outline"
              className="w-full py-1 sm:py-1.5 lg:py-2 text-sm sm:text-base lg:text-lg"
            >
              Close
            </Button>
            <Button 
              className="w-full py-1 sm:py-1.5 lg:py-2 text-sm sm:text-base lg:text-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              onClick={downloadImages}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">Download Both Images</span>
              <span className="inline sm:hidden">Download</span>
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AIOutputDialog