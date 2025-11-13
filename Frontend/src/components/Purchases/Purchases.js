import React, { useState, useEffect, useCallback } from 'react';
import { purchasesAPI } from '../../services/api';
import PurchaseForm from './PurchaseForm';
import './Purchases.css';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    baseId: '',
    assetTypeId: ''
  });

  
  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await purchasesAPI.getAll(filters);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      alert('Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }, [filters]); 

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]); 

  const handleCreatePurchase = async (purchaseData) => {
    try {
      const response = await purchasesAPI.create(purchaseData);
      setPurchases(prev => [response.data, ...prev]);
      setShowForm(false);
      alert('Purchase recorded successfully!');
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('Failed to create purchase: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="purchases">
      <div className="page-header">
        <h1>Purchase Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Purchase
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <label>Base</label>
          <select
            value={filters.baseId}
            onChange={(e) => setFilters({...filters, baseId: e.target.value})}
          >
            <option value="">All Bases</option>
            <option value="1">HQ-CMD</option>
            <option value="2">NFB</option>
            <option value="3">SCB</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Asset Type</label>
          <select
            value={filters.assetTypeId}
            onChange={(e) => setFilters({...filters, assetTypeId: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="weapon">Weapons</option>
            <option value="vehicle">Vehicles</option>
            <option value="ammunition">Ammunition</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>
      </div>

      {showForm && (
        <PurchaseForm
          onSubmit={handleCreatePurchase}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">Loading purchases...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Base</th>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase._id}>
                  <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                  <td>{purchase.baseId?.name}</td>
                  <td>{purchase.assetTypeId?.name}</td>
                  <td>{purchase.quantity}</td>
                  <td>₹{purchase.unitCost?.toLocaleString()}</td>
                  <td>₹{purchase.totalCost?.toLocaleString()}</td>
                  <td>{purchase.supplier}</td>
                  <td>
                    <span className={`status status-${purchase.status}`}>
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {purchases.length === 0 && (
            <div className="no-data">No purchases found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Purchases;