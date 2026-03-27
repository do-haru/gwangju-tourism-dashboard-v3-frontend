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

const regions = [
  "계림1동",
  "계림2동",
  "충장동",
  "동명동",
  "산수1동",
  "산수2동",
  "서남동",
  "지산1동",
  "지산2동",
  "지원1동",
  "지원2동",
  "학동",
  "학운동",
];

const Chart4 = () => {
  // Year 고정, Slider의 month 선택 state
  const selectedYear = "2025";
  const [selectedMonth, setSelectedMonth] = useState("01");

  const [flowData, setFlowData] = useState([]); // CSV에서 불러온 dummy data
  const [consumeData, setConsumeData] = useState([]);

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

  // 소비량 데이터
  const parseConsumeCSV = (text, year, month) => {
    const lines = text.split("\n").slice(1);

    return lines
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const parts = line.split(",");

        // 🔥 방어 코드
        if (parts.length < 4) return null;

        const date = parts[0];
        const region = parts[1];
        const type = parts[2];
        const value = parts[3];

        return {
          date,
          region: region?.trim(),
          type: type?.trim(),
          value: Number(value),
        };
      })
      .filter((d) => d !== null)
      .filter((d) => d.date === `${year}${month}` && d.type === "관광총소비");
  };

  // 색 함수
  const getColor = (value) => {
    if (value > 25) return "#800026";
    if (value > 23) return "#BD0026";
    if (value > 21) return "#E31A1C";
    if (value > 19) return "#FC4E2A";
    if (value > 17) return "#FD8D3C";
    if (value > 15) return "#FEB24C";
    return "#FFEDA0";
  };

  const getCombinedValue = (dong) => {
    const visitor = flowData.find((d) => d.region === dong);
    const consume = consumeData.find((d) => d.region === dong);

    const v = visitor ? visitor.value : 0;
    const c = consume ? consume.value : 0;

    return Math.log(v * c); // 🔥 핵심
  };

  // 지도 데이터(GeoJSON)에 유동인구 값 추가
  const mergedGeoData = {
    ...filteredGeoData,
    features: filteredGeoData.features.map((feature) => {
      const dong = feature.properties.adm_nm.split(" ").pop();

      const found = flowData.find((d) => d.region === dong);

      const combinedValue = getCombinedValue(dong);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          value: combinedValue,
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
      const value = getCombinedValue(dong);

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

  useEffect(() => {
    Promise.all(
      regions.map((region) => {
        return fetch(`/data/consumption/2025_${region}_관광소비 추이.csv`)
          .then((res) => res.text())
          .then((text) => {
            const parsed = parseConsumeCSV(text, selectedYear, selectedMonth);

            // 🔥 한 동 → 하나 값만 나옴
            return parsed[0]
              ? { region, value: parsed[0].value }
              : { region, value: 0 };
          });
      })
    ).then((results) => {
      console.log("consumeData:", results);
      setConsumeData(results);
    });
  }, [selectedMonth]);

  console.log("combined:", getCombinedValue("동명동"));

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
