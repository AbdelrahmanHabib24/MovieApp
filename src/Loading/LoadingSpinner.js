
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900 bg-opacity-70 z-50"
      role="status"
      aria-label="Loading content"
    >
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-blue-300 opacity-50"></div>
      </div>
      <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
      <span className="sr-only">Please wait while content is loading</span>
    </div>
  );
};

export default LoadingSpinner;