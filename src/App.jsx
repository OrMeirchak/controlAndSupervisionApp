import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import EmergencySidebar from "./components/EmergencySidebar";
import EmergencyModal from "./components/EmergencyModal";
import RescueBar from "./components/RescueBar";
import MapView from "./components/MapView";
import { SERVER_URL, WS_URL, ICONS } from "./constants";

function App() {
  const [rescueServices, setRescueServices] = useState([]);
  const [emergencyItems, setEmergencyItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [showAllEmergencies, setShowAllEmergencies] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    fetch(`${SERVER_URL}/getRecuseServices`)
      .then(res => res.json())
      .then(data => setRescueServices(data));

    socketRef.current = new WebSocket(WS_URL);
    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "create emergency") {
        setEmergencyItems(prev => [msg, ...prev.filter(item => item.id !== msg.id)]);
      } else if (msg.type === "edit emergency") {
        setEmergencyItems(prev => prev.map(item => item.id === msg.id ? { ...item, ...msg } : item));
      } else if (msg.type === "orderOfEmergency") {
        setOrder(msg.order);
      }
    };

    return () => socketRef.current?.close();
  }, []);

  // const orderedItems = order
  //   .map(id => emergencyItems.find(item => item.id === id))
  //   .filter(Boolean);

  // const top6Items = orderedItems.slice(0, 6);

  const getIconSrc = (type) => ICONS[type] || "";
  const getIcon = (type) => {
    const src = getIconSrc(type);
    return src ? `<img src='${src}'/>` : "";
  };

  return (
    <div className="app">
      <AppHeader onAllEmergency={() => setShowAllEmergencies(true)} />
      <EmergencyModal
        open={showAllEmergencies}
        onClose={() => setShowAllEmergencies(false)}
        emergencyItems={emergencyItems}
        getIconSrc={getIconSrc}
        rescueServices={rescueServices}
        onActionClick={setFocusedLocation}
      />
      <EmergencySidebar
        items={emergencyItems}
        onCardClick={setFocusedLocation}
        getIconSrc={getIconSrc}
        rescueServices={rescueServices}
      />
      <MapView
        center={[32.0853, 34.7818]}
        zoom={13}
        orderedItems={emergencyItems}
        focusedLocation={focusedLocation}
        getIcon={getIcon}
      />
      <RescueBar rescueServices={rescueServices} />
    </div>
  );
}

export default App;