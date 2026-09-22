"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createClient } from "@/lib/supabase/client";

type ExchangeRow = {
  id: string;
  user_id: string;
  language: string;
  student_message: string;
  ai_message: string;
  created_at: string;
};

type ProfileRow = {
  user_id: string;
  email: string;
  role: string;
};

const LANG_COLORS: Record<string, string> = {
  Python: "#34d399",
  Java: "#fbbf24",
  "C/C++": "#818cf8",
  JavaScript: "#22d3ee",
  "HTML/CSS": "#a78bfa",
  MySQL: "#f472b6",
  PHP: "#fb923c",
};

const REFRESH_INTERVAL_MS = 5000; // 5 秒刷新一次

interface DashboardData {
  totalExchanges: number;
  registeredStudents: number;
  activeStudents: number;
  langBars: { label: string; count: number; pct: number; color: string }[];
  rows: ExchangeRow[];
  emailOf: Map<string, string>;
}

type RoleState = "wrong-role" | "teacher";

interface RoleInfo {
  userId: string;
  state: RoleState;
}

export default function TeacherDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("—");
  const [nextRefresh, setNextRefresh] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [prevRowCount, setPrevRowCount] = useState<number>(-1);

  const phase: "anonymous" | "checking" | RoleState =
    !authLoading && (!user || !supabase) ? "anonymous"
    : user && roleInfo?.userId === user.id ? roleInfo.state
    : "checking";

  // Gate once, then keep polling
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (authLoading || !user || !supabase) return;
    let cancelled = false;

    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if ((profile as { role: string } | null)?.role !== "teacher") {
        setRoleInfo({ userId: user.id, state: "wrong-role" });
        return;
      }
      setRoleInfo({ userId: user.id, state: "teacher" });
      setAuthenticated(true);
    })();

    return () => { cancelled = true; };
  }, [user, authLoading, supabase]);

  // Reload helper
  const reload = useMemo(() => {
    return async () => {
      if (!supabase || !user) return;

      // 获取当前用户的 session 并设置到客户端（解决 RLS 拦截问题）
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) return;
      await supabase.auth.setSession(session.session);

      const [exchangesRes, profilesRes, countRes] = await Promise.all([
        supabase
          .from("conversations")
          .select("id, user_id, language, student_message, ai_message, created_at")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase.from("profiles").select("user_id, email, role"),
        supabase.from("conversations").select("*", { count: "exact", head: true }),
      ]);

      const rows = (exchangesRes.data ?? []) as ExchangeRow[];
      const profiles = (profilesRes.data ?? []) as ProfileRow[];
      const emailOf = new Map(profiles.map((p) => [p.user_id, p.email]));

      const langCounts = new Map<string, number>();
      for (const row of rows) {
        langCounts.set(row.language, (langCounts.get(row.language) ?? 0) + 1);
      }
      const maxCount = Math.max(1, ...langCounts.values());
      const langBars = [...langCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({
          label,
          count,
          pct: Math.round((count / maxCount) * 100),
          color: LANG_COLORS[label] ?? "#818cf8",
        }));

      setData({
        totalExchanges: countRes.count ?? rows.length,
        registeredStudents: profiles.filter((p) => p.role === "student").length,
        activeStudents: new Set(rows.map((r) => r.user_id)).size,
        langBars,
        rows,
        emailOf,
      });
      const now = new Date();
      setLastUpdated(
        now.toLocaleString("zh-CN", {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        })
      );
      const nowMs = Date.now();
      setNextRefresh(Math.round((nowMs + REFRESH_INTERVAL_MS) / 1000));
    };
  }, [supabase, user]);

  // Initial load + gate
  useEffect(() => {
    if (!authenticated || !supabase || !user) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  // Auto-refresh loop
  useEffect(() => {
    if (!authenticated || !autoRefresh) return;
    const id = window.setInterval(async () => {
      if (Date.now() >= nextRefresh * 1000) {
        await reload();
      }
    }, 1000);
    return () => { window.clearInterval(id); };
  }, [authenticated, autoRefresh, nextRefresh, reload]);

  // Detect new rows (visual pulse)
  const hasNewRows = data && prevRowCount >= 0 && data.rows.length > prevRowCount;
  useEffect(() => {
    if (data) setPrevRowCount(data.rows.length);
  }, [data]);

  if (phase === "checking") {
    // 认证状态还在确定中（authLoading=true 或 user 还未设置）
    return (
      <div className="cm-min-h-screen cm-flex-center">
        <div style={{ color: "var(--cm-text-muted)" }}>加载中…</div>
      </div>
    );
  }

  if (phase === "anonymous") {
    // 未登录
    return (
      <div className="cm-min-h-screen">
        <div className="cm-bg-orbs" />
        <main style={{ position: "relative", zIndex: 1 }}>
          <section style={{ padding: "28px 0 16px" }}>
            <div className="cm-container">
              <div className="cm-glass-card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>🔐</div>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>教师看板需要教师账号登录</h2>
                <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "var(--cm-text-muted)" }}>
                  教师账号与学生账号不通用：同一邮箱只能持有一种身份。
                </p>
                <Link href="/teacher/login" className="cm-btn-glow" style={{ display: "inline-block" }}>
                  登录 / 注册教师身份
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (phase === "wrong-role") {
    // 已登录，但是学生账号
    return (
      <div className="cm-min-h-screen">
        <div className="cm-bg-orbs" />
        <main style={{ position: "relative", zIndex: 1 }}>
          <section style={{ padding: "28px 0 16px" }}>
            <div className="cm-container">
              <div className="cm-glass-card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>🧑‍🎓</div>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>当前登录的是学生账号</h2>
                <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "var(--cm-text-muted)" }}>
                  教师看板仅对教师账号开放。请改用教师账号登录（会切换当前登录状态）。
                </p>
                <Link href="/teacher/login" className="cm-btn-glow" style={{ display: "inline-block" }}>
                  切换教师账号登录
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // phase === "teacher"，数据加载中
  if (!data) {
    return (
      <div className="cm-min-h-screen cm-flex-center">
        <div style={{ color: "var(--cm-text-muted)" }}>正在加载教师数据…</div>
      </div>
    );
  }

  // Live teacher view - data is guaranteed to be loaded at this point
  const secondsUntilNext = Math.max(0, Math.ceil(nextRefresh - Math.floor(Date.now() / 1000)));

  return (
    <div className="cm-min-h-screen">
      <div className="cm-bg-orbs" />
      <main style={{ position: "relative", zIndex: 1 }}>
        <section style={{ padding: "28px 0 16px" }}>
          <div className="cm-container">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "inline-block", width: 6, height: 28, background: "var(--cm-gradient)", borderRadius: 3 }} />
                  📊 教师端学情看板
                </h1>
                <p style={{ color: "var(--cm-text-muted)", margin: "6px 0 0", fontSize: "0.9rem" }}>
                  实时聚合全体学生的真实答疑记录，每 5 秒自动刷新。
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.8rem" }}>
                <span style={{ color: "var(--cm-text-muted)", whiteSpace: "nowrap" }}>
                  <span style={{ color: "var(--cm-text)" }}>{lastUpdated}</span> · 下一刷新 <span style={{ color: "var(--cm-primary)" }}>{secondsUntilNext}s</span>
                </span>
                <button
                  onClick={() => reload()}
                  style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid var(--cm-border)", background: "rgba(255,255,255,0.04)", color: "var(--cm-text)", cursor: "pointer", fontSize: "0.8rem" }}
                  title="手动刷新"
                >
                  🔄 立即刷新
                </button>
                <button
                  onClick={() => setAutoRefresh((a) => !a)}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "1px solid var(--cm-border)",
                    background: autoRefresh ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)",
                    color: autoRefresh ? "var(--cm-success)" : "var(--cm-text)",
                    cursor: "pointer", fontSize: "0.8rem",
                  }}
                  title="切换自动刷新"
                >
                  {autoRefresh ? "⏱ 自动刷新 ON" : " 自动刷新 OFF"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="cm-stats-row">
              <div className="cm-stat-card">
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>💬</div>
                <div className="cm-stat-value">{data.totalExchanges}</div>
                <div className="cm-stat-label">累计答疑轮次</div>
              </div>
              <div className="cm-stat-card">
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>🎓</div>
                <div className="cm-stat-value">{data.registeredStudents}</div>
                <div className="cm-stat-label">注册学生数</div>
              </div>
              <div className="cm-stat-card">
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>👥</div>
                <div className="cm-stat-value">{data.activeStudents}</div>
                <div className="cm-stat-label">提问学生数</div>
              </div>
              <div className="cm-stat-card">
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>🧩</div>
                <div className="cm-stat-value">{data.langBars.length}</div>
                <div className="cm-stat-label">被提问语言数</div>
              </div>
            </div>

            {/* Language heat */}
            <div className="cm-glass-card" style={{ marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "1.05rem", fontWeight: 700 }}>📌 各语言答疑热度（最近 200 轮）</h3>
              {data.langBars.length === 0 && (
                <p style={{ color: "var(--cm-text-muted)", fontSize: "0.85rem" }}>暂无答疑记录。学生开始提问后，这里会实时出现统计。</p>
              )}
              {data.langBars.map((item) => (
                <div className="cm-kmap-bar" key={item.label}>
                  <span className="cm-kmap-label">{item.label}</span>
                  <div className="cm-kmap-track">
                    <div className="cm-kmap-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                  <span className="cm-kmap-pct">{item.count} 轮</span>
                </div>
              ))}
            </div>

            {/* Live exchange list */}
            <div className="cm-glass-card" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>📋 实时答疑记录</span>
                  {hasNewRows && (
                    <span style={{
                      padding: "2px 8px", borderRadius: 10, fontSize: "0.7rem",
                      background: "rgba(52,211,153,0.15)", color: "var(--cm-success)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      animation: "cm-pulse 1.5s ease-in-out 2",
                    }}>
                      + 有新数据
                    </span>
                  )}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>
                  共 {data.rows.length} 条 · 点击展开对话详情
                </span>
              </div>

              {data.rows.length === 0 ? (
                <p style={{ color: "var(--cm-text-muted)", fontSize: "0.85rem", padding: "16px 0" }}>暂无记录。</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.rows.map((row) => {
                    const isExpanded = expandedId === row.id;
                    const email = data.emailOf.get(row.user_id) || "未知学生";
                    const time = new Date(row.created_at).toLocaleString("zh-CN");
                    return (
                      <div key={row.id} className="cm-glass-card" style={{ padding: 14, marginBottom: 0, border: "1px solid var(--cm-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: LANG_COLORS[row.language] ?? "#818cf8" }} title={row.language} />
                          <span style={{ fontWeight: 600, color: "var(--cm-text)", fontSize: "0.9rem" }}>{email}</span>
                          <span style={{ fontSize: "0.78rem", color: LANG_COLORS[row.language] ?? "#818cf8", border: `1px solid ${LANG_COLORS[row.language] ?? "#818cf8"}40`, padding: "2px 8px", borderRadius: 10 }}>
                            {row.language}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)", marginLeft: "auto" }}>{time}</span>
                        </div>
                        <div style={{ fontSize: "0.88rem", color: "var(--cm-text)", marginBottom: isExpanded ? 10 : 0 }}>
                          <strong>问：</strong>
                          <span>{row.student_message.replace(/\s+/g, " ")}</span>
                        </div>
                        {isExpanded && (
                          <div style={{
                            borderTop: "1px solid var(--cm-border)", paddingTop: 10,
                            background: "rgba(99,102,241,0.04)", borderRadius: 6, padding: 10, fontSize: "0.88rem",
                          }}>
                            <div style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)", marginBottom: 4 }}>AI 导师引导：</div>
                            <div style={{ color: "var(--cm-text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                              {row.ai_message}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : row.id)}
                          style={{
                            marginTop: 8, fontSize: "0.75rem", color: "var(--cm-primary)",
                            background: "none", border: "none", cursor: "pointer", padding: 0,
                          }}
                        >
                          {isExpanded ? "收起对话" : "展开对话详情 ↓"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="cm-footer">
        <div className="cm-container">CodeMentor AI &copy; 2026 — 授人以渔 · 苏格拉底式启发教学平台</div>
      </footer>
    </div>
  );
}
