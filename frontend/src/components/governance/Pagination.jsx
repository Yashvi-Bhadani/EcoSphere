import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d4e1db', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
        Previous
      </button>
      <span style={{ padding: '8px 12px', fontWeight: 600 }}>{page} / {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d4e1db', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
