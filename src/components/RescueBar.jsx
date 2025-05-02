import React from "react";
import "./RescueBar.css";

const RescueBar = ({ rescueServices }) => (
  <div className="overlay rescue-bar">
    {rescueServices.map(service => (
      <div key={service.name} className="rescue-service" style={{ backgroundColor: service.color }}>
        {service.name}
      </div>
    ))}
  </div>
);

export default RescueBar; 