import React from 'react';

const ErrorState = ({ message, onRetry }) => (
  <div style={{ padding: '24px', borderRadius: '16px', background: '#fff5f5', border: '1px solid #f4c7c7', color: '#8c2e2e' }}>
    <h3 style={{ marginBottom: '8px' }}>Unable to load policies</h3>
    <p style={{ marginBottom: '12px' }}>{message}</p>
    {onRetry ? <button onClick={onRetry} style={{ border: 'none', background: '#d94844', color: 'white', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>Try again</button> : null}
  </div>
);

export default ErrorState;
