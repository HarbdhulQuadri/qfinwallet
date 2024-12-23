import React, { useState } from 'react';
import { testBackendConnection } from '../services/api';

const TestPage = () => {
  const [status, setStatus] = useState('');

  const handleTestConnection = async () => {
    try {
      const response = await testBackendConnection();
      setStatus('Connected to backend');
    } catch (error) {
      setStatus('Failed to connect to backend');
    }
  };

  return (
    <div>
      <h1>Test Backend Connection</h1>
      <button onClick={handleTestConnection}>Check Connection</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default TestPage;
