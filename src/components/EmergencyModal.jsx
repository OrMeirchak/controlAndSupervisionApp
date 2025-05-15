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
                <img src={getIconSrc(item.emergency_type)} alt="icon" />
                <div>
                  <div className="modal-item-type">{item.emergency_type}</div>
                  <div className="modal-item-summary">{item.summary}</div>
                  <div className="dispatched">
                    {(item.emergency_services || []).map(serviceName => {
                      const service = rescueServices.find(s => s.name === serviceName);
                      if (!service) return null;
                      const iconKey = service.name.toLowerCase();
                      const iconSrc = ICONS[iconKey];
                      return iconSrc ? (
                        <img
                          key={service.name}
                          src={iconSrc}
                          alt={service.name}
                          style={{ width: 24, height: 24, marginRight: 4 }}
                        />
                      ) : (
                        <div
                          key={service.name}
                          style={{ backgroundColor: service.color, width: 16, height: 16, borderRadius: '50%', display: 'inline-block', marginRight: 4 }}
                        />
                      );
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