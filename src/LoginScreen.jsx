import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiResult, setApiResult] = useState('');
  // API request functions
  const API_URL = 'http://localhost:3001/api/login';

  const handleGet = async () => {
    try {
      const res = await fetch(API_URL);
      let message = '';
      if (res.status === 200) {
        const data = await res.json();
        message = 'Success: ' + JSON.stringify(data);
      } else if (res.status === 400) {
        message = 'Validation error: Please check your input.';
      } else if (res.status === 401 || res.status === 403) {
        message = 'Unauthorized: You do not have permission.';
      } else if (res.status === 404) {
        message = 'Not found: Login details not found.';
      } else if (res.status === 500) {
        message = 'Server error: Please try again later.';
      } else {
        message = 'Unexpected error: ' + res.status;
      }
      setApiResult(message);
    } catch (err) {
      setApiResult('GET error: ' + err.message);
    }
  };

  const handlePost = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      let message = '';
      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        message = 'Login created successfully.';
      } else if (res.status === 400) {
        message = 'Validation error: Please check your input.';
      } else if (res.status === 401 || res.status === 403) {
        message = 'Unauthorized: You do not have permission.';
      } else if (res.status === 404) {
        message = 'Not found: Endpoint not found.';
      } else if (res.status === 500) {
        message = 'Server error: Please try again later.';
      } else {
        message = 'Unexpected error: ' + res.status;
      }
      setApiResult(message);
    } catch (err) {
      setApiResult('POST error: ' + err.message);
    }
  };

  const handlePut = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      let message = '';
      if (res.status === 200) {
        const data = await res.json();
        message = 'Login updated successfully.';
      } else if (res.status === 400) {
        message = 'Validation error: Please check your input.';
      } else if (res.status === 401 || res.status === 403) {
        message = 'Unauthorized: You do not have permission.';
      } else if (res.status === 404) {
        message = 'Not found: Login details not found.';
      } else if (res.status === 500) {
        message = 'Server error: Please try again later.';
      } else {
        message = 'Unexpected error: ' + res.status;
      }
      setApiResult(message);
    } catch (err) {
      setApiResult('PUT error: ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      let message = '';
      if (res.status === 200) {
        message = 'Login deleted successfully.';
      } else if (res.status === 400) {
        message = 'Validation error: Please check your input.';
      } else if (res.status === 401 || res.status === 403) {
        message = 'Unauthorized: You do not have permission.';
      } else if (res.status === 404) {
        message = 'Not found: Login details not found.';
      } else if (res.status === 500) {
        message = 'Server error: Please try again later.';
      } else {
        message = 'Unexpected error: ' + res.status;
      }
      setApiResult(message);
    } catch (err) {
      setApiResult('DELETE error: ' + err.message);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with login logic
      alert('Login successful!');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 400 }}>
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-center mb-4">Login</h2>
          <Input
            label="Username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            className="form-control mb-3"
          />
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            className="form-control mb-3"
          />
          <Button type="submit" className="btn btn-primary w-100 mb-3">Login</Button>
        </form>
        <div className="crud-buttons d-flex justify-content-between mb-3">
          <Button type="button" className="btn btn-outline-info" onClick={handleGet}>GET</Button>
          <Button type="button" className="btn btn-outline-success" onClick={handlePost}>POST</Button>
          <Button type="button" className="btn btn-outline-warning" onClick={handlePut}>PUT</Button>
          <Button type="button" className="btn btn-outline-danger" onClick={handleDelete}>DELETE</Button>
        </div>
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

export default LoginScreen;
