import React from "react";
import EmergencyCard from "./EmergencyCard";
import "./EmergencySidebar.css";

const EmergencySidebar = ({ items, onCardClick, getIconSrc, rescueServices, sendWhatsappFromClient, onMinimize }) => {
  return (
    <div className={`sidebar emergency-bar${items.length === 0 ? ' empty' : ''}`}>
      {items.map(item => (
        <EmergencyCard
          key={item.id}
          item={item}
          onClick={() => onCardClick(item.location)}
          getIconSrc={getIconSrc}
          rescueServices={rescueServices}
          sendWhatsappFromClient={sendWhatsappFromClient}
          onMinimize={onMinimize}
        />
      ))}
    </div>
  );
};

export default EmergencySidebar; 