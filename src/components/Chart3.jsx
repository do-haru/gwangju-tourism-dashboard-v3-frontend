import "./Chart3.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const Chart3 = ({ rawData }) => {
  /* 요일별 평균 방문자 */
  const dayOfWeekData = (() => {
    if (!rawData || rawData.length === 0) return [];

    const grouped = {};

    rawData.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = { sum: 0, count: 0 };
      }

      grouped[item.day].sum += item.total;
      grouped[item.day].count += 1;
    });

    const order = ["일", "월", "화", "수", "목", "금", "토"];

    return order.map((day) => ({
      day,
      avg: grouped[day] ? Math.round(grouped[day].sum / grouped[day].count) : 0,
    }));
  })();

  /* 요일별 평균 방문자 + 최대/최소 + 주말/평일 */
  const dayOfWeekAnalysis = (() => {
    if (!rawData || rawData.length === 0) return null;

    const grouped = {};

    rawData.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = { sum: 0, count: 0 };
      }

      grouped[item.day].sum += item.total;
      grouped[item.day].count += 1;
    });

    const order = ["일", "월", "화", "수", "목", "금", "토"];

    const avgData = order.map((day) => ({
      day,
      avg: grouped[day] ? Math.round(grouped[day].sum / grouped[day].count) : 0,
    }));

    // 최대 / 최소 요일
    let maxDay = avgData[0];
    let minDay = avgData[0];

    avgData.forEach((item) => {
      if (item.avg > maxDay.avg) maxDay = item;
      if (item.avg < minDay.avg) minDay = item;
    });

    // 주말 vs 평일
    const weekend = avgData.filter((d) => d.day === "토" || d.day === "일");
    const weekday = avgData.filter((d) => !["토", "일"].includes(d.day));

    const weekendAvg =
      weekend.reduce((sum, d) => sum + d.avg, 0) / weekend.length;

    const weekdayAvg =
      weekday.reduce((sum, d) => sum + d.avg, 0) / weekday.length;

    return {
      avgData,
      maxDay,
      minDay,
      weekendAvg: Math.round(weekendAvg),
      weekdayAvg: Math.round(weekdayAvg),
    };
  })();

  /*  요일별 외지인 / 현지인 */
  const dayOfWeekVisitorData = (() => {
    if (!rawData || rawData.length === 0) return [];

    const grouped = {};

    rawData.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = {
          visitorSum: 0,
          residentSum: 0,
          count: 0,
        };
      }

      grouped[item.day].visitorSum += item.visitor;
      grouped[item.day].residentSum += item.resident;
      grouped[item.day].count += 1;
    });

    const order = ["일", "월", "화", "수", "목", "금", "토"];

    return order.map((day) => ({
      day,
      visitor: grouped[day]
        ? Math.round(grouped[day].visitorSum / grouped[day].count)
        : 0,
      resident: grouped[day]
        ? Math.round(grouped[day].residentSum / grouped[day].count)
        : 0,
    }));
  })();

  /* 요일별 방문자 순위 */
  const dayRanking = (() => {
    if (!dayOfWeekData || dayOfWeekData.length === 0) return [];

    return [...dayOfWeekData]
      .sort((a, b) => b.avg - a.avg)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  })();

  /* 요일별 외지인 비율 */
  const dayOfWeekRatioData = (() => {
    if (!rawData || rawData.length === 0) return [];

    const grouped = {};

    rawData.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = {
          visitorSum: 0,
          residentSum: 0,
          count: 0,
        };
      }

      grouped[item.day].visitorSum += item.visitor;
      grouped[item.day].residentSum += item.resident;
      grouped[item.day].count += 1;
    });

    const order = ["일", "월", "화", "수", "목", "금", "토"];

    return order.map((day) => {
      const visitor = grouped[day]
        ? grouped[day].visitorSum / grouped[day].count
        : 0;

      const resident = grouped[day]
        ? grouped[day].residentSum / grouped[day].count
        : 0;

      const total = visitor + resident;

      return {
        day,
        visitorRatio: total ? visitor / total : 0,
        residentRatio: total ? resident / total : 0,
      };
    });
  })();
  return (
    <div className="Chart3">
      <div className="Chart3_1">
        {/* 요일별 평균 방문자 BarChart */}
        <h3>요일별 평균 방문자 수</h3>
        <BarChart width={700} height={300} data={dayOfWeekData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg" name="평균 방문자" />
        </BarChart>
        <p className="chart-desc">
          ※요일별 평균 방문자 수를 나타내며, 특정 요일의 방문 규모를 비교할 수
          있는 그래프
        </p>
      </div>
      <div className="Chart3_2">
        {/* 요일별 외지인 비율 */}
        <h3>요일별 외지인/현지인 비율</h3>
        <BarChart width={700} height={300} data={dayOfWeekRatioData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 1]} />

          <Tooltip formatter={(v) => (v * 100).toFixed(1) + "%"} />
          <Legend />

          {/* 외지인 */}
          <Bar dataKey="visitorRatio" fill="#ff7f50" name="외지인 비율" />

          {/* 현지인 */}
          <Bar dataKey="residentRatio" fill="#1e90ff" name="현지인 비율" />
        </BarChart>
        <p className="chart-desc">
          ※요일별 전체 방문자 중 외지인과 현지인이 차지하는 비율을 비교한 그래프
        </p>
      </div>
      <div className="Chart3_3">
        {dayRanking && dayRanking.length > 0 && (
          <>
            <h3>요일별 방문자 순위</h3>

            <div className="summary-card ranking-card">
              {dayRanking.map((item) => (
                <p
                  key={item.day}
                  className={`ranking-item ${item.rank <= 3 ? "top-rank" : ""}`}
                >
                  {item.rank}위: {item.day} ({item.avg.toLocaleString()}명)
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      {dayOfWeekAnalysis && (
        <div className="Chart3_4">
          {/* 주말 */}
          <div className="summary-card">
            <p className="label">주말 평균 방문자</p>
            <p className="value">
              {dayOfWeekAnalysis.weekendAvg.toLocaleString()}명
            </p>
          </div>

          {/* 평일 */}
          <div className="summary-card">
            <p className="label">평일 평균 방문자</p>
            <p className="value">
              {dayOfWeekAnalysis.weekdayAvg.toLocaleString()}명
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart3;
