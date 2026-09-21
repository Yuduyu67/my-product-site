"use client";

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

const STATUS_MAP = {
  resolved: { label: "已解决", cls: "cm-tag-success" },
  pending: { label: "进行中", cls: "cm-tag-warning" },
};

export function SessionTable() {
  return (
    <div style={{ background: "var(--cm-surface)", border: "1px solid var(--cm-border)", borderRadius: 14, padding: 24, overflowX: "auto" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: "1.05rem", fontWeight: 700 }}>📋 学生会话历史审计</h3>
      <table className="cm-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>课程</th>
            <th>卡点问题</th>
            <th>自主探索指数</th>
            <th>交互轮次</th>
            <th>状态</th>
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
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2e8f0", overflow: "hidden" }}>
                      <div style={{ width: `${s.autonomy}%`, height: "100%", borderRadius: 4, background: s.autonomy >= 70 ? "var(--cm-success)" : s.autonomy >= 50 ? "var(--cm-warning)" : "var(--cm-error)" }} />
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{s.autonomy}%</span>
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
  );
}
