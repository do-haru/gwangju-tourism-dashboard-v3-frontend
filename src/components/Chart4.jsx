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
  // Dropdown 버튼의 년, 월, 일 선택 state
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedDay, setSelectedDay] = useState("01");

  const [selectedTime, setSelectedTime] = useState(12); // Slider 시간 선택 state
  const [flowData, setFlowData] = useState([]); // CSV에서 불러온 dummy data

  const selectedDate = selectedYear + selectedMonth + selectedDay; // 선택된 날짜를 문자열로 합침

  // GeoJSON에서 동구만 필터
  const filteredGeoData = {
    ...geoData,
    features: geoData.features.filter(
      (feature) => feature.properties.sggnm === "동구",
    ),
  };

  // 유동인구 더미 데이터 파싱 함수
  // CSV 문자열 → JS 객체로 변환
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

  // 선택된 날짜 + 시간에 해당하는 데이터만 필터링
  const currentData = flowData.filter(
    (d) => d.date === selectedDate && d.time === selectedTime,
  );

  // 행정동의 유동인구 값 가져오기
  const getValueByRegion = (region) => {
    const found = currentData.find((d) => d.region === region);
    return found ? found.value : 0;
  };

  // 색 함수
  const getColor = (value) => {
    if (value > 1500) return "#800026";
    if (value > 1200) return "#BD0026";
    if (value > 900) return "#E31A1C";
    if (value > 700) return "#FC4E2A";
    if (value > 500) return "#FD8D3C";
    if (value > 300) return "#FEB24C";
    return "#FFEDA0";
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
  console.log(geoData.features.map((f) => f.properties.adm_nm));
  return (
    <div className="Chart4">
      {/* 날짜 선택 drop down  UI */}
      <div className="DateSelector">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2025">2025년</option>
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {[...Array(12)].map((_, i) => {
            const m = String(i + 1).padStart(2, "0");
            return (
              <option key={m} value={m}>
                {m}월
              </option>
            );
          })}
        </select>

        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {[...Array(31)].map((_, i) => {
            const d = String(i + 1).padStart(2, "0");
            return (
              <option key={d} value={d}>
                {d}일
              </option>
            );
          })}
        </select>
      </div>
      {/* 시간 선택 Slider UI */}
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
      {/* 지도 UI */}
      <div className="MapSection">
        <MapContainer center={[35.1477, 126.9259]} zoom={14} className="map">
          <ResizeMap />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={filteredGeoData}
            style={(feature) => {
              const dong = feature.properties.adm_nm.split(" ").pop();
              const value = getValueByRegion(dong);

              return {
                color: "#333",
                weight: 1,
                fillColor: getColor(value),
                fillOpacity: 0.7,
              };
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Chart4;
