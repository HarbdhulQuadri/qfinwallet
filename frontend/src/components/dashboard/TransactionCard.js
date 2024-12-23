import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const TransactionCard = ({ transactions, onViewAll }) => {
  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5">Recent Transactions</Typography>
          <button 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View All
          </button>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'credit' ? <FiArrowDown /> : <FiArrowUp />}
                </div>
                <div>
                  <Typography className="font-medium">{transaction.description}</Typography>
                  <Typography className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
              <Typography className={`font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
              </Typography>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default TransactionCard;
