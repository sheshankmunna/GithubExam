
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import PaymentScreen from './PaymentScreen';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div>
      <nav className="nav nav-tabs justify-content-center mt-3">
        <button
          className={`nav-link${activeTab === 'login' ? ' active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`nav-link${activeTab === 'payment' ? ' active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment
        </button>
      </nav>
      <div className="container-fluid">
        {activeTab === 'login' && <LoginScreen />}
        {activeTab === 'payment' && <PaymentScreen />}
      </div>
    </div>
  );
}

export default App;
