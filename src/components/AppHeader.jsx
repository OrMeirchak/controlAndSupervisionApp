import React, { useState } from "react";
import "./AppHeader.css";
import { ICONS } from "../constants";

const AppHeader = ({ onAllEmergency, onClearAll, title = "ResQ-AI", showButton = true }) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClearAll = () => {
    if (password === '1234') {
      setShowPasswordDialog(false);
      setPassword('');
      setError('');
      onClearAll();
    } else {
      setError('סיסמה שגויה');
    }
  };

  return (
    <header className="app-header">
      <div className="logo-placeholder"><img src={ICONS.app} alt="logo" /></div>
      <h1 className="app-title">{title}</h1>
      {showButton && (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="all-emergency-btn" onClick={onAllEmergency}>
            All Emergency
          </button>
          <button 
            className="clear-all-btn" 
            onClick={() => setShowPasswordDialog(true)}
            style={{
              padding: '10px 22px',
              background: 'linear-gradient(90deg, #d32f2f 0%, #ef5350 100%)',
              color: '#fff',
              fontSize: '1.08rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px 0 rgba(211, 47, 47, 0.10)',
              cursor: 'pointer',
              transition: 'all 0.18s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #c62828 0%, #e53935 100%)';
              e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(211, 47, 47, 0.16)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #d32f2f 0%, #ef5350 100%)';
              e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(211, 47, 47, 0.10)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            נקה הכל
          </button>
        </div>
      )}

      {showPasswordDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <h3 style={{ margin: 0, color: '#d32f2f', textAlign: 'center' }}>אישור מחיקת כל ההודעות</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="הכנס סיסמה"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                textAlign: 'center',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleClearAll();
                }
              }}
            />
            {error && (
              <div style={{ color: '#d32f2f', textAlign: 'center', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleClearAll}
                style={{
                  padding: '8px 16px',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                אישור
              </button>
              <button
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword('');
                  setError('');
                }}
                style={{
                  padding: '8px 16px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader; 