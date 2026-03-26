import "./Chart4.css";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// 지도 크기 강제 재계산
const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  return null;
};

const Chart4 = () => {
  const [selectedTime, setSelectedTime] = useState(12);

  return (
    <div className="Chart4">
      <div className="Slider">
        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={selectedTime}
          onChange={(e) => setSelectedTime(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <div style={{ textAlign: "center", marginTop: "8px" }}>
          {selectedTime}시
        </div>
      </div>
      <div className="MapSection">
        <MapContainer center={[35.1477, 126.9259]} zoom={14} className="map">
          <ResizeMap />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Chart4;
