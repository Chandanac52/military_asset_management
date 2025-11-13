import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import AssignmentForm from './AssignmentForm';
import './Assignments.css';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, [filters]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await assignmentsAPI.getAll(filters);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      alert('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const response = await assignmentsAPI.create(assignmentData);
      setAssignments(prev => [response.data, ...prev]);
      setShowForm(false);
      alert('Assignment created successfully!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'returned') {
        updateData.returnDate = new Date().toISOString().split('T')[0];
      }
      
      const response = await assignmentsAPI.update(assignmentId, updateData);
      setAssignments(prev => prev.map(a => 
        a._id === assignmentId ? response.data : a
      ));
      alert('Assignment status updated!');
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="assignments">
      <div className="page-header">
        <h1>Asset Assignments</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Assignment
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
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {showForm && (
        <AssignmentForm
          onSubmit={handleCreateAssignment}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">Loading assignments...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Base</th>
                <th>Asset</th>
                <th>Personnel</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Return Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment._id}>
                  <td>{new Date(assignment.assignmentDate).toLocaleDateString()}</td>
                  <td>{assignment.baseId?.name}</td>
                  <td>{assignment.assetTypeId?.name}</td>
                  <td>{assignment.personnelId?.username}</td>
                  <td>{assignment.quantity}</td>
                  <td>
                    <span className={`status status-${assignment.status}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td>
                    {assignment.returnDate 
                      ? new Date(assignment.returnDate).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  <td>
                    {assignment.status === 'active' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateStatus(assignment._id, 'returned')}
                        >
                          Mark Returned
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleUpdateStatus(assignment._id, 'lost')}
                        >
                          Report Lost
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {assignments.length === 0 && (
            <div className="no-data">No assignments found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assignments;