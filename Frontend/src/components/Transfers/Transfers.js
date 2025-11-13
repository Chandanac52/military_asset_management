import React, { useState, useEffect, useCallback } from 'react';
import { transfersAPI } from '../../services/api';
import TransferForm from './TransferForm';
import './Transfers.css';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

 
  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transfersAPI.getAll(filters);
      setTransfers(response.data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      alert('Failed to fetch transfers');
    } finally {
      setLoading(false);
    }
  }, [filters]); 

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]); 

  const handleCreateTransfer = async (transferData) => {
    try {
      const response = await transfersAPI.create(transferData);
      setTransfers(prev => [response.data, ...prev]);
      setShowForm(false);
      alert('Transfer initiated successfully!');
    } catch (error) {
      console.error('Error creating transfer:', error);
      alert('Failed to create transfer: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateStatus = async (transferId, newStatus) => {
    try {
      const response = await transfersAPI.update(transferId, { status: newStatus });
      setTransfers(prev => prev.map(t => 
        t._id === transferId ? response.data : t
      ));
      alert('Transfer status updated!');
    } catch (error) {
      console.error('Error updating transfer:', error);
      alert('Failed to update transfer');
    }
  };

  return (
    <div className="transfers">
      <div className="page-header">
        <h1>Asset Transfers</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Transfer
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
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {showForm && (
        <TransferForm
          onSubmit={handleCreateTransfer}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">Loading transfers...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From Base</th>
                <th>To Base</th>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(transfer => (
                <tr key={transfer._id}>
                  <td>{new Date(transfer.transferDate).toLocaleDateString()}</td>
                  <td>{transfer.fromBaseId?.name}</td>
                  <td>{transfer.toBaseId?.name}</td>
                  <td>{transfer.assetTypeId?.name}</td>
                  <td>{transfer.quantity}</td>
                  <td>
                    <span className={`status status-${transfer.status}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td>
                    {transfer.status === 'pending' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateStatus(transfer._id, 'in_transit')}
                        >
                          Start Transit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleUpdateStatus(transfer._id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {transfer.status === 'in_transit' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleUpdateStatus(transfer._id, 'completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transfers.length === 0 && (
            <div className="no-data">No transfers found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transfers;