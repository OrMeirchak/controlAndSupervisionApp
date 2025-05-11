import React, { useState, useRef, useEffect } from "react";
import "./EmergencyCard.css";
import { ICONS } from "../constants";

const EmergencyCard = ({ item, onClick, getIconSrc, rescueServices }) => {
  const [showMessages, setShowMessages] = useState(false);
  const messagesDropdownRef = useRef(null);
  // Placeholder messages for demonstration
  const messages = item.messages && Array.isArray(item.messages) && item.messages.length > 0 && item.messages
  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };
  useEffect(() => {
    if (!showMessages) return;
    function handleClickOutside(event) {
      if (messagesDropdownRef.current && !messagesDropdownRef.current.contains(event.target)) {
        setShowMessages(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessages]);
  return (
    <div
      className={`emergency-item`}
      style={{
        border: '3px solid',
        borderColor:
          item.urgency === 'very high' ? '#e53935' :
            item.urgency === 'high' ? '#ffb300' :
              item.urgency === 'low' ? '#43a047' : '#ccc',
        borderRadius: 12,
        position: 'relative',
      }}
    >
      {/* Priority label */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          background:
            item.urgency === 'very high' ? '#e53935' :
              item.urgency === 'high' ? '#ffb300' :
                item.urgency === 'low' ? '#43a047' : '#ccc',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.95em',
          padding: '2px 10px',
          borderRadius: 8,
          zIndex: 4,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        {item.urgency ? item.urgency : 'No urgency'}
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8, zIndex: 3 }}>
        <button
          className="emergency-action-btn"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={e => { e.stopPropagation(); onClick && onClick(e); }}
          aria-label="Go to location"
        >
          <img src={ICONS.goToLoaction} alt="action icon" style={{ width: 28, height: 28 }} />
        </button>
        <button
          className="emergency-action-btn"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={e => { e.stopPropagation(); setShowMessages(v => !v); }}
          aria-label="Show messages"
        >
          {/* Placeholder SVG for message icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
      <img src={getIconSrc(item.emergencyType)} alt="icon" />
      <div>{item.summary}</div>
      {showMessages && (
        <div className="emergency-messages-dropdown" ref={messagesDropdownRef}>
          <div className="emergency-messages-list">
            {messages.length === 0 ? (
              <div className="emergency-message-empty">No messages.</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg.id || idx} className="emergency-message-item">
                  <div style={{ fontWeight: 600, fontSize: '0.97em', color: '#1976d2' }}>{msg.user || 'Unknown'}</div>
                  <div style={{ fontSize: '0.85em', color: '#888' }}>{formatTime(msg.timestamp)}</div>
                  <div style={{ marginTop: 2 }}>{msg.message || msg.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
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
};

export default EmergencyCard; 