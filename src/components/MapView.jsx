import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

function FlyToLocation({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position]);
  return null;
}

const MapView = ({ center, zoom, orderedItems, focusedLocation, getIcon }) => (
  <MapContainer center={center} zoom={zoom} className="map-container">
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <FlyToLocation position={focusedLocation} />
    {orderedItems
      .filter(item => Array.isArray(item.location) && item.location.length === 2)
      .map(item => (
        <Marker
          key={item.id}
          position={item.location}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `<div class='label-container'>${getIcon(item.emergencyType)}<div class='label-text'><strong>${item.emergencyType}</strong><br/>${item.summary}</div></div>`
          })}
        />
      ))}
  </MapContainer>
);

export default MapView; 