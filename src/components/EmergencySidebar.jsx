import React from "react";
import EmergencyCard from "./EmergencyCard";
import "./EmergencySidebar.css";

const EmergencySidebar = ({ items, onCardClick, getIconSrc, rescueServices, sendWhatsappFromClient }) => (
  <div className="sidebar emergency-bar">
    {items.map(item => (
      <EmergencyCard
        key={item.id}
        item={item}
        onClick={() => onCardClick(item.location)}
        getIconSrc={getIconSrc}
        rescueServices={rescueServices}
        sendWhatsappFromClient={sendWhatsappFromClient}
      />
    ))}
  </div>
);

export default EmergencySidebar; 