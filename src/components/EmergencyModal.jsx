import React from "react";
import "./EmergencyModal.css";

const EmergencyModal = ({ open, onClose, emergencyItems, getIconSrc }) => {
  if (!open) return null;
  return (
    <div className="emergency-modal-overlay" onClick={onClose}>
      <div className="emergency-modal" onClick={e => e.stopPropagation()}>
        <div className="emergency-modal-header">
          <span>All Emergencies</span>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="emergency-modal-list">
          {emergencyItems.length === 0 ? (
            <div className="empty-list">No emergencies</div>
          ) : (
            emergencyItems.map(item => (
              <div key={item.id} className="emergency-modal-item">
                <img src={getIconSrc(item.emergencyType)} alt="icon" />
                <div>
                  <div className="modal-item-type">{item.type}</div>
                  <div className="modal-item-summary">{item.summary}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal; 