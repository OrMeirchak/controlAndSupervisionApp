import React from 'react';
import './UrgencyLevels.css';

const UrgencyLevels = ({ minimizedItems = [], onRestoreItem }) => {
  const urgencyLevels = [
    { level: 'very high', color: '#e53935', label: 'דחיפות גבוהה מאוד' },
    { level: 'high', color: '#ffb300', label: 'דחיפות גבוהה' },
    { level: 'medium', color: '#ccc', label: 'דחיפות בינונית' },
    { level: 'low', color: '#43a047', label: 'דחיפות נמוכה' }
  ];

  return (
    <div className="urgency-levels">
      {urgencyLevels.map(({ level, color, label }) => {
        const itemsForLevel = minimizedItems.filter(item => item.severity === level);
        const count = itemsForLevel.length;
        
        return (
          <div key={level} className="urgency-level">
            <div 
              className="urgency-dot" 
              style={{ background: color }}
              onClick={() => itemsForLevel.forEach(item => onRestoreItem(item))}
            >
              {count > 0 && <span className="minimized-count">{count}</span>}
            </div>
            <span className="urgency-tooltip">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default UrgencyLevels; 