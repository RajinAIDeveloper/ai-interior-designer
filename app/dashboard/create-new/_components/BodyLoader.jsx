import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingBody = () => {
  return (
    <section className='p-5 space-y-8'>
      {/* Top Section with Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[1, 2, 3].map((item) => (
          <div key={item} className='bg-white p-4 rounded-lg shadow-sm animate-pulse'>
            <div className='h-4 w-24 bg-gray-200 rounded mb-2'></div>
            <div className='h-6 w-16 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className='bg-white p-4 rounded-lg shadow-sm animate-pulse'>
            {/* Image placeholder */}
            <div className='w-full h-48 bg-gray-200 rounded-lg mb-4'></div>
            
            {/* Content placeholders */}
            <div className='space-y-3'>
              <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
              <div className='h-4 w-1/2 bg-gray-200 rounded'></div>
              
              {/* Button placeholder */}
              <div className='flex justify-between items-center mt-4'>
                <div className='h-8 w-24 bg-gray-200 rounded'></div>
                <div className='h-8 w-8 bg-gray-200 rounded-full'></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator at bottom */}
      <div className='flex justify-center items-center gap-2 text-gray-500 pt-4'>
        <Loader2 className='w-5 h-5 animate-spin' />
        <span className='text-sm font-medium'>Loading content...</span>
      </div>
    </section>
  );
};

export default LoadingBody;