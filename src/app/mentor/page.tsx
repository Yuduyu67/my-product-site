"use client";

import Link from "next/link";
import { SCENES } from "@/components/mentor/scenes";

const LANG_ENTRIES = [
  { lang: "Python", scenes: SCENES.python, href: "/python3", badge: "Py", color: "#2a6d41" },
  { lang: "Java", scenes: SCENES.java, href: "/java", badge: "J", color: "#b84122" },
  { lang: "C/C++", scenes: SCENES.cpp, href: "/c", badge: "C", color: "#4a63d1" },
  { lang: "JavaScript", scenes: SCENES.javascript, href: "/js", badge: "JS", color: "#d99b00" },
  { lang: "HTML/CSS", scenes: SCENES.htmlcss, href: "/html", badge: "H", color: "#d05638" },
  { lang: "MySQL", scenes: SCENES.mysql, href: "/mysql", badge: "M", color: "#ef8c00" },
  { lang: "PHP", scenes: SCENES.php, href: "/php", badge: "P", color: "#6a7ec7" },
];

export default function MentorPage() {
  return (
    <div className="cm-min-h-screen">
      <div className="cm-bg-orbs" />
      <main style={{ position: "relative", zIndex: 1 }}>
        <section className="cm-hero">
          <div className="cm-container">
            <span className="cm-hero-badge anim-reveal" style={{ "--d": "0.05s" } as React.CSSProperties}>通用实验舱</span>
            <h1 className="headline-reveal"><span className="headline-line">选择语言与实验场景</span></h1>
            <p>从下方 7 种语言中选择你的实验环境，每种语言都有专属的 Socratic 对话式排错引导。</p>
          </div>
        </section>
        <section className="cm-container" style={{ padding: "20px 0 60px" }}>
          {LANG_ENTRIES.map((entry) => (
            <div key={entry.lang} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: entry.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800 }}>{entry.badge}</span>
                {entry.lang}
                <span style={{ fontSize: "0.8rem", color: "var(--cm-text-muted)", fontWeight: 400 }}>({entry.scenes.length} 个预设场景)</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {entry.scenes.map((scene) => (
                  <Link key={scene.id} href={entry.href} className="cm-glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 70, cursor: "pointer" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: 4 }}>{scene.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--cm-text-muted)" }}>{scene.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
