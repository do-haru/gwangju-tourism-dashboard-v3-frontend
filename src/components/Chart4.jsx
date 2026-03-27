import "./Chart4.css";

import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import geoData from "../assets/gwangju.json";

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
  const [flowData, setFlowData] = useState([]);

  // 유동인구 더미 데이터 파싱 함수
  const parseFlowCSV = (text) => {
    const lines = text.split("\n").slice(1);

    return lines
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [date, region, time, value] = line.split(",");

        return {
          date,
          region,
          time: Number(time),
          value: Number(value),
        };
      });
  };

  // GeoJSON에서 동구만 필터
  const filteredGeoData = {
    ...geoData,
    features: geoData.features.filter(
      (feature) => feature.properties.sggnm === "동구",
    ),
  };

  useEffect(() => {
    fetch("/data/flow/2025_flow_full.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseFlowCSV(text);
        console.log(parsed); // 콘솔 확인 테스트
        setFlowData(parsed);
      });
  }, []);

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
          <GeoJSON
            data={filteredGeoData}
            style={() => ({
              color: "#333",
              weight: 1,
              fillOpacity: 0.1,
            })}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Chart4;
