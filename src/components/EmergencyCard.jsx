import React from "react";
import "./EmergencyCard.css";
import { ICONS } from "../constants";

const EmergencyCard = ({ item, onClick, getIconSrc, rescueServices }) => (
  <div
    className={`emergency-item`}
    onClick={onClick}
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
        return service ? <div key={service.name} style={{ backgroundColor: service.color }} className="service-dot" /> : null;
      })}
    </div>
  </div>
);

export default EmergencyCard; 