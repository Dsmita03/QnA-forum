"use client"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";

// Example chart data (replace with your real data)
const questionsPerDay = [
  { date: "Jul 20", value: 54 },
  { date: "Jul 21", value: 77 },
  { date: "Jul 22", value: 40 },
  { date: "Jul 23", value: 79 },
  { date: "Jul 24", value: 99 },
  { date: "Jul 25", value: 120 },
];

const answersTrend = [
  { date: "Jul 20", value: 60 },
  { date: "Jul 21", value: 80 },
  { date: "Jul 22", value: 45 },
  { date: "Jul 23", value: 85 },
  { date: "Jul 24", value: 100 },
  { date: "Jul 25", value: 115 },
];

// Bar Chart for Questions Per Day
export function QuestionsPerDayChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={questionsPerDay}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#FDBA74" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Line Chart for Answers Trend
export function AnswersTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={answersTrend}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend verticalAlign="top" height={32} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F59E42"
          strokeWidth={3}
          dot={{ r: 6, fill: "#F59E42" }}
          activeDot={{ r: 10, fill: "#F59E42" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
