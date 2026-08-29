import React from 'react';

export default function StatsCard() {
  const stats = [
    {
      value: "15+",
      label: "Products shipped",
    },
    {
      value: "2+",
      label: "Years in business",
    },
    {
      value: "2",
      label: "Countries",
    },
  ];

  return (
    <div className="stats-card-container">
      <div className="stats-card">
        {stats.map((item, index) => (
          <div key={index} className="stat-item">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
