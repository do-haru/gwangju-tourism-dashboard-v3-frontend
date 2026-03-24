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

const Chart2 = ({ filteredRawData, pieData, visitorConcentration, COLORS }) => {
  return (
    <div className="Chart2">
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

          <p>외지인 집중도: {visitorConcentration.concentration.toFixed(2)}</p>
          <p>
            ※ 외지인 집중도는 특정 날짜에 외지인 방문이 얼마나 몰려 있는지를
            나타내며, 값이 높을수록 외지인 방문이 특정 시점에 집중되는 경향을
            의미함
          </p>
        </div>
      )}
    </div>
  );
};

export default Chart2;
