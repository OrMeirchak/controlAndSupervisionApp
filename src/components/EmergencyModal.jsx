import React from "react";
import "./EmergencyModal.css";
import { ICONS } from "../constants";

const EmergencyModal = ({ open, onClose, emergencyItems, getIconSrc, rescueServices = [], onActionClick }) => {
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
              <div key={item.id} className="emergency-modal-item" style={{ position: 'relative' }}>
                <button
                  className="emergency-action-btn"
                  style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: 3 }}
                  onClick={e => { e.stopPropagation(); onActionClick && onActionClick(item.location); }}
                  aria-label="Action"
                >
                  <img src={ICONS.goToLoaction} alt="action icon" style={{ width: 28, height: 28 }} />
                </button>
                <img src={getIconSrc(item.emergencyType)} alt="icon" />
                <div>
                  <div className="modal-item-type">{item.type}</div>
                  <div className="modal-item-summary">{item.summary}</div>
                  <div className="dispatched">
                    {(item.recuseServices || []).map(serviceName => {
                      const service = rescueServices.find(s => s.name === serviceName);
                      return service ? <div key={service.name} style={{ backgroundColor: service.color }} className="service-dot" /> : null;
                    })}
                  </div>
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