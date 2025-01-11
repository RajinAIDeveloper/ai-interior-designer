import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingHeader = () => {
  return (
    <header className='flex justify-between items-center p-5 shadow-md bg-white'>
      <div className='flex items-center gap-4 animate-pulse'>
        {/* Logo placeholder */}
        <div className='w-10 h-10 rounded-full bg-gray-200'></div>
        
        {/* Text placeholders */}
        <div className='space-y-2'>
          <div className='h-4 w-32 bg-gray-200 rounded'></div>
          <div className='h-3 w-24 bg-gray-200 rounded'></div>
        </div>
      </div>
      
      {/* Right side elements */}
      <div className='flex items-center gap-3'>
        <div className='h-8 w-8 rounded-full bg-gray-200 animate-pulse'></div>
        <div className='flex items-center gap-2 text-gray-500'>
          <Loader2 className='w-5 h-5 animate-spin' />
          <span className='text-sm font-medium'>Loading...</span>
        </div>
      </div>
    </header>
  );
};

export default LoadingHeader;