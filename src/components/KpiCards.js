import React from "react";

function fmt(n) {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

function pct(n) {
  if (n == null) return "—";
  return (n * 100).toFixed(2) + "%";
}

export default function KpiCards({ data }) {
  const totalReach = data.reduce((s, p) => s + p.reach, 0);
  const totalEngagement = data.reduce((s, p) => s + p.postEngagement, 0);
  const totalClicks = data.reduce((s, p) => s + p.clicks, 0);
  const totalShares = data.reduce((s, p) => s + p.shares, 0);
  const avgEngRate =
    data.length > 0
      ? data.reduce((s, p) => s + p.engagementRate, 0) / data.length
      : 0;

  const cards = [
    { label: "Total Posts", value: fmt(data.length), icon: "📝" },
    { label: "Total Reach", value: fmt(totalReach), icon: "📣" },
    { label: "Total Engagement", value: fmt(totalEngagement), icon: "👍" },
    { label: "Total Clicks", value: fmt(totalClicks), icon: "🖱️" },
    { label: "Total Shares", value: fmt(totalShares), icon: "🔗" },
    { label: "Avg Engagement Rate", value: pct(avgEngRate), icon: "📊" },
  ];

  return (
    <div className="kpi-row">
      {cards.map((c) => (
        <div className="kpi-card" key={c.label}>
          <span className="kpi-icon">{c.icon}</span>
          <div>
            <p className="kpi-value">{c.value}</p>
            <p className="kpi-label">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
