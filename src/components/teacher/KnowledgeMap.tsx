"use client";

const KMAP_DATA = [
  { label: "指针与内存理解薄弱", pct: 28, color: "#ef4444" },
  { label: "数组越界访问", pct: 20, color: "#f59e0b" },
  { label: "Make 依赖与路径配置", pct: 16, color: "#3b82f6" },
  { label: "NPE 空指针异常", pct: 14, color: "#8b5cf6" },
  { label: "Flexbox 布局对齐", pct: 11, color: "#06b6d4" },
  { label: "SQL JOIN 性能优化", pct: 11, color: "#10b981" },
];

export function KnowledgeMap() {
  return (
    <div style={{ background: "var(--cm-surface)", border: "1px solid var(--cm-border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: "1.05rem", fontWeight: 700 }}>📌 高频卡点知识图谱</h3>
      {KMAP_DATA.map((item) => (
        <div className="cm-kmap-bar" key={item.label}>
          <span className="cm-kmap-label">{item.label}</span>
          <div className="cm-kmap-track">
            <div
              className="cm-kmap-fill"
              style={{ width: `${item.pct * 3}%`, background: item.color }}
            />
          </div>
          <span className="cm-kmap-pct">{item.pct}%</span>
        </div>
      ))}
    </div>
  );
}
