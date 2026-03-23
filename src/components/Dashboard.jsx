import "./Dashboard.css";

import { visitorFiles } from "../data/visitorFiles";

import { useEffect, useState } from "react";

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

const Dashboard = () => {
  const [visitorData, setVisitorData] = useState([]); // 일별 방문자수 데이터 저장 변수

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
      console.log(allData); // 테스트용 console 출력
      setVisitorData(allData);
    });
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
