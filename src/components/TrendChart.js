import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, startOfMonth } from "date-fns";

export default function TrendChart({ data }) {
  const chartData = useMemo(() => {
    const buckets = new Map();

    for (const post of data) {
      if (!post.date) continue;
      const key = format(startOfMonth(post.date), "yyyy-MM");
      if (!buckets.has(key)) {
        buckets.set(key, { month: key, reach: 0, engagement: 0 });
      }
      const b = buckets.get(key);
      b.reach += post.reach;
      b.engagement += post.postEngagement;
    }

    return Array.from(buckets.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className="chart-card">
      <h3>📈 Reach &amp; Engagement Over Time</h3>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => {
              const [y, m] = v.split("-");
              return `${m}/${y.slice(2)}`;
            }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            formatter={(v) => v.toLocaleString()}
            labelFormatter={(l) => `Month: ${l}`}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="reach"
            name="Reach"
            stroke="#0071bc"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="engagement"
            name="Engagement"
            stroke="#02bfe7"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
