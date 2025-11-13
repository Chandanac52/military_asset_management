import React, { useEffect, useState } from 'react';
import { purchasesAPI } from '../../services/api';


const EquipmentTypeSelector = ({ name = 'assetTypeId', value, onChange, options }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (options && options.length) {
      setTypes(options);
      return;
    }
    const fetch = async () => {
      try {
        const resp = await purchasesAPI.getOptions();
        if (resp?.data?.assetTypes) setTypes(resp.data.assetTypes);
      } catch (err) {
        console.warn('EquipmentTypeSelector: getOptions failed', err);
        setTypes([
          { _id: '1', name: 'Assault Rifle M4A1', category: 'weapon' },
          { _id: '3', name: 'Armored Humvee', category: 'vehicle' }
        ]);
      }
    };
    fetch();
  }, [options]);

  return (
    <select name={name} value={value} onChange={onChange}>
      <option value="">All / Select Type</option>
      {types.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name} {t.category ? `(${t.category})` : ''}
        </option>
      ))}
    </select>
  );
};

export default EquipmentTypeSelector;
