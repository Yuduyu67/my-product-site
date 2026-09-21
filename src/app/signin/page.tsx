"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();
  const isOffline = !supabase;

  async function handleSubmit(e: React.FormEvent) {
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
        setSuccess("登录成功，正在跳转…");
        setTimeout(() => router.push("/mentor"), 1000);
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        setSuccess(
          mode === "signup"
            ? "注册成功！请检查邮箱完成验证（如已配置）后登录。"
            : "注册成功！"
        );
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
          <Link href="/" style={{ display: "inline-block", marginBottom: 16 }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--cm-text)" }}>
              CodeMentor<span style={{ color: "var(--cm-primary)" }}>.ai</span>
            </span>
          </Link>
          <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--cm-text)" }}>
            {mode === "signin" ? "登录你的账号" : "创建新账号"}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "var(--cm-text-muted)" }}>
            {mode === "signin"
              ? "还没有账号？"
              : "已有账号？"}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
              style={{ background: "none", border: "none", color: "var(--cm-primary)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, paddingLeft: 4 }}
            >
              {mode === "signin" ? "免费注册" : "登录"}
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
            ⚠️ 认证服务未配置。网站可正常浏览，登录/注册功能需要配置 Supabase 后才能使用。
          </div>
        )}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--cm-border)" }} />
          <span style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>邮箱登录</span>
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
                placeholder="you@example.com"
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
              {loading ? "处理中…" : mode === "signin" ? "登 录" : "注 册"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>
          使用即表示同意我们的<a href="#" style={{ color: "var(--cm-primary)" }}>服务条款</a>和<a href="#" style={{ color: "var(--cm-primary)" }}>隐私政策</a>
        </p>
      </div>
    </div>
  );
}
