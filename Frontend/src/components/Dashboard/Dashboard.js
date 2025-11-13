import React, { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../../services/api';
import MetricCard from './MetricCard';
import NetMovementModal from './NetMovementModal';
import Filters from '../Common/Filters';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    base: '',
    equipmentType: ''
  });
  const [showNetMovementModal, setShowNetMovementModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await dashboardAPI.getData(filters);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]); 

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); 

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const { summary = {}, recentActivities = {} } = dashboardData;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1> Asset Management Dashboard</h1>
        <p>Real-time overview of military assets and movements</p>
        
        {/* Activity Summary */}
        <div className="activity-summary">
          <div className="activity-item">
            <span className="activity-count">{recentActivities.purchases || 0}</span>
            <span className="activity-label">Purchases Today</span>
          </div>
          <div className="activity-item">
            <span className="activity-count">{recentActivities.assignments || 0}</span>
            <span className="activity-label">Assignments</span>
          </div>
          <div className="activity-item">
            <span className="activity-count">{recentActivities.transfers || 0}</span>
            <span className="activity-label">Transfers</span>
          </div>
        </div>
      </div>
      
      <Filters 
        filters={filters} 
        onChange={handleFilterChange} 
      />

      {error && (
        <div className="error-banner">
           {error}
          <button onClick={fetchDashboardData} className="btn-retry">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="metrics-grid">
            <MetricCard
              title="Opening Balance"
              value={summary.openingBalance}
              format="number"
              description="Starting inventory for the day"
            />
            <MetricCard
              title="Closing Balance"
              value={summary.closingBalance}
              format="number"
              description="Ending inventory for the day"
            />
            <MetricCard
              title="Net Movement"
              value={summary.netMovement}
              format="number"
              description="Purchases + Transfers In - Transfers Out"
              isClickable={true}
              onClick={() => setShowNetMovementModal(true)}
            />
            <MetricCard
              title="Assets Assigned"
              value={summary.assigned}
              format="number"
              description="Assets assigned to personnel"
            />
            <MetricCard
              title="Assets Expended"
              value={summary.expended}
              format="number"
              description="Assets used/lost/destroyed"
            />
            <MetricCard
              title="Total Purchases"
              value={summary.purchases}
              format="number"
              description="New assets purchased today"
            />
            <MetricCard
              title="Purchase Cost"
              value={summary.totalPurchaseCost}
              format="currency"
              description="Total spent on purchases"
            />
            <MetricCard
              title="Transfer In"
              value={summary.transfersIn}
              format="number"
              description="Assets received from other bases"
            />
            <MetricCard
              title="Transfer Out"
              value={summary.transfersOut}
              format="number"
              description="Assets sent to other bases"
            />
          </div>

          {showNetMovementModal && (
            <NetMovementModal
              data={summary}
              onClose={() => setShowNetMovementModal(false)}
            />
          )}

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={() => window.location.href = '/purchases'}
              >
                 New Purchase
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => window.location.href = '/transfers'}
              >
                 Initiate Transfer
              </button>
              <button 
                className="action-btn tertiary"
                onClick={() => window.location.href = '/assignments'}
              >
                 Assign Asset
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;