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

const Chart1 = ({ rawData }) => {
  /* 일별 방문자수 diff / rate 계산 */
  const trendData = rawData?.map((item, index, arr) => {
    if (index === 0) {
      return { ...item, diff: 0, rate: 0 };
    }

    const prev = arr[index - 1];
    const diff = item.total - prev.total;
    const rate = prev.total ? diff / prev.total : 0;

    return {
      ...item,
      diff,
      rate,
    };
  });

  /* 요약 지표 계산 */
  const summary = (() => {
    if (!rawData || rawData.length === 0) return null;

    let max = rawData[0];
    let min = rawData[0];
    let sum = 0;

    rawData.forEach((item) => {
      if (item.total > max.total) max = item;
      if (item.total < min.total) min = item;
      sum += item.total;
    });

    const avg = Math.round(sum / rawData.length);

    return {
      max,
      min,
      avg,
    };
  })();

  return (
    <div className="Chart1">
      <div className="Chart1_1">
        {/* LineChart (추세) */}
        <h3>일별 방문자 수 추세</h3>
        <LineChart width={700} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" />
        </LineChart>
        <p className="chart-desc">
          ※날짜별 전체 방문자 수의 변화를 나타내는 그래프
        </p>
      </div>
      <div className="Chart1_2">
        {/* BarChart (증가/감소) */}
        <h3>일별 방문자 증감</h3>
        <BarChart width={700} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="diff" />
        </BarChart>
        <p className="chart-desc">
          ※전일 대비 방문자 수의 증가 및 감소를 나타내는 그래프
        </p>
      </div>
      {/* 방문자수 최대, 최소, 평균 지표 */}
      {summary && (
        <div className="Chart1_3">
          <div className="summary-card">
            <p className="label">최대 방문일</p>
            <p className="value">{summary.max.date}</p>
            <p className="sub">{summary.max.total.toLocaleString()}명</p>
          </div>

          <div className="summary-card">
            <p className="label">최소 방문일</p>
            <p className="value">{summary.min.date}</p>
            <p className="sub">{summary.min.total.toLocaleString()}명</p>
          </div>

          <div className="summary-card">
            <p className="label">평균 방문자</p>
            <p className="value">{summary.avg.toLocaleString()}명</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart1;
