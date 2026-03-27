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
  // Year 고정, Slider의 month 선택 state
  const selectedYear = "2025";
  const [selectedMonth, setSelectedMonth] = useState("01");

  const [flowData, setFlowData] = useState([]); // CSV에서 불러온 dummy data

  // GeoJSON에서 동구만 필터
  const filteredGeoData = {
    ...geoData,
    features: geoData.features.filter(
      (feature) => feature.properties.sggnm === "동구"
    ),
  };

  /**
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
*/

  // 월별 방문자수 데이터 파싱 함수
  const parseVisitorCSV = (text, year, month) => {
    const lines = text.split("\n").slice(1);

    return lines
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [region, visitors] = line.split(",");

        return {
          year,
          month,
          region: region.trim(),
          value: Number(visitors),
        };
      });
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

  // 지도 데이터(GeoJSON)에 유동인구 값 추가
  const mergedGeoData = {
    ...filteredGeoData,
    features: filteredGeoData.features.map((feature) => {
      const dong = feature.properties.adm_nm.split(" ").pop();

      console.log("geo dong:", dong);

      const found = flowData.find((d) => d.region === dong);

      console.log("match:", found);

      return {
        ...feature,
        properties: {
          ...feature.properties,
          value: found ? found.value : 0,
        },
      };
    }),
  };

  // 지도 위에 글씨 쓰기
  const onEachFeature = (feature, layer) => {
    const dong = feature.properties.adm_nm.split(" ").pop();

    layer.bindTooltip(dong, {
      permanent: true,
      direction: "center",
      className: "dong-label",
    });

    layer.on("click", () => {
      // ✅ 여기 수정
      const found = flowData.find((d) => d.region === dong);
      const value = found ? found.value : 0;

      layer
        .bindPopup(
          `
          <div>
            <strong>${dong}</strong><br/>
            방문자수: ${value}
          </div>
        `
        )
        .openPopup();
    });
  };

  useEffect(() => {
    const fileName = `${selectedYear}${selectedMonth}_visitor.csv`;

    fetch(`/data/visitor_month/${fileName}`)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseVisitorCSV(text, selectedYear, selectedMonth);
        console.log("월별 방문자수: ", parsed);
        setFlowData(parsed);
      });
  }, [selectedYear, selectedMonth]);

  return (
    <div className="Chart4">
      {/* 시간 선택 Slider UI */}
      <div className="Slider">
        <input
          type="range"
          min="1"
          max="12"
          step="1"
          value={Number(selectedMonth)}
          onChange={(e) => {
            const m = String(e.target.value).padStart(2, "0");
            setSelectedMonth(m);
          }}
        />

        <div style={{ textAlign: "center", marginTop: "8px" }}>
          {selectedMonth}월
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
            key={selectedMonth}
            data={mergedGeoData}
            style={(feature) => {
              const value = feature.properties.value;

              return {
                color: "#333",
                weight: 1,
                fillColor: getColor(value),
                fillOpacity: 0.7,
              };
            }}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
        <div className="Legend">
          <div>
            <span style={{ background: "#800026" }}></span> 1500+
          </div>
          <div>
            <span style={{ background: "#BD0026" }}></span> 1200+
          </div>
          <div>
            <span style={{ background: "#E31A1C" }}></span> 900+
          </div>
          <div>
            <span style={{ background: "#FC4E2A" }}></span> 700+
          </div>
          <div>
            <span style={{ background: "#FD8D3C" }}></span> 500+
          </div>
          <div>
            <span style={{ background: "#FEB24C" }}></span> 300+
          </div>
          <div>
            <span style={{ background: "#FFEDA0" }}></span> 낮음
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart4;
