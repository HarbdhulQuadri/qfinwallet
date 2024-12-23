import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../services/api';
import TransactionTable from './TransactionTable';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getAllTransactions();
        setTransactions(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : (
        <p className="text-center text-gray-500">No transactions found</p>
      )}
    </div>
  );
};

export default Transactions;
