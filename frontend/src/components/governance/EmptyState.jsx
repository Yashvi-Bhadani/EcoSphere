import React from 'react';

const EmptyState = ({ title, description }) => (
  <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fbfa', border: '1px dashed #c9d8d1', textAlign: 'center', color: '#45625a' }}>
    <h3 style={{ marginBottom: '8px' }}>{title}</h3>
    <p>{description}</p>
  </div>
);

export default EmptyState;
