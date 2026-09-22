"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ensureRole } from "@/lib/supabase/role";
import Link from "next/link";

type Mode = "signin" | "signup";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();
  const isOffline = !supabase;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isOffline) {
      setError("认证服务未配置。请在 .env.local 中填入 Supabase 密钥后再使用登录功能。");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        const roleCheck = await ensureRole(supabase, "teacher");
        if (!roleCheck.ok) {
          setError(roleCheck.message ?? "登录失败");
          return;
        }
        setSuccess("登录成功，正在进入教师看板…");
        setTimeout(() => router.push("/teacher"), 800);
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        if (data.session) {
          const roleCheck = await ensureRole(supabase, "teacher");
          if (!roleCheck.ok) {
            setError(roleCheck.message ?? "注册失败");
            return;
          }
        }
        setSuccess("注册成功！请使用教师身份登录。");
        setMode("signin");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cm-min-h-screen cm-flex-center">
      <div className="cm-glass-card" style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/teacher" style={{ display: "inline-block", marginBottom: 16 }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--cm-text)" }}>
              CodeMentor<span style={{ color: "var(--cm-primary)" }}>.ai</span>
            </span>
          </Link>
          <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--cm-text)" }}>
            {mode === "signin" ? "教师看板登录" : "创建教师账号"}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "var(--cm-text-muted)" }}>
            {mode === "signin" ? "还没有教师账号？" : "已有教师账号？"}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
              style={{ background: "none", border: "none", color: "var(--cm-primary)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, paddingLeft: 4 }}
            >
              {mode === "signin" ? "注册教师身份" : "去登录"}
            </button>
          </p>
        </div>

        {/* Offline banner */}
        {isOffline && (
          <div style={{
            padding: "12px 14px", borderRadius: 8,
            background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)",
            color: "#fbbf24", fontSize: "0.82rem", marginBottom: 20, textAlign: "center",
          }}>
            ⚠️ 认证服务未配置。请在 .env.local 中填入 Supabase 密钥后再使用登录功能。
          </div>
        )}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--cm-border)" }} />
          <span style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>教师邮箱登录</span>
          <div style={{ flex: 1, height: 1, background: "var(--cm-border)" }} />
        </div>

        {/* Email / Password form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, color: "var(--cm-text-muted)" }}>邮箱</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid var(--cm-border)", background: "rgba(255,255,255,0.04)",
                  color: "var(--cm-text)", fontSize: "0.9rem", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, color: "var(--cm-text-muted)" }}>密码</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid var(--cm-border)", background: "rgba(255,255,255,0.04)",
                  color: "var(--cm-text)", fontSize: "0.9rem", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "0.82rem" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontSize: "0.82rem" }}>
                {success}
              </div>
            )}

            <button
              className="cm-btn-glow"
              type="submit"
              disabled={loading || isOffline}
              style={{ marginTop: 4 }}
            >
              {loading ? "处理中…" : mode === "signin" ? "登 录" : "注册教师身份"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>
          教师账号与学生账号不通用：同一邮箱只能持有一种身份。
        </p>
      </div>
    </div>
  );
}
