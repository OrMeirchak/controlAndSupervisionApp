import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import EmergencySidebar from "./components/EmergencySidebar";
import EmergencyModal from "./components/EmergencyModal";
import MapView from "./components/MapView";
import UrgencyLevels from "./components/UrgencyLevels";
import { SERVER_URL, WS_URL, ICONS } from "./constants";
import { sendWhatsappFromClient } from "./utils/whatsApp-utils";
import { msgAdapter } from "./adapter/items-adapter";
import BottomSituationMessage from "./components/BottomSituationMessage";

function App() {
  const [rescueServices, setRescueServices] = useState([]);
  const [emergencyItems, setEmergencyItems] = useState([]);
  const [minimizedItems, setMinimizedItems] = useState([]);
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [showAllEmergencies, setShowAllEmergencies] = useState(false);
  const socketRef = useRef(null);

  const emergencyTypeHebrew = {
    fire: 'שריפה',
    accident: 'תאונה',
    flood: 'הצפה',
    medical: 'אירוע רפואי',
    security: 'אירוע בטחוני',
    earthquake: 'רעידת אדמה',
    rescue: 'חילוץ',
    murder: 'רצח',
    terror: 'פיגוע',
    other: 'אחר',
  };

  useEffect(() => {
    fetch(`${SERVER_URL}/getRecuseServices`)
      .then(res => res.json())
      .then(data => setRescueServices(data));

    fetch(`${SERVER_URL}/init`)
      .then(res => res.json())
      .then(data => setEmergencyItems(data.map(msg => msgAdapter(msg))));

    socketRef.current = new WebSocket(WS_URL);
    socketRef.current.onmessage = (event) => {
      const msg = msgAdapter(JSON.parse(event.data));
      if (msg.type === "create emergency") {
        setEmergencyItems(prev => [msg, ...prev.filter(item => item.id !== msg.id)]);
      } else if (msg.type === "edit emergency") {
        setEmergencyItems(prev => prev.map(item => item.id === msg.id ? { ...item, ...msg } : item));
        setMinimizedItems(prev => prev.map(item => item.id === msg.id ? { ...item, ...msg } : item));
      }
    };

    return () => socketRef.current?.close();
  }, []);

  const clearAllEmergencies = () => {
    setEmergencyItems([]);
    setMinimizedItems([]);
  };

  // Sort emergencyItems by urgency
  const sortedEmergencyItems = [...emergencyItems]
    .filter(item => !minimizedItems.find(min => min.id === item.id))
    .sort((a, b) => {
      const priorities = ["very high", "high", "medium", "low"];
      return priorities.indexOf(a.severity) - priorities.indexOf(b.severity);
    });

  const handleMinimize = (item) => {
    setMinimizedItems(prev => [...prev, item]);
    setEmergencyItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleRestoreItem = (item) => {
    setMinimizedItems(prev => prev.filter(i => i.id !== item.id));
    setEmergencyItems(prev => [...prev, item]);
  };

  const getIconSrc = (type) => ICONS[type] || "";
  const getIcon = (type) => {
    const src = getIconSrc(type);
    return src ? `<img src='${src}' style='width:32px;height:32px;'/>` : "";
  };

  return (
    <div className="app">
      <AppHeader
        onAllEmergency={() => setShowAllEmergencies(true)}
        onClearAll={clearAllEmergencies}
      />
      <UrgencyLevels
        minimizedItems={minimizedItems}
        onRestoreItem={handleRestoreItem}
      />
      <EmergencyModal
        open={showAllEmergencies}
        onClose={() => setShowAllEmergencies(false)}
        emergencyItems={[...emergencyItems, ...minimizedItems]}
        getIconSrc={getIconSrc}
        rescueServices={rescueServices}
        onActionClick={location => {
          setFocusedLocation(null);
          setTimeout(() => setFocusedLocation(location), 0);
        }}
      />
      <EmergencySidebar
        items={sortedEmergencyItems}
        onCardClick={location => {
          setFocusedLocation(null);
          setTimeout(() => setFocusedLocation(location), 0);
        }}
        getIconSrc={getIconSrc}
        rescueServices={rescueServices}
        sendWhatsappFromClient={sendWhatsappFromClient}
        onMinimize={handleMinimize}
      />
      <MapView
        center={[32.0853, 34.7818]}
        zoom={13}
        orderedItems={[...sortedEmergencyItems, ...minimizedItems]}
        focusedLocation={focusedLocation}
        getIcon={getIcon}
      />
      <BottomSituationMessage />
    </div>
  );
}

export default App;