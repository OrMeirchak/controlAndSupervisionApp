import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const SERVER_URL = "http://localhost:3001";
const WS_URL = "ws://localhost:3001";

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position]);
  return null;
}

function App() {
  const [rescueServices, setRescueServices] = useState([]);
  const [emergencyItems, setEmergencyItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [focusedLocation, setFocusedLocation] = useState(null);
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

  const orderedItems = order
    .map(id => emergencyItems.find(item => item.id === id))
    .filter(Boolean);

  const top6Items = orderedItems.slice(0, 6);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-placeholder">Logo</div>
        <h1 className="app-title">ResQ-AI</h1>
      </header>
      <div className="sidebar emergency-bar">
        {top6Items.map(item => (
          <div key={item.id} className="emergency-item" onClick={() => setFocusedLocation(item.location)}>
            <img src={getIconSrc(item.emergencyType)} alt="icon" />
            <div>{item.summary}</div>
            <div className="dispatched">
              {item.recuseServices.map(serviceName => {
                const service = rescueServices.find(s => s.name === serviceName);
                return service ? <div key={service.name} style={{ backgroundColor: service.color }} className="service-dot" /> : null;
              })}
            </div>
          </div>
        ))}
      </div>
      <MapContainer center={[32.0853, 34.7818]} zoom={13} className="map-container">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToLocation position={focusedLocation} />
        {orderedItems.map(item => (
          <Marker
            key={item.id}
            position={item.location}
            icon={L.divIcon({
              className: "custom-div-icon",
              html: `<div class='label-container'>${getIcon(item.emergencyType)}<div class='label-text'><strong>${item.type}</strong><br/>${item.summary}</div></div>`
            })}
          />
        ))}
      </MapContainer>
      <div className="overlay rescue-bar">
        {rescueServices.map(service => (
          <div key={service.name} className="rescue-service" style={{ backgroundColor: service.color }}>
            {service.name}
          </div>
        ))}
      </div>
    </div>
  );
}

const getIconSrc = (type) => {
  switch (type) {
    case "murder":
      return "/icons/murder.svg";
    case "accident":
      return "/icons/accident.svg";
    case "terror attack":
      return "/icons/terror-attack.svg";
    case "robbery":
      return "/icons/robbery.svg";
    case "medical emergency":
      return "/icons/medical-emergency.svg";
    default:
      return ""; // or return a fallback like "/icons/default.svg"
  }
};

const getIcon = (type) => {
  const src = getIconSrc(type);
  return src ? `<img src='${src}'/>` : "";
};
export default App;