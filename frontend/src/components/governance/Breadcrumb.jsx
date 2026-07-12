import React from 'react';

const Breadcrumb = ({ items }) => (
  <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', color: '#56706b' }}>
    {items.map((item, index) => (
      <React.Fragment key={item.label}>
        {index > 0 ? <span>/</span> : null}
        <span style={{ fontWeight: index === items.length - 1 ? 700 : 500 }}>{item.label}</span>
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumb;
