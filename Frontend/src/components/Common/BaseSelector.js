import React, { useEffect, useState } from 'react';
import { purchasesAPI } from '../../services/api';


const BaseSelector = ({ name = 'baseId', value, onChange, options }) => {
  const [bases, setBases] = useState([]);

  useEffect(() => {
    if (options && options.length) {
      setBases(options);
      return;
    }
    const fetch = async () => {
      try {
        const resp = await purchasesAPI.getOptions();
        if (resp?.data?.bases) setBases(resp.data.bases);
      } catch (err) {
        console.warn('BaseSelector: getOptions failed', err);
        
        setBases([
          { _id: '1', name: 'Headquarters Command', code: 'HQ-CMD' },
          { _id: '2', name: 'Northern Frontier Base', code: 'NFB' }
        ]);
      }
    };
    fetch();
  }, [options]);

  return (
    <select name={name} value={value} onChange={onChange}>
      <option value="">All / Select Base</option>
      {bases.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name} {b.code ? `(${b.code})` : ''}
        </option>
      ))}
    </select>
  );
};

export default BaseSelector;
