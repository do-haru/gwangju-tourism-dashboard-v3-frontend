import "./Chart3.css";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Chart3 = ({
  dayOfWeekData,
  dayOfWeekVisitorData,
  dayOfWeekAnalysis,
  dayRanking,
}) => {
  return (
    <div className="Chart3">
      {/* 요일별 평균 방문자 BarChart */}
      <BarChart width={700} height={300} data={dayOfWeekData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="avg" name="평균 방문자" />
      </BarChart>

      {/* ⭐ 요일별 외지인 / 현지인 BarChart */}
      <BarChart width={700} height={300} data={dayOfWeekVisitorData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />

        {/* ⭐ 외지인 */}
        <Bar dataKey="visitor" stackId="a" fill="#ff7f50" name="외지인" />

        {/* ⭐ 현지인 */}
        <Bar dataKey="resident" stackId="a" fill="#1e90ff" name="현지인" />
      </BarChart>

      {/* 요일 분석 */}
      {dayOfWeekAnalysis && (
        <div className="day-summary">
          <p>
            최대 방문 요일: {dayOfWeekAnalysis.maxDay.day} (
            {dayOfWeekAnalysis.maxDay.avg.toLocaleString()}명)
          </p>
          <p>
            최소 방문 요일: {dayOfWeekAnalysis.minDay.day} (
            {dayOfWeekAnalysis.minDay.avg.toLocaleString()}명)
          </p>
          <p>
            주말 평균 방문자: {dayOfWeekAnalysis.weekendAvg.toLocaleString()}명
          </p>
          <p>
            평일 평균 방문자: {dayOfWeekAnalysis.weekdayAvg.toLocaleString()}명
          </p>
        </div>
      )}
      {/* 요일별 방문자 순위 */}
      {dayRanking && dayRanking.length > 0 && (
        <div className="day-ranking">
          <h4>요일별 방문자 순위</h4>
          {dayRanking.map((item) => (
            <p key={item.day}>
              {item.rank}위: {item.day} ({item.avg.toLocaleString()}명)
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart3;
