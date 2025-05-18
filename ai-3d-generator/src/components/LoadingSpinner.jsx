// src/components/LoadingSpinner.jsx
import React from 'react';

export const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);