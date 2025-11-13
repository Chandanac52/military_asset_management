import React from 'react';
import './NetMovementModal.css';

const NetMovementModal = ({ data, onClose }) => {
  const movementDetails = [
    { label: 'Purchases', value: data.purchases || 0 },
    { label: 'Transfers In', value: data.transfersIn || 0 },
    { label: 'Transfers Out', value: data.transfersOut || 0 },
  ];

  const netMovement = (data.purchases || 0) + (data.transfersIn || 0) - (data.transfersOut || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Net Movement Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="movement-details">
          {movementDetails.map((item, index) => (
            <div key={index} className="movement-item">
              <span className="movement-label">{item.label}</span>
              <span className="movement-value">{item.value.toLocaleString()}</span>
            </div>
          ))}
          
          <div className="movement-divider"></div>
          
          <div className="movement-item total">
            <span className="movement-label">Net Movement</span>
            <span className="movement-value">{netMovement.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetMovementModal;