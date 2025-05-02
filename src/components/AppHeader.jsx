import React from "react";
import "./AppHeader.css";
import { ICONS } from "../constants";

const AppHeader = ({ onAllEmergency, title = "ResQ-AI", showButton = true }) => (
  <header className="app-header">
    <div className="logo-placeholder"><img src={ICONS.app} alt="logo" /></div>
    <h1 className="app-title">{title}</h1>
    {showButton && (
      <button className="all-emergency-btn" onClick={onAllEmergency}>
        All Emergency
      </button>
    )}
  </header>
);

export default AppHeader; 