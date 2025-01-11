import React from 'react';

export const LoadingOverlay = ({ message = "Redesigning your Room ... Do not Refresh" }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Loading spinner */}
            <div className="flex space-x-2">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{
                    animation: 'bounce 1s infinite',
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;