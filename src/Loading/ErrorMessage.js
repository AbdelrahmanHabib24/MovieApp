import React from 'react';

const ErrorMessage = ({ message = 'Something went wrong. Please try again later.', onRetry }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center bg-neutral-900 bg-opacity-70 z-50 p-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-red-900 bg-opacity-90 rounded-xl p-8 max-w-lg w-full text-center shadow-2xl">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-100 text-xl font-semibold mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
            aria-label="Retry loading content"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;