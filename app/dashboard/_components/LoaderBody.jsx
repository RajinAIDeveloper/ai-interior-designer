import React from 'react';

const EnhancedLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50/30 rounded-xl p-8">
      {/* Main loader container */}
      <div className="relative">
        {/* Decorative background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse"></div>
        </div>
        
        {/* Spinning rings */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full border-8 border-slate-200 border-t-slate-700 animate-spin"></div>
          
          {/* Middle ring */}
          <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-6 border-slate-200 border-t-slate-600 animate-spin" 
               style={{ animationDuration: '1.5s' }}></div>
          
          {/* Inner ring */}
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-slate-200 border-t-slate-500 animate-spin"
               style={{ animationDuration: '2s' }}></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 space-y-3">
        <h3 className="text-slate-700 text-lg font-semibold text-center">Loading your designs</h3>
        <div className="flex space-x-2 justify-center items-center">
          <div className="w-2 h-2 rounded-full bg-slate-700 animate-bounce" 
               style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" 
               style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" 
               style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;