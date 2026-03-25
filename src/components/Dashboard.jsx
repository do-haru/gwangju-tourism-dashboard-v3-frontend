import "./Dashboard.css";

import { visitorFiles } from "../data/visitorFiles";

import { useEffect, useState } from "react";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import Chart3 from "./Chart3";

// CSV 문자열 -> JS 객체 배열로 변환
const parseCSV = (text) => {
  const lines = text.split("\n").slice(1);

  return lines
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [date, dong, type, value] = line.split(",");

      return {
        date,
        dong,
        type,
        value: Number(value),
      };
    });
};

/**
 *
 *  전처리 함수: CSV 원본 데이터(rawData)를 분석 가능한 형태로 변환
 *
 * 결과 구조:
 * {
 *   동명동: [
 *     {
 *       date,
 *       total,
 *       resident,
 *       visitor,
 *       visitorRatio,
 *       day,
 *       dayIndex
 *     }
 *   ]
 * }
 */
const preprocess = (data) => {
  const grouped = {};

  data.forEach((item) => {
    const { date, dong, type, value } = item;

    // 날짜 포맷 변환 (YYYY-MM-DD)
    const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(
      6,
      8,
    )}`;

    const key = `${dong}-${formattedDate}`;

    if (!grouped[key]) {
      grouped[key] = {
        date: formattedDate,
        dong,
        total: 0,
        resident: 0,
        visitor: 0,
      };
    }

    // type에 따라 값 분리
    if (type && type.includes("전체방문자(a+b)")) {
      grouped[key].total = value;
    } else if (type && type.includes("현지인방문자(a)")) {
      grouped[key].resident = value;
    } else if (type && type.includes("외지인방문자(b)")) {
      grouped[key].visitor = value;
    }
  });

  // 요일 배열
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // 최종 구조 생성
  const result = {};

  Object.values(grouped).forEach((item) => {
    const dateObj = new Date(item.date);
    const dayIndex = dateObj.getDay();

    const newItem = {
      ...item,
      visitorRatio: item.total ? item.visitor / item.total : 0,
      residentRatio: item.total ? item.resident / item.total : 0,
      day: days[dayIndex],
      dayIndex,
    };

    if (!result[item.dong]) {
      result[item.dong] = [];
    }

    result[item.dong].push(newItem);
  });

  return result;
};

const Dashboard = () => {
  const [visitorData, setVisitorData] = useState({}); // 일별 방문자수 데이터 저장 변수
  const [selectedDong, setSelectedDong] = useState("동명동"); // 선택된 행정동 저장 변수
  const [selectedYear, setSelectedYear] = useState("2025"); // 선택된 년도 저장 변수
  const [selectedMonth, setSelectedMonth] = useState("01"); // 선택된 월 저장 변수

  /* "날짜_행정동_방문자 수 추이.csv" 데이터를 하나의 JS배열로 만들어 visitorData에 저장 */
  useEffect(() => {
    Promise.all(
      visitorFiles.map((file) =>
        fetch(`/data/visitor_daily/${file}`).then((res) => {
          if (!res.ok) {
            throw new Error(`${file} 로드 실패`);
          }
          return res.text();
        }),
      ),
    ).then((texts) => {
      const allData = texts.flatMap((text) => parseCSV(text));

      const processedData = preprocess(allData);
      console.log(processedData); // 테스트용 console 출력
      setVisitorData(processedData);
    });
  }, []);

  const selectedData = visitorData[selectedDong]; // 선택된 행정동의 데이터

  // 년도, 월 기준 필터링
  const filteredRawData = selectedData?.filter((item) => {
    const year = item.date.slice(0, 4);
    const month = item.date.slice(5, 7);

    return year === selectedYear && month === selectedMonth;
  });

  return (
    <div className="Dashboard">
      <div className="control-bar">
        {/* 행정동 선택 dropdown */}
        <select
          value={selectedDong}
          onChange={(e) => setSelectedDong(e.target.value)}
        >
          {Object.keys(visitorData).map((dong) => (
            <option key={dong} value={dong}>
              {dong}
            </option>
          ))}
        </select>
        {/* 년도 선택 dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {["2025", "2026"].map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        {/* 월 선택 dropdown */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {[
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ].map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
      </div>

      <div className="Chart">
        <Chart1 rawData={filteredRawData} />

        <Chart2 rawData={filteredRawData} />
        <Chart3 rawData={filteredRawData} />
      </div>
    </div>
  );
};

export default Dashboard;
