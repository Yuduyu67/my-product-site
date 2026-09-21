"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const LANGS = [
  { label: "Python", href: "/python3" },
  { label: "Java", href: "/java" },
  { label: "C/C++", href: "/c" },
  { label: "JS", href: "/js" },
  { label: "HTML/CSS", href: "/html" },
];

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Don't show auth buttons while still checking login state
  if (loading) {
    return null; // will re-render after auth check
  }

  return (
    <>
      <header className="cm-header">
        <div className="cm-header-inner">
          {/* Logo */}
          <Link className="cm-logo" href="/">
            ⚡
          </Link>

          {/* Nav Pill */}
          <nav className="cm-nav-pill" aria-label="主导航">
            {LANGS.map((lang) => (
              <Link key={lang.href} href={lang.href} className="cm-nav-link">
                {lang.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Teacher link + Auth buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link className="cm-btn-signin" href="/teacher">
              📊 教师看板
            </Link>

            {user ? (
              <>
                <span style={{ fontSize: "0.82rem", color: "var(--cm-text-muted)", marginRight: 4 }}>
                  {user.email?.split("@")[0]}
                </span>
                <button
                  className="cm-btn-glass cm-btn-sm"
                  onClick={() => signOut()}
                  style={{ padding: "6px 14px", borderRadius: 8 }}
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link className="cm-btn-glow" href="/signin" style={{ fontSize: "0.85rem", padding: "8px 20px" }}>
                登录 / 注册
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="cm-mobile-toggle"
            aria-label="切换菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`cm-mobile-overlay ${menuOpen ? "visible" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile menu */}
      <nav className={`cm-mobile-menu ${menuOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="移动导航">
        <Link className="cm-mobile-link" href="/" onClick={() => setMenuOpen(false)}>首页</Link>
        <Link className="cm-mobile-link" href="/mentor" onClick={() => setMenuOpen(false)}>通用实验舱</Link>
        <Link className="cm-mobile-link" href="/teacher" onClick={() => setMenuOpen(false)}>教师看板</Link>
        {LANGS.map((lang) => (
          <Link key={lang.href} className="cm-mobile-link" href={lang.href} onClick={() => setMenuOpen(false)}>
            {lang.label} 排错舱
          </Link>
        ))}
        {user && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--cm-border)" }}>
            <div style={{ fontSize: "0.85rem", marginBottom: 10 }}>已登录: <strong style={{ color: "var(--cm-primary)" }}>{user.email}</strong></div>
            <button className="cm-btn-glass cm-btn-sm" onClick={() => { signOut(); setMenuOpen(false); }} style={{ width: "100%" }}>退出登录</button>
          </div>
        )}
      </nav>
    </>
  );
}
