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
  Legend,
} from "recharts";
import { useState } from "react";

const Chart2 = ({
  filteredRawData,
  pieData,
  visitorConcentration,
  COLORS,
  avgVisitorRatio,
  residentSummary,
}) => {
  const [ratioType, setRatioType] = useState("visitor"); // Chart2_2에 현지인/외지인 그래프 토글 버튼 state
  const dataKey = ratioType === "visitor" ? "visitorRatio" : "residentRatio"; // 그래프 버튼 선택된 타입에 따라 dataKey 변경

  return (
    <div className="Chart2">
      <div className="Chart2_1">
        {/* 외지인/현지인 LineChart */}
        <h3>현지인/외지인 방문자 수 추세</h3>
        <LineChart width={600} height={320} data={filteredRawData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" />

          {/* 외지인 */}
          <Line
            type="linear"
            dataKey="visitor"
            name="외지인"
            stroke="#ff7f50"
            strokeWidth={2}
          />

          {/* 현지인 */}
          <Line
            type="linear"
            dataKey="resident"
            name="현지인"
            stroke="#1e90ff"
            strokeWidth={2}
          />
        </LineChart>
        <p className="chart-desc">
          ※날짜별 현지인과 외지인 방문자 수 변화를 나타내는 그래프
        </p>
      </div>
      <div className="Chart2_2">
        <h3>현지인/외지인 비율 변화</h3>
        {/* 비율 LineChart  */}
        <LineChart width={600} height={300} data={filteredRawData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />

          {/* 퍼센트 표시 */}
          <Tooltip formatter={(v) => (v * 100).toFixed(1) + "%"} />

          <Line
            type="linear"
            dataKey={dataKey}
            stroke={ratioType === "visitor" ? "#ff7f50" : "#1e90ff"} // ⭐ 색도 변경
            strokeWidth={2}
            name={ratioType === "visitor" ? "외지인 비율" : "현지인 비율"}
          />
        </LineChart>
        {/*  현지인/외지인 버튼 */}
        <div className="ratio-toggle">
          <button
            className={`${ratioType === "visitor" ? "active visitor" : ""}`}
            onClick={() => setRatioType("visitor")}
          >
            외지인
          </button>

          <button
            className={`${ratioType === "resident" ? "active resident" : ""}`}
            onClick={() => setRatioType("resident")}
          >
            현지인
          </button>
        </div>
        <p className="chart-desc">
          ※전체 방문자 중 현지인 또는 외지인이 차지하는 비율 변화를 나타내는
          그래프
        </p>
      </div>
      <div className="Chart2_3">
        <h3>현지인/외지인 방문 비중</h3>
        {/* 외지인/현지인 비율 PieChart */}
        <PieChart width={450} height={320}>
          <Legend verticalAlign="bottom" />
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
        <p className="chart-desc">
          ※선택된 기간 동안 현지인과 외지인의 전체 방문 비중을 비교한 그래프
        </p>
      </div>
      <div className="Chart2_4">
        {/* 외지인/현지인 요약 지표 */}
        {visitorConcentration && (
          <div className="concentration">
            <>
              <div className="summary-cards">
                <div className="summary-card">
                  <p className="label">최대 현지인 방문일</p>
                  <p className="value">{residentSummary.maxItem.date}</p>
                  <p className="sub">
                    {residentSummary.maxItem.resident.toLocaleString()}명
                  </p>
                </div>
                <div className="summary-card">
                  <p className="label">평균 현지인 방문자</p>
                  <p className="value">
                    {Math.round(residentSummary.avg).toLocaleString()}명
                  </p>
                </div>
                <div className="summary-card">
                  <p className="label">외지인 집중도</p>
                  <p className="value">
                    {visitorConcentration.concentration.toFixed(2)}
                  </p>
                </div>
                <div className="summary-card">
                  <p className="label">최대 외지인 방문일</p>
                  <p className="value">{visitorConcentration.maxItem.date}</p>
                  <p className="sub">
                    {visitorConcentration.maxItem.visitor.toLocaleString()}명
                  </p>
                </div>

                <div className="summary-card">
                  <p className="label">평균 외지인 방문자</p>
                  <p className="value">
                    {Math.round(visitorConcentration.avg).toLocaleString()}명
                  </p>
                </div>

                <div className="summary-card">
                  <p className="label">평균 외지인 비율</p>
                  <p className="value">{(avgVisitorRatio * 100).toFixed(1)}%</p>
                </div>
              </div>
            </>
          </div>
        )}
        <p className="chart-desc">
          ※외지인 집중도는 특정 날짜에 외지인 방문이 얼마나 집중되어 있는지를
          나타내며, 값이 높을수록 외지인 방문이 특정 시점에 몰리는 경향을 의미함
        </p>
      </div>
    </div>
  );
};

export default Chart2;
