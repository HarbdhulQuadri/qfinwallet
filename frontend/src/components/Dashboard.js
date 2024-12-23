import React from 'react';

const Dashboard = () => {
  const userEmail = localStorage.getItem('email'); // Get email from localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome, <span className="font-bold">{userEmail}</span>!
      </p>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
