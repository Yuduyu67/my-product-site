"use client";

const STATS = [
  { label: "今日答疑次数", value: "47", icon: "💬" },
  { label: "平均解决轮次", value: "3.2", icon: "🔄" },
  { label: "班级诚信指数", value: "89%", icon: "🛡️" },
  { label: "活跃率", value: "76%", icon: "👥" },
];

export function StatsCards() {
  return (
    <div className="cm-stats-row">
      {STATS.map((s) => (
        <div key={s.label} className="cm-stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{s.icon}</div>
          <div className="cm-stat-value">{s.value}</div>
          <div className="cm-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
