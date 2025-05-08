import React from "react";
import "./EmergencyCard.css";
import { ICONS } from "../constants";

const EmergencyCard = ({ item, onClick, getIconSrc, rescueServices }) => (
  <div
    className={`emergency-item`}
  >
    <button
      className="emergency-action-btn"
      style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: 3 }}
      onClick={e => { e.stopPropagation(); onClick && onClick(e); }}
      aria-label="Action"
    >
      <img src={ICONS.goToLoaction} alt="action icon" style={{ width: 28, height: 28 }} />
    </button>
    <img src={getIconSrc(item.emergencyType)} alt="icon" />
    <div>{item.summary}</div>
    <div className="dispatched">
      {item.recuseServices.map(serviceName => {
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
);

export default EmergencyCard; 