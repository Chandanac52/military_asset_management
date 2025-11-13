import React from 'react';

const Filters = ({ filters, onChange }) => {
  const handleChange = (key, value) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={filters.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="base">Base</label>
        <select
          id="base"
          value={filters.base}
          onChange={(e) => handleChange('base', e.target.value)}
        >
          <option value="">All Bases</option>
          <option value="1">HQ-CMD</option>
          <option value="2">NFB</option>
          <option value="3">SCB</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="equipmentType">Equipment Type</label>
        <select
          id="equipmentType"
          value={filters.equipmentType}
          onChange={(e) => handleChange('equipmentType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="weapon">Weapons</option>
          <option value="vehicle">Vehicles</option>
          <option value="ammunition">Ammunition</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;