import React from 'react';

const FilterDropdown = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #d4e1db', outline: 'none' }}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default FilterDropdown;
