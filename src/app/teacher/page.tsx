"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  target: number;
  decimals?: number;
  suffix?: string;
}

function CountUp({ target, decimals = 0, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let start: number | null = null;
    let raf: number;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !start) {
          start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start!) / 1800, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            ref.current!.textContent = (ease * target).toFixed(decimals) + suffix;
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [target, decimals, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const STATS = [
  { label: "今日答疑次数", value: 47, icon: "💬" },
  { label: "平均解决轮次", value: 3.2, decimals: 1, icon: "🔄" },
  { label: "班级诚信指数", value: 89, suffix: "%", icon: "🛡️" },
  { label: "活跃率", value: 76, suffix: "%", icon: "👥" },
];

const KMAP_DATA = [
  { label: "指针与内存理解薄弱", pct: 28, color: "#f87171" },
  { label: "数组越界访问", pct: 20, color: "#fbbf24" },
  { label: "Make 依赖与路径配置", pct: 16, color: "#818cf8" },
  { label: "NPE 空指针异常", pct: 14, color: "#a78bfa" },
  { label: "Flexbox 布局对齐", pct: 11, color: "#22d3ee" },
  { label: "SQL JOIN 性能优化", pct: 11, color: "#34d399" },
];

const SESSIONS = [
  { name: "张三", course: "C语言实验", issue: "Segmentation Fault", autonomy: 85, rounds: 4, status: "resolved" as const },
  { name: "李四", course: "Java OOP", issue: "NullPointerException", autonomy: 70, rounds: 5, status: "resolved" as const },
  { name: "王五", course: "Python基础", issue: "KeyError 字典调试", autonomy: 60, rounds: 3, status: "resolved" as const },
  { name: "赵六", course: "C语言实验", issue: "Makefile 编译依赖", autonomy: 45, rounds: 7, status: "pending" as const },
  { name: "孙七", course: "JavaScript", issue: "闭包作用域混淆", autonomy: 75, rounds: 4, status: "resolved" as const },
  { name: "周八", course: "MySQL", issue: "JOIN 查询性能慢", autonomy: 55, rounds: 6, status: "pending" as const },
  { name: "吴九", course: "HTML/CSS", issue: "Flexbox 垂直居中", autonomy: 90, rounds: 2, status: "resolved" as const },
  { name: "郑十", course: "PHP开发", issue: "Session Undefined", autonomy: 50, rounds: 5, status: "pending" as const },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  resolved: { label: "已解决", cls: "cm-tag-success" },
  pending: { label: "进行中", cls: "cm-tag-warning" },
};

export default function TeacherDashboardPage() {
  return (
    <div className="cm-min-h-screen">
      <div className="cm-bg-orbs" />
      <main style={{ position: "relative", zIndex: 1 }}>
        <section style={{ padding: "28px 0 16px" }}>
          <div className="cm-container">
            <h1 className="headline-reveal" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", marginBottom: 6 }}>
              📊 教师端学情看板
            </h1>
            <p style={{ color: "var(--cm-text-muted)", marginBottom: 24 }}>自动聚合班级高频卡点知识图谱，精准标注学生学习薄弱环节</p>

            {/* Stats */}
            <div className="cm-stats-row">
              {STATS.map((s) => (
                <div key={s.label} className="cm-stat-card">
                  <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{s.icon}</div>
                  <div className="cm-stat-value"><CountUp target={s.value} decimals={(s.decimals ?? 0) as number} suffix={typeof s.suffix === "string" ? s.suffix : ""} /></div>
                  <div className="cm-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Knowledge Map */}
            <div className="cm-glass-card" style={{ marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "1.05rem", fontWeight: 700 }}>📌 高频卡点知识图谱</h3>
              {KMAP_DATA.map((item) => (
                <div className="cm-kmap-bar" key={item.label}>
                  <span className="cm-kmap-label">{item.label}</span>
                  <div className="cm-kmap-track">
                    <div className="cm-kmap-fill" style={{ width: `${item.pct * 3}%`, background: item.color }} />
                  </div>
                  <span className="cm-kmap-pct">{item.pct}%</span>
                </div>
              ))}
            </div>

            {/* Session Table */}
            <div className="cm-glass-card" style={{ overflowX: "auto" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1.05rem", fontWeight: 700 }}>📋 学生会话历史审计</h3>
              <table className="cm-table">
                <thead>
                  <tr>
                    <th>姓名</th><th>课程</th><th>卡点问题</th><th>自主探索指数</th><th>交互轮次</th><th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {SESSIONS.map((s) => {
                    const st = STATUS_MAP[s.status];
                    return (
                      <tr key={s.name}>
                        <td>{s.name}</td>
                        <td>{s.course}</td>
                        <td>{s.issue}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                              <div style={{ width: `${s.autonomy}%`, height: "100%", borderRadius: 4, background: s.autonomy >= 70 ? "var(--cm-success)" : s.autonomy >= 50 ? "var(--cm-warning)" : "var(--cm-error)" }} />
                            </div>
                            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{s.autonomy}%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>{s.rounds}</td>
                        <td><span className={`cm-tag ${st.cls}`}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <footer className="cm-footer">
        <div className="cm-container">CodeMentor AI &copy; 2025 — 授人以渔 · 苏格拉底式启发教学平台</div>
      </footer>
    </div>
  );
}
