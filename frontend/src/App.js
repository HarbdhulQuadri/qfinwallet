import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js'; // Changed import
import { loadStripe } from '@stripe/stripe-js';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Ensure LoginPage is imported
import VerifyOtpPage from './pages/VerifyOtpPage';

import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/DashboardPage';
import TestPage from './pages/TestPage'; // Ensure TestPage is imported
import Transactions from './components/Transactions';
import SendFunds from './components/SendFunds';
import DepositFunds from './components/DepositFunds';
import PaymentSuccess from './pages/PaymentSuccess';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Ensure LoginPage route is defined */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/send-funds" element={<SendFunds />} />
          <Route path="/deposit-funds" element={<DepositFunds />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/test" element={<TestPage />} /> Ensure TestPage route is defined
          <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect "/" to Home */}
          <Route path="*" element={<NotFoundPage />} /> {/* Handle unknown routes */}
        </Routes>
      </Router>
    </Elements>
  );
}

export default App;
