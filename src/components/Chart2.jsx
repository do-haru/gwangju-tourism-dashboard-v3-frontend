import "./Chart2.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";

const Chart2 = ({
  filteredRawData,
  pieData,
  visitorConcentration,
  COLORS,
  avgVisitorRatio,
}) => {
  const [ratioType, setRatioType] = useState("visitor"); // Chart2_2에 현지인/외지인 그래프 토글 버튼 state
  const dataKey = ratioType === "visitor" ? "visitorRatio" : "residentRatio"; // 그래프 버튼 선택된 타입에 따라 dataKey 변경

  return (
    <div className="Chart2">
      <div className="Chart2_1">
        {/* 외지인/현지인 LineChart */}
        <LineChart width={700} height={300} data={filteredRawData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          {/* 외지인 */}
          <Line
            type="monotone"
            dataKey="visitor"
            name="외지인"
            stroke="#ff7f50"
            strokeWidth={2}
          />

          {/* 현지인 */}
          <Line
            type="monotone"
            dataKey="resident"
            name="현지인"
            stroke="#1e90ff"
            strokeWidth={2}
          />
        </LineChart>
      </div>
      <div className="Chart2_2">
        {/* ⭐ 비율 LineChart  */}
        <LineChart width={700} height={250} data={filteredRawData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />

          {/* ⭐ 퍼센트 표시 */}
          <Tooltip formatter={(v) => (v * 100).toFixed(1) + "%"} />

          <Line
            type="monotone"
            dataKey={dataKey} // ⭐ 동적으로 변경
            stroke={ratioType === "visitor" ? "#ff7f50" : "#1e90ff"} // ⭐ 색도 변경
            strokeWidth={2}
            name={ratioType === "visitor" ? "외지인 비율" : "현지인 비율"}
          />
        </LineChart>
        {/*  현지인/외지인 버튼 */}
        <div className="ratio-toggle">
          <button
            className={ratioType === "visitor" ? "active" : ""}
            onClick={() => setRatioType("visitor")}
          >
            외지인
          </button>

          <button
            className={ratioType === "resident" ? "active" : ""}
            onClick={() => setRatioType("resident")}
          >
            현지인
          </button>
        </div>
      </div>
      <div className="Chart2_3">
        {/* 외지인/현지인 비율 PieChart */}
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => v.toLocaleString()} />
        </PieChart>
      </div>
      <div className="Chart2_4">
        {/* 외지인/현지인 요약 지표 */}
        {visitorConcentration && (
          <div className="concentration">
            <p>
              최대 외지인 방문일: {visitorConcentration.maxItem.date} (
              {visitorConcentration.maxItem.visitor.toLocaleString()}명)
            </p>

            <p>
              평균 외지인 방문자:{" "}
              {Math.round(visitorConcentration.avg).toLocaleString()}명
            </p>

            <p>
              외지인 집중도: {visitorConcentration.concentration.toFixed(2)}
            </p>
            <p>
              ※ 외지인 집중도는 특정 날짜에 외지인 방문이 얼마나 몰려 있는지를
              나타내며, 값이 높을수록 외지인 방문이 특정 시점에 집중되는 경향을
              의미함
            </p>
            <p>평균 외지인 비율: {(avgVisitorRatio * 100).toFixed(1)}%</p>

            <p className="desc">
              ※ 전체 방문자 중 외지인이 차지하는 평균 비율을 나타내며, 값이
              높을수록 외부 방문 비중이 높은 것을 의미함
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart2;
