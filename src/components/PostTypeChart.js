import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#0071bc", "#02bfe7", "#4aa564", "#fdb81e", "#e31c3d", "#8b5cf6"];

export default function PostTypeChart({ data }) {
  const chartData = useMemo(() => {
    const buckets = new Map();

    for (const post of data) {
      const type = post.postType || "Unknown";
      if (!buckets.has(type)) {
        buckets.set(type, { type, count: 0, totalEng: 0, totalReach: 0 });
      }
      const b = buckets.get(type);
      b.count += 1;
      b.totalEng += post.postEngagement;
      b.totalReach += post.reach;
    }

    return Array.from(buckets.values())
      .map((b) => ({
        type: b.type,
        count: b.count,
        avgEngagement: b.count > 0 ? Math.round(b.totalEng / b.count) : 0,
        avgReach: b.count > 0 ? Math.round(b.totalReach / b.count) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className="chart-card">
      <h3>📊 Post Type Breakdown</h3>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="type" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{
              value: "Post Count",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{
              value: "Avg Engagement",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip formatter={(v) => v.toLocaleString()} />
          <Legend />
          <Bar yAxisId="left" dataKey="count" name="Post Count" barSize={40}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
          <Bar
            yAxisId="right"
            dataKey="avgEngagement"
            name="Avg Engagement"
            fill="#02bfe7"
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
