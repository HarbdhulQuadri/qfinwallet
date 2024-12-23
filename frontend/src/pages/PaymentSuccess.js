import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        console.log('Starting verification for session:', sessionId);
        const response = await verifyPayment(sessionId);
        console.log('Verification response:', response);

        if (response.data.status === 'success') {
          setLoading(false);
          localStorage.setItem('forceUpdate', 'true');
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          throw new Error(response.data.message || 'Verification failed');
        }
      } catch (err) {
        console.error('Verification error:', {
          message: err.message,
          response: err.response?.data
        });
        setError(err.response?.data?.message || 'Payment verification failed');
        setLoading(false);
      }
    };

    let timeoutId;
    const maxRetries = 3;
    let retryCount = 0;

    const attemptVerification = async () => {
      try {
        await verifySession();
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          timeoutId = setTimeout(attemptVerification, 2000); // Retry after 2 seconds
        } else {
          setError('Payment verification failed after multiple attempts');
          setLoading(false);
        }
      }
    };

    attemptVerification();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {loading ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Verifying Payment...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <p className="text-gray-500 text-sm">Redirecting to dashboard in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
