import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';

const AssignmentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    baseId: '',
    assetTypeId: '',
    personnelId: '',
    quantity: '',
    assignmentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [bases, setBases] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
     
      const response = await assignmentsAPI.getOptions();
      setBases(response.data.bases);
      setAssetTypes(response.data.assetTypes);
      setPersonnel(response.data.personnel);
      console.log('📋 Loaded assignment options:', {
        bases: response.data.bases.length,
        assetTypes: response.data.assetTypes.length,
        personnel: response.data.personnel.length
      });
    } catch (error) {
      console.error('Error fetching assignment dropdown data:', error);
      
      setBases([]);
      setAssetTypes([]);
      setPersonnel([]);
      alert('Failed to load assignment options. Please try again.');
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
    
    if (!formData.baseId || !formData.assetTypeId || !formData.personnelId) {
      alert('Please select base, asset type, and personnel');
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
          <div className="loading">Loading assignment options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Assignment</h2>
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
                disabled={bases.length === 0}
              >
                <option value="">Select Base</option>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Personnel *</label>
              <select
                name="personnelId"
                value={formData.personnelId}
                onChange={handleChange}
                required
                disabled={personnel.length === 0}
              >
                <option value="">Select Personnel</option>
                {personnel.map(person => (
                  <option key={person._id} value={person._id}>
                    {person.username} ({person.email})
                  </option>
                ))}
              </select>
              {personnel.length === 0 && (
                <small style={{color: '#dc3545'}}>No personnel available</small>
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
            <label>Assignment Date *</label>
            <input
              type="date"
              name="assignmentDate"
              value={formData.assignmentDate}
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
              placeholder="Add any notes about this assignment..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!formData.baseId || !formData.assetTypeId || !formData.personnelId || bases.length === 0 || assetTypes.length === 0 || personnel.length === 0}
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;