import React, { useState, useRef, useEffect } from "react";
import "./EmergencyCard.css";
import { ICONS } from "../constants";

const EmergencyCard = ({ item, onClick, getIconSrc, rescueServices, sendWhatsappFromClient, onMinimize }) => {
  const [showMessages, setShowMessages] = useState(false);
  const messagesDropdownRef = useRef(null);
  const messages = item.messages && Array.isArray(item.messages) && item.messages.length > 0 && item.messages;
  
  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove @c.us suffix if exists
    phone = phone.replace('@c.us', '');
    // Replace 972 prefix with 0
    if (phone.startsWith('972')) {
      phone = '0' + phone.substring(3);
    }
    return phone;
  };

  const [chatOpenIdx, setChatOpenIdx] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    if (!showMessages) return;
    function handleClickOutside(event) {
      if (messagesDropdownRef.current && !messagesDropdownRef.current.contains(event.target)) {
        setShowMessages(false);
        setChatOpenIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessages]);

  return (
    <div
      className={`emergency-item${showMessages ? ' messages-open' : ''}`}
      style={{
        border: '3px solid',
        borderColor:
          item.severity === 'very high' ? '#e53935' :
            item.severity === 'high' ? '#ffb300' :
              item.severity === 'low' ? '#43a047' : '#ccc',
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
            item.severity === 'very high' ? '#e53935' :
              item.severity === 'high' ? '#ffb300' :
                item.severity === 'low' ? '#43a047' : '#ccc',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.95em',
          padding: '2px 10px',
          borderRadius: 8,
          zIndex: 4,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        {item.severity ? item.severity : 'No urgency'}
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
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative" }}
          onClick={e => { e.stopPropagation(); setShowMessages(v => !v); }}
          aria-label="Show messages"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          {messages && messages.length > 0 && (
            <div style={{
              position: 'absolute',
              top: -8,
              right: -8,
              background: '#ffffff',
              color: '#000000',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              border: '2px solid rgba(0,0,0,0.75)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {messages.length}
            </div>
          )}
        </button>
        <button
          className="emergency-action-btn"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={e => { e.stopPropagation(); onMinimize && onMinimize(item); }}
          aria-label="Minimize"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <img src={getIconSrc(item.emergencyType)} alt="icon" />
      <div>{item.summary}</div>
      {showMessages && (
        <div className="emergency-messages-popup-overlay">
          <div className="emergency-messages-popup" ref={messagesDropdownRef}>
            <button
              className="emergency-messages-popup-close"
              onClick={() => { setShowMessages(false); setChatOpenIdx(null); }}
            >
              ✕
            </button>
            <div className="emergency-messages-list">
              {messages.length === 0 ? (
                <div className="emergency-message-empty">No messages.</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg.id || idx} className="emergency-message-item">
                    <div style={{ fontWeight: 600, fontSize: '0.97em', color: '#1976d2' }}>
                      {formatPhoneNumber(msg.user) || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#888' }}>{formatTime(msg.timestamp)}</div>
                    <div style={{ marginTop: 2 }}>
                      {((msg.message || msg.text || '').toLowerCase().includes('latitude') && (msg.message || msg.text || '').toLowerCase().includes('longitude'))
                        ? 'התקבל מיקום'
                        : (msg.message || msg.text)}
                    </div>
                    <button
                      style={{ marginTop: 6, fontSize: '0.9em', padding: '2px 8px', borderRadius: 6, border: '1px solid #1976d2', background: '#fff', color: '#1976d2', cursor: 'pointer' }}
                      onClick={() => {
                        setChatOpenIdx(idx);
                        setChatMessage("");
                        setSendError(null);
                      }}
                    >
                      שלח הודעה
                    </button>
                    {chatOpenIdx === idx && (
                      <div style={{ marginTop: 8, background: '#f5f5f5', padding: 8, borderRadius: 8 }}>
                        <textarea
                          style={{ width: '100%', minHeight: 40, borderRadius: 4, border: '1px solid #ccc', padding: 4 }}
                          value={chatMessage}
                          onChange={e => setChatMessage(e.target.value)}
                          placeholder="הקלד הודעה..."
                          disabled={sending}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <button
                            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                            disabled={sending || !chatMessage.trim()}
                            onClick={async () => {
                              setSending(true);
                              setSendError(null);
                              try {
                                const phoneNumber = msg.user || item.user || '';
                                if (!phoneNumber) throw new Error('לא נמצא מספר טלפון');
                                await sendWhatsappFromClient(phoneNumber, chatMessage);
                                setChatMessage("");
                                setChatOpenIdx(null);
                              } catch (err) {
                                setSendError(err.message || 'שגיאה בשליחת הודעה');
                              } finally {
                                setSending(false);
                              }
                            }}
                          >
                            שלח
                          </button>
                          <button
                            style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                            onClick={() => setChatOpenIdx(null)}
                            disabled={sending}
                          >
                            ביטול
                          </button>
                        </div>
                        {sendError && <div style={{ color: 'red', marginTop: 4 }}>{sendError}</div>}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <div className="dispatched">
        {item.emergency_services.map(serviceName => {
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