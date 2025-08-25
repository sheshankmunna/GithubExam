import React from 'react';

const Input = ({ label, type, id, value, onChange, error, ...props }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className={error ? 'input-error' : ''}
      {...props}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

export default Input;
