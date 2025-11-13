import React, { useState, useEffect } from 'react';
import { purchasesAPI } from '../../services/api';

const PurchaseForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    baseId: '',
    assetTypeId: '',
    quantity: '',
    unitCost: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    supplier: '',
    purchaseOrder: '',
    status: 'received'
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
      const response = await purchasesAPI.getOptions();
      setBases(response.data.bases);
      setAssetTypes(response.data.assetTypes);
    } catch (error) {
      console.error('Error fetching purchase options:', error);
      alert('Failed to load purchase options. Please try again.');
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
    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity),
      unitCost: parseFloat(formData.unitCost)
    });
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">Loading options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Record New Purchase</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Base *</label>
              <select
                name="baseId"
                value={formData.baseId}
                onChange={handleChange}
                required
              >
                <option value="">Select Base</option>
                {bases.map(base => (
                  <option key={base._id} value={base._id}>
                    {base.name} ({base.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Asset Type *</label>
              <select
                name="assetTypeId"
                value={formData.assetTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map(asset => (
                  <option key={asset._id} value={asset._id}>
                    {asset.name} ({asset.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
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
            
            <div className="form-group">
              <label>Unit Cost (₹) *</label>
              <input
                type="number"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Purchase Date *</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Supplier *</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              placeholder="Enter supplier name"
            />
          </div>

          <div className="form-group">
            <label>Purchase Order (Optional)</label>
            <input
              type="text"
              name="purchaseOrder"
              value={formData.purchaseOrder}
              onChange={handleChange}
              placeholder="Enter purchase order number"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;