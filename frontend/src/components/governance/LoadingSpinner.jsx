import React from 'react';

const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px' }}>
    <div style={{ width: '36px', height: '36px', border: '3px solid #dce8e2', borderTopColor: '#2e7d5b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <span style={{ color: '#56706b', fontWeight: 600 }}>{label}</span>
  </div>
);

export default LoadingSpinner;
