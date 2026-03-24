import "./Chart1.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const Chart1 = ({ trendData, summary }) => {
  return (
    <div className="Chart1">
      {/* LineChart (추세) */}
      <LineChart width={700} height={300} data={trendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" />
      </LineChart>
      {/* BarChart (증가/감소) */}
      <BarChart width={700} height={300} data={trendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="diff" />
      </BarChart>
      {/* 방문자수 최대, 최소, 평균 지표 */}
      {summary && (
        <div className="summary">
          <p>
            최대 방문일: {summary.max.date} (
            {summary.max.total.toLocaleString()}명)
          </p>
          <p>
            최소 방문일: {summary.min.date} (
            {summary.min.total.toLocaleString()}명)
          </p>
          <p>평균 방문자: {summary.avg.toLocaleString()}명</p>
        </div>
      )}
    </div>
  );
};

export default Chart1;
