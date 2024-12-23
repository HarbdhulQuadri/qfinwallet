import React, { useState } from 'react';
import { resendOtp } from '../services/api';

const ResendOtpPage = () => {
  const [user, setUser] = useState(''); // Email address of the user
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('Resend OTP attempt for:', user);
      const response = await resendOtp({ user });

      console.log('Resend OTP response:', response);
      if (response?.data?.status === 'success') {
        setSuccessMessage('OTP resent successfully!');
      } else {
        throw new Error(response?.data?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP Error:', err);

      const errorMessage =
        err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Resend OTP</h2>

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

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            onClick={handleResend}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendOtpPage;
