import React, { useState, useEffect } from 'react';
import { transfersAPI } from '../../services/api';

const TransferForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fromBaseId: '',
    toBaseId: '',
    assetTypeId: '',
    quantity: '',
    transferDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [bases, setBases] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      
      const response = await transfersAPI.getOptions();
      setBases(response.data.bases);
      setAssetTypes(response.data.assetTypes);
      console.log('📋 Loaded transfer options:', {
        bases: response.data.bases.length,
        assetTypes: response.data.assetTypes.length
      });
    } catch (error) {
      console.error('Error fetching transfer dropdown data:', error);
      
      setBases([]);
      setAssetTypes([]);
      alert('Failed to load transfer options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fromBaseId || !formData.toBaseId || !formData.assetTypeId) {
      alert('Please select both bases and asset type');
      return;
    }

    if (formData.fromBaseId === formData.toBaseId) {
      alert('From base and To base cannot be the same');
      return;
    }

    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity)
    });
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">Loading transfer options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Initiate Transfer</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>From Base *</label>
              <select
                name="fromBaseId"
                value={formData.fromBaseId}
                onChange={handleChange}
                required
                disabled={bases.length === 0}
              >
                <option value="">Select Source Base</option>
                {bases.map(base => (
                  <option key={base._id} value={base._id}>
                    {base.name} ({base.code})
                  </option>
                ))}
              </select>
              {bases.length === 0 && (
                <small style={{color: '#dc3545'}}>No bases available</small>
              )}
            </div>
            
            <div className="form-group">
              <label>To Base *</label>
              <select
                name="toBaseId"
                value={formData.toBaseId}
                onChange={handleChange}
                required
                disabled={bases.length === 0}
              >
                <option value="">Select Destination Base</option>
                {bases.map(base => (
                  <option key={base._id} value={base._id}>
                    {base.name} ({base.code})
                  </option>
                ))}
              </select>
              {bases.length === 0 && (
                <small style={{color: '#dc3545'}}>No bases available</small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Asset Type *</label>
              <select
                name="assetTypeId"
                value={formData.assetTypeId}
                onChange={handleChange}
                required
                disabled={assetTypes.length === 0}
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map(asset => (
                  <option key={asset._id} value={asset._id}>
                    {asset.name} ({asset.category})
                  </option>
                ))}
              </select>
              {assetTypes.length === 0 && (
                <small style={{color: '#dc3545'}}>No asset types available</small>
              )}
            </div>
            
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Transfer Date *</label>
            <input
              type="date"
              name="transferDate"
              value={formData.transferDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add any notes about this transfer..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!formData.fromBaseId || !formData.toBaseId || !formData.assetTypeId || bases.length === 0 || assetTypes.length === 0}
            >
              Initiate Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;