import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, format = 'number', isClickable = false, onClick }) => {
  const formatValue = (val) => {
    if (val === undefined || val === null) return '-';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val?.toLocaleString() || '0';
    }
  };

  return (
    <div 
      className={`metric-card ${isClickable ? 'clickable' : ''}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="metric-title">{title}</div>
      <div className="metric-value">{formatValue(value)}</div>
    </div>
  );
};

export default MetricCard;