import React from 'react';


const DateRangePicker = ({ value = {}, onChange }) => {
  const handleStart = (e) => onChange({ ...value, startDate: e.target.value });
  const handleEnd = (e) => onChange({ ...value, endDate: e.target.value });

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input type="date" value={value.startDate || ''} onChange={handleStart} />
      <span style={{ color: '#6b7280' }}>to</span>
      <input type="date" value={value.endDate || ''} onChange={handleEnd} />
    </div>
  );
};

export default DateRangePicker;
