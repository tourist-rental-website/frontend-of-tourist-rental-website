import React from 'react';

export const Toast = ({ message }) => {
  return <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>{message}</div>;
};

export default Toast;
