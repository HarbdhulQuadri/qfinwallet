import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="text-blue-600 hover:text-blue-800"
      >
        Dashboard
      </button>
    </div>
  );
};

export default NavigationHeader;
