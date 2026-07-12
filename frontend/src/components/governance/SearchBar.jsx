import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search policies' }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #d4e1db', outline: 'none' }}
  />
);

export default SearchBar;
