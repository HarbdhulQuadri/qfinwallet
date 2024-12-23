import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to QFin Wallet</h1>
        <p className="text-lg text-gray-700 mb-8">
          Manage your digital wallet and transactions securely and effortlessly.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
