import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { getUserProfile, getAllTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';
import TransactionCard from '../components/dashboard/TransactionCard';
import SendFunds from '../components/SendFunds';
import DepositFunds from '../components/DepositFunds';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, transactionsRes] = await Promise.all([
          getUserProfile(),
          getAllTransactions()
        ]);
        
        setBalance(profileRes.data.data[0].balance);
        setTransactions(transactionsRes.data.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        setUserData(response.data);
        // Clear force update flag
        localStorage.removeItem('forceUpdate');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check if we need to force update
    const forceUpdate = localStorage.getItem('forceUpdate');
    if (forceUpdate === 'true') {
      fetchUserData();
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardBody>
            <Typography variant="h5" className="mb-2">Available Balance</Typography>
            <Typography variant="h3" className="font-bold">${balance?.toLocaleString()}</Typography>
          </CardBody>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardBody>
            <Typography variant="h5" className="mb-4">Quick Actions</Typography>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowSendModal(true)}
                className="p-4 text-center rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Send Money
              </button>
              <button
                onClick={() => setShowDepositModal(true)}
                className="p-4 text-center rounded-lg border border-green-500 text-green-600 hover:bg-green-50"
              >
                Deposit
              </button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Transactions Card */}
      <TransactionCard 
        transactions={transactions} 
        onViewAll={() => navigate('/transactions')} 
      />

      {/* Modals */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <SendFunds onClose={() => setShowSendModal(false)} />
          </div>
        </div>
      )}

      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <DepositFunds onClose={() => setShowDepositModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;