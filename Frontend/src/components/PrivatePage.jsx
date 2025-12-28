import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrivatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Private Page
        </h1>
        <p className="text-gray-600 mb-6">
          This page is not available in the public version.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-semibold"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default PrivatePage;