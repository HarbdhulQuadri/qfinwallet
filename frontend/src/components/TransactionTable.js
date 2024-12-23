import React, { useState } from 'react';
import moment from 'moment';
import NavigationHeader from './NavigationHeader';

const TransactionTable = ({ transactions: initialTransactions }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (key === 'createdAt') {
        return direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      if (key === 'amount') {
        return direction === 'asc'
          ? parseFloat(a[key]) - parseFloat(b[key])
          : parseFloat(b[key]) - parseFloat(a[key]);
      }
      return direction === 'asc'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setTransactions(sortedTransactions);
  };

  const handleFilter = (type) => {
    setFilter(type);
    if (type === 'all') {
      setTransactions(initialTransactions);
    } else {
      setTransactions(initialTransactions.filter(t => t.type === type));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit': return '↓';
      case 'transfer': return '→';
      case 'withdrawal': return '↑';
      default: return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationHeader title="Transaction History" />
      
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div className="space-x-2">
            <button
              onClick={() => handleFilter('all')}
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter('deposit')}
              className={`px-3 py-1 rounded ${filter === 'deposit' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Deposits
            </button>
            <button
              onClick={() => handleFilter('transfer')}
              className={`px-3 py-1 rounded ${filter === 'transfer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Transfers
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.transactionID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getTypeIcon(transaction.type)}</span>
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(transaction.createdAt).format('MMM D, YYYY h:mm A')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Transaction Details</h2>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono">{selectedTransaction.transactionID}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="capitalize">{selectedTransaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold">${parseFloat(selectedTransaction.amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`capitalize ${getStatusColor(selectedTransaction.status)}`}>
                  {selectedTransaction.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{moment(selectedTransaction.createdAt).format('MMMM D, YYYY h:mm:ss A')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{selectedTransaction.description}</p>
              </div>
              {selectedTransaction.type === 'transfer' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p>{selectedTransaction.senderID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p>{selectedTransaction.recipientID}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
