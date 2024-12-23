import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTP } from '../services/api';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(''); // Email address of the user
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('OTP verification attempt with:', { user, otp });
      const response = await verifyOTP({ user, otp });

      console.log('OTP verification response:', response);
      if (response?.data?.status === 'success') {
        setSuccessMessage('OTP verified successfully!');
        setLoading(false);

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login'); // Make sure this route exists
        }, 2000);
      } else {
        throw new Error(response?.data?.message || 'OTP verification failed');
      }
    } catch (err) {
      setLoading(false);
      console.error('OTP Verification Error:', err);

      const errorMessage =
        err.response?.data?.message ||
        'Failed to verify OTP. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Verify OTP</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
