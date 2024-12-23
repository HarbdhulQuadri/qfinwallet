import React, { useState } from 'react';
import { transferMoney } from '../services/api';

const SendFunds = ({ onClose }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUserEmail = localStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Prevent self-transfer
    if (recipient === currentUserEmail) {
      setError("You cannot transfer money to yourself");
      return;
    }

    if (!recipient || !amount || amount <= 0) {
      setError('Please enter valid recipient and amount');
      return;
    }

    setLoading(true);
    try {
      const response = await transferMoney({
        user: recipient,
        amount: parseFloat(amount)
      });

      if (response.data.status === "success") {
        onClose();
        // Optionally show success message or refresh balance
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Send Funds</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Recipient Email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Funds'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default SendFunds;
