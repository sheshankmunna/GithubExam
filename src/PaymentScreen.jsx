import React, { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [customerId, setCustomerId] = useState('');
  const [apiResult, setApiResult] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!amount || isNaN(amount) || Number(amount) <= 0) newErrors.amount = 'Enter a valid amount.';
    if (!currency) newErrors.currency = 'Currency is required.';
    if (!customerId) newErrors.customerId = 'Customer ID is required.';
    return newErrors;
  };

  const handlePayment = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, customerId })
      });
      const data = await res.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiResult('Payment error: ' + err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 400 }}>
        <h2 className="text-center mb-4">Payment</h2>
        <Input
          label="Amount"
          type="number"
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          error={errors.amount}
          className="form-control mb-3"
        />
        <Input
          label="Currency"
          type="text"
          id="currency"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          error={errors.currency}
          className="form-control mb-3"
        />
        <Input
          label="Customer ID"
          type="text"
          id="customerId"
          value={customerId}
          onChange={e => setCustomerId(e.target.value)}
          error={errors.customerId}
          className="form-control mb-3"
        />
        <Button type="button" className="btn btn-success w-100 mb-3" onClick={handlePayment}>
          Pay Now
        </Button>
        {apiResult && (
          <div className="api-result alert alert-secondary mt-2" role="alert">
            <strong>API Result:</strong>
            <pre className="mb-0">{apiResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;
