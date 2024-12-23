import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// User APIs
export const registerUser = (data) => API.post('/wallet/user/register', data);
export const verifyOTP = (data) => API.post('/wallet/user/verifyOTP', data);
export const resendOTP = (data) => API.post('/wallet/user/resendOTP', data);
export const loginUser = (data) => API.post('/wallet/user/login', data);
export const resetPassword = (data) => API.post('/wallet/user/resetPassword', data);
export const addNewPassword = (data) => API.post('/wallet/user/addNewPassword', data);
export const forgotPassword = (data) => API.post('/wallet/user/forgotPassword', data);
export const getUserProfile = () => API.get('/wallet/user/profile');

// Transaction APIs
export const transferMoney = (data) => API.post('/wallet/transaction/transfer', data);
export const depositMoney = (data) => API.post('/wallet/transaction/create-payment-intent', {
  amount: parseFloat(data.amount)
});
export const getAllTransactions = () => API.get('/wallet/transactions');
export const getOneTransaction = (transactionID) => API.get(`/wallet/transaction/${transactionID}`);
export const getTransactionByType = (type) => API.get(`/wallet/transactions/${type}`);
export const getTransactionByStatus = (status) => API.get(`/wallet/transactions/${status}`);
export const createCheckoutSession = async (data) => {
  const response = await API.post('/wallet/transaction/create-checkout', {
    amount: parseFloat(data.amount),
    success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/dashboard`
  });
  return response;
};
export const verifyPayment = async (sessionId) => {
  try {
    console.log('Verifying payment for session:', sessionId);
    const response = await API.get(`/wallet/transaction/verify-payment/${sessionId}`);
    console.log('Payment verification response:', response);
    return response;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};

export const getTransactionBySessionId = (sessionId) => 
  API.get(`/wallet/transaction/by-session/${sessionId}`);

// Backend test
export const testBackendConnection = () => API.get('/test-connection');
