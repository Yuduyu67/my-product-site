"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TutorialItem = {
  title: string;
  keyword: string;
  href: string;
  route?: string;
  palette: [string, string];
  badge: string;
};

type TutorialGroup = {
  title: string;
  items: TutorialItem[];
};

const tutorialGroups: TutorialGroup[] = [
  {
    title: "Python / 数据科学",
    items: [
      { title: "【学习 Python】", keyword: "Python3", href: "/python3", route: "/python3", palette: ["#2a6d41", "#7db996"], badge: "Py" },
      { title: "【学习 Python2.x】", keyword: "Python", href: "/python3", route: "/python3", palette: ["#1d7d58", "#7ac9a7"], badge: "Py" },
      { title: "【学习 FastAPI】", keyword: "FastAPI", href: "https://www.runoob.com/fastapi/fastapi-tutorial.html", palette: ["#1d9b9b", "#61d5d5"], badge: "F" },
      { title: "【学习 Flask】", keyword: "Flask", href: "https://www.runoob.com/flask/flask-tutorial.html", palette: ["#4e88e8", "#8bb5ff"], badge: "Fl" },
      { title: "【学习 Django】", keyword: "Django", href: "https://www.runoob.com/django/django-tutorial.html", palette: ["#1d4b2e", "#7ca98b"], badge: "Dj" },
      { title: "【学习 NumPy】", keyword: "NumPy", href: "https://www.runoob.com/numpy/numpy-tutorial.html", palette: ["#0f7b6e", "#83d6d2"], badge: "N" },
      { title: "【学习 Pandas】", keyword: "Pandas", href: "https://www.runoob.com/pandas/pandas-tutorial.html", palette: ["#2f6bdb", "#7aafff"], badge: "Pd" },
      { title: "【学习 SciPy】", keyword: "SciPy", href: "https://www.runoob.com/scipy/scipy-tutorial.html", palette: ["#5d6fdd", "#9db5ff"], badge: "Sc" },
      { title: "【学习 Matplotlib】", keyword: "Matplotlib", href: "https://www.runoob.com/matplotlib/matplotlib-tutorial.html", palette: ["#ac6f1f", "#f4c16a"], badge: "M" },
      { title: "【学习 Dash】", keyword: "Dash", href: "https://www.runoob.com/dash/dash-tutorial.html", palette: ["#0d5469", "#4ec0d3"], badge: "D" },
      { title: "【学习 Jupyter Notebook】", keyword: "Jupyter", href: "https://www.runoob.com/jupyter-notebook/jupyter-notebook-tutorial.html", palette: ["#d77834", "#ffbf73"], badge: "J" },
      { title: "【学习 Pillow】", keyword: "Pillow", href: "https://www.runoob.com/pillow/pillow-tutorial.html", palette: ["#5166bf", "#98aaf7"], badge: "P" },
      { title: "【量化交易】", keyword: "Qt", href: "https://www.runoob.com/qt/qt-tutorial.html", palette: ["#3c5d8d", "#8eb5ff"], badge: "Q" },
      { title: "【学习 R】", keyword: "R", href: "https://www.runoob.com/r/r-tutorial.html", palette: ["#1f7bc2", "#79b8ff"], badge: "R" },
      { title: "【学习 Julia】", keyword: "Julia", href: "https://www.runoob.com/julia/julia-tutorial.html", palette: ["#6d6fd6", "#a2b1ff"], badge: "J" },
    ],
  },
  {
    title: "AI / 智能开发",
    items: [
      { title: "【AI Agent（智能体）】", keyword: "AI Agent", href: "https://www.runoob.com/ai-agent/ai-agent-tutorial.html", palette: ["#0d7d4a", "#7bd0a2"], badge: "AI" },
      { title: "【AI（人工智能）】", keyword: "AI", href: "https://www.runoob.com/ai/ai-tutorial.html", palette: ["#2b6b9b", "#7bb5ea"], badge: "AI" },
      { title: "【Codex 教程】", keyword: "Codex", href: "https://www.runoob.com/codex/codex-tutorial.html", palette: ["#5c7be7", "#9bb6ff"], badge: "C" },
      { title: "【学习 Vibe Coding】", keyword: "Vibe Coding", href: "https://www.runoob.com/vibe-coding/vibe-coding-tutorial.html", palette: ["#9a4d8d", "#d48ec7"], badge: "V" },
      { title: "【Claude Code】", keyword: "Claude", href: "https://www.runoob.com/claude-code/claude-code-tutorial.html", palette: ["#7e2c35", "#c87a7a"], badge: "Cl" },
      { title: "【OpenCode】", keyword: "OpenCode", href: "https://www.runoob.com/opencode/opencode-tutorial.html", palette: ["#9d6d27", "#f5c86a"], badge: "O" },
      { title: "【Skills（技能）】", keyword: "Skills", href: "https://www.runoob.com/skills/skills-tutorial.html", palette: ["#7e9e4c", "#bfd6a3"], badge: "Sk" },
      { title: "【学习 Ollama】", keyword: "Ollama", href: "https://www.runoob.com/ollama/ollama-tutorial.html", palette: ["#4052ab", "#9cb0ff"], badge: "O" },
      { title: "【Hermes Agent】", keyword: "Hermes", href: "https://www.runoob.com/hermes-agent/hermes-agent-tutorial.html", palette: ["#3e8768", "#8ee3b8"], badge: "H" },
      { title: "【DeepSeek Harness】", keyword: "DeepSeek", href: "https://www.runoob.com/deepseek-harness/deepseek-harness-tutorial.html", palette: ["#5e4ea0", "#a99ff9"], badge: "DS" },
      { title: "【Pi Agent】", keyword: "Pi", href: "https://www.runoob.com/pi-agent/pi-agent-tutorial.html", palette: ["#384e5f", "#7bb6d7"], badge: "Pi" },
      { title: "【AI 数学基础】", keyword: "Math", href: "https://www.runoob.com/ai-math/ai-math-tutorial.html", palette: ["#a6782d", "#e4c47f"], badge: "M" },
      { title: "【学习 TensorFlow】", keyword: "TensorFlow", href: "https://www.runoob.com/tensorflow/tensorflow-tutorial.html", palette: ["#ff8a00", "#ffc35a"], badge: "TF" },
      { title: "【学习 PyTorch】", keyword: "PyTorch", href: "https://www.runoob.com/pytorch/pytorch-tutorial.html", palette: ["#d65000", "#ffb273"], badge: "PT" },
      { title: "【学习 Scikit-learn】", keyword: "Scikit", href: "https://www.runoob.com/sklearn/sklearn-tutorial.html", palette: ["#2a7cd7", "#7abaf8"], badge: "SK" },
      { title: "【机器学习】", keyword: "ML", href: "https://www.runoob.com/ml/ml-tutorial.html", palette: ["#44454c", "#969cab"], badge: "ML" },
      { title: "【LangChain】", keyword: "LangChain", href: "https://www.runoob.com/langchain/langchain-tutorial.html", palette: ["#3b62a7", "#7ab0f0"], badge: "LC" },
      { title: "【自然语言处理 NLP】", keyword: "NLP", href: "https://www.runoob.com/nlp/nlp-tutorial.html", palette: ["#8b6e34", "#d4b96f"], badge: "NLP" },
      { title: "【学习 OpenCV】", keyword: "OpenCV", href: "https://www.runoob.com/opencv/opencv-tutorial.html", palette: ["#288a74", "#72d8c0"], badge: "CV" },
      { title: "【学习 Selenium】", keyword: "Selenium", href: "https://www.runoob.com/selenium/selenium-tutorial.html", palette: ["#7f8ae2", "#a3b5ff"], badge: "S" },
      { title: "【学习 Playwright】", keyword: "Playwright", href: "https://www.runoob.com/playwright/playwright-tutorial.html", palette: ["#2f6ecb", "#78b5ef"], badge: "P" },
    ],
  },
  {
    title: "前端开发",
    items: [
      { title: "【学习 HTML】", keyword: "HTML", href: "/html", route: "/html", palette: ["#d05638", "#f5a06f"], badge: "H" },
      { title: "【学习 HTML5】", keyword: "HTML5", href: "/html", route: "/html", palette: ["#df623d", "#f7b37f"], badge: "5" },
      { title: "【学习 CSS】", keyword: "CSS", href: "/css", route: "/css", palette: ["#3d72d1", "#8db8ff"], badge: "C" },
      { title: "【学习 CSS3】", keyword: "CSS3", href: "/css", route: "/css", palette: ["#3d6ad8", "#8bb7ff"], badge: "3" },
      { title: "【学习 JavaScript】", keyword: "JavaScript", href: "/js", route: "/js", palette: ["#d99b00", "#f7d96d"], badge: "JS" },
      { title: "【学习 HTML DOM】", keyword: "DOM", href: "https://www.runoob.com/htmldom/htmldom-tutorial.html", palette: ["#a23535", "#ff8787"], badge: "D" },
      { title: "【学习 TypeScript】", keyword: "TypeScript", href: "https://www.runoob.com/typescript/ts-tutorial.html", palette: ["#257ad5", "#88b7ff"], badge: "TS" },
      { title: "【学习 AJAX】", keyword: "AJAX", href: "https://www.runoob.com/ajax/ajax-tutorial.html", palette: ["#6d7eb4", "#a6baf7"], badge: "A" },
      { title: "【学习 JSON】", keyword: "JSON", href: "https://www.runoob.com/json/json-tutorial.html", palette: ["#b66a00", "#ebad4b"], badge: "J" },
      { title: "【学习 Tailwind CSS】", keyword: "Tailwind", href: "https://www.runoob.com/tailwindcss/tailwindcss-tutorial.html", palette: ["#0e847f", "#7ae7de"], badge: "TW" },
      { title: "【学习 Bootstrap4】", keyword: "Bootstrap4", href: "https://www.runoob.com/bootstrap4/bootstrap4-tutorial.html", palette: ["#7d43d1", "#c5a3ff"], badge: "B4" },
      { title: "【学习 Bootstrap5】", keyword: "Bootstrap5", href: "https://www.runoob.com/bootstrap5/bootstrap5-tutorial.html", palette: ["#8b52d0", "#d6b2ff"], badge: "B5" },
      { title: "【学习 Foundation】", keyword: "Foundation", href: "https://www.runoob.com/foundation/foundation-tutorial.html", palette: ["#415a8f", "#9bbaf0"], badge: "F" },
      { title: "【学习 Vue.js】", keyword: "Vue", href: "https://www.runoob.com/vue2/vue-tutorial.html", palette: ["#2f9a63", "#82d2a4"], badge: "V" },
      { title: "【学习 Vue3】", keyword: "Vue3", href: "https://www.runoob.com/vue3/vue3-tutorial.html", palette: ["#2f9467", "#89d3aa"], badge: "V3" },
      { title: "【学习 React】", keyword: "React", href: "https://www.runoob.com/react/react-tutorial.html", palette: ["#2e9adf", "#8ed3f8"], badge: "R" },
      { title: "【学习 Next.js】", keyword: "Next.js", href: "https://www.runoob.com/nextjs/nextjs-tutorial.html", palette: ["#0a0a0a", "#6d7b8b"], badge: "N" },
      { title: "【学习 AngularJS】", keyword: "AngularJS", href: "https://www.runoob.com/angularjs/angularjs-tutorial.html", palette: ["#b30f2e", "#ff8aa5"], badge: "A" },
    ],
  },
  {
    title: "后端开发",
    items: [
      { title: "【学习 Node.js】", keyword: "Node.js", href: "https://www.runoob.com/nodejs/nodejs-tutorial.html", palette: ["#1c9b4b", "#7ce7a0"], badge: "N" },
      { title: "【学习 Electron】", keyword: "Electron", href: "https://www.runoob.com/electron/electron-tutorial.html", palette: ["#5f6f8d", "#9eaec9"], badge: "E" },
      { title: "【学习 PHP】", keyword: "PHP", href: "https://www.runoob.com/php/php-tutorial.html", palette: ["#6a7ec7", "#a5b7ff"], badge: "P" },
      { title: "【学习 Java】", keyword: "Java", href: "/java", route: "/java", palette: ["#b84122", "#ee9978"], badge: "J" },
      { title: "【学习 Go】", keyword: "Go", href: "https://www.runoob.com/go/go-tutorial.html", palette: ["#2a7fd3", "#7fb4ff"], badge: "G" },
      { title: "【学习 Rust】", keyword: "Rust", href: "https://www.runoob.com/rust/rust-tutorial.html", palette: ["#a84c1d", "#edb174"], badge: "R" },
      { title: "【学习 C#】", keyword: "C#", href: "https://www.runoob.com/csharp/csharp-tutorial.html", palette: ["#3b6cd8", "#8bb5ff"], badge: "C#" },
      { title: "【学习 Kotlin】", keyword: "Kotlin", href: "https://www.runoob.com/kotlin/kotlin-tutorial.html", palette: ["#7d72d9", "#c7c0ff"], badge: "K" },
      { title: "【学习 Clojure】", keyword: "Clojure", href: "https://www.runoob.com/clojure/clojure-tutorial.html", palette: ["#4d9c5d", "#9fe3a9"], badge: "C" },
      { title: "【学习 Scala】", keyword: "Scala", href: "https://www.runoob.com/scala/scala-tutorial.html", palette: ["#9b3d8c", "#de90d0"], badge: "S" },
    ],
  },
  {
    title: "数据库",
    items: [
      { title: "【学习 SQL】", keyword: "SQL", href: "https://www.runoob.com/sql/sql-tutorial.html", palette: ["#3d8c66", "#92d5ad"], badge: "SQL" },
      { title: "【学习 MySQL】", keyword: "MySQL", href: "/mysql", route: "/mysql", palette: ["#ef8c00", "#ffc96e"], badge: "M" },
      { title: "【学习 PostgreSQL】", keyword: "PostgreSQL", href: "https://www.runoob.com/postgresql/postgresql-tutorial.html", palette: ["#2e5d7a", "#9cc8ea"], badge: "PG" },
      { title: "【学习 SQLite】", keyword: "SQLite", href: "https://www.runoob.com/sqlite/sqlite-tutorial.html", palette: ["#6f8eb6", "#b7d3ff"], badge: "S" },
      { title: "【学习 MongoDB】", keyword: "MongoDB", href: "https://www.runoob.com/mongodb/mongodb-tutorial.html", palette: ["#4aa866", "#8be3a0"], badge: "M" },
      { title: "【学习 Redis】", keyword: "Redis", href: "https://www.runoob.com/redis/redis-tutorial.html", palette: ["#d14b2b", "#f09b6c"], badge: "R" },
      { title: "【学习 Memcached】", keyword: "Memcached", href: "https://www.runoob.com/memcached/memcached-tutorial.html", palette: ["#8c4d9a", "#d4a6e4"], badge: "M" },
    ],
  },
  {
    title: "移动开发",
    items: [
      { title: "【学习 Android】", keyword: "Android", href: "https://www.runoob.com/w3cnote/android-tutorial-intro.html", palette: ["#7bb23d", "#b7dd72"], badge: "A" },
      { title: "【学习 Flutter】", keyword: "Flutter", href: "https://www.runoob.com/flutter/flutter-tutorial.html", palette: ["#3b86d8", "#8ec8ff"], badge: "F" },
      { title: "【学习 Ionic】", keyword: "Ionic", href: "https://www.runoob.com/ionic/ionic-tutorial.html", palette: ["#4d79ff", "#9ca9ff"], badge: "I" },
      { title: "【学习 jQuery Mobile】", keyword: "jQuery Mobile", href: "https://www.runoob.com/jquerymobile/jquerymobile-tutorial.html", palette: ["#d45136", "#f1a280"], badge: "JQ" },
      { title: "【学习 Swift】", keyword: "Swift", href: "https://www.runoob.com/swift/swift-tutorial.html", palette: ["#d67a00", "#f7bb5e"], badge: "S" },
      { title: "【学习 Kotlin】", keyword: "Kotlin", href: "https://www.runoob.com/kotlin/kotlin-tutorial.html", palette: ["#7d7ee5", "#abaef7"], badge: "K" },
    ],
  },
  {
    title: "DevOps / 工程化",
    items: [
      { title: "【学习 Git】", keyword: "Git", href: "https://www.runoob.com/git/git-tutorial.html", palette: ["#d3601f", "#f09d6a"], badge: "G" },
      { title: "【学习 SVN】", keyword: "SVN", href: "https://www.runoob.com/svn/svn-tutorial.html", palette: ["#2b7ba7", "#8bc8dd"], badge: "S" },
      { title: "【学习 CMake】", keyword: "CMake", href: "https://www.runoob.com/cmake/cmake-tutorial.html", palette: ["#8d6d2f", "#d5b673"], badge: "C" },
      { title: "【学习 Maven】", keyword: "Maven", href: "https://www.runoob.com/maven/maven-tutorial.html", palette: ["#8b6d42", "#d5b57a"], badge: "M" },
      { title: "【学习 VS Code】", keyword: "VS Code", href: "https://www.runoob.com/vscode/vscode-tutorial.html", palette: ["#2b7ae5", "#8ab8ff"], badge: "VS" },
      { title: "【学习 Obsidian】", keyword: "Obsidian", href: "https://www.runoob.com/obsidian/obsidian-tutorial.html", palette: ["#6f70bf", "#a7a8eb"], badge: "O" },
    ],
  },
  {
    title: "编程语言",
    items: [
      { title: "【学习 C】", keyword: "C", href: "https://www.runoob.com/c/c-tutorial.html", palette: ["#4a63d1", "#9ab1ff"], badge: "C" },
      { title: "【学习 C++】", keyword: "C++", href: "https://www.runoob.com/cplusplus/cpp-tutorial.html", palette: ["#396cc3", "#7ea8ff"], badge: "C++" },
      { title: "【学习 Zig】", keyword: "Zig", href: "https://www.runoob.com/zig/zig-tutorial.html", palette: ["#2f8d76", "#74d2b8"], badge: "Z" },
      { title: "【学习 Scala】", keyword: "Scala", href: "https://www.runoob.com/scala/scala-tutorial.html", palette: ["#9a56a7", "#d99ee3"], badge: "S" },
      { title: "【学习 Ruby】", keyword: "Ruby", href: "https://www.runoob.com/ruby/ruby-tutorial.html", palette: ["#b6282d", "#f28e94"], badge: "R" },
      { title: "【学习 Perl】", keyword: "Perl", href: "https://www.runoob.com/perl/perl-tutorial.html", palette: ["#8b4d8d", "#d292d2"], badge: "P" },
    ],
  },
  {
    title: "计算机基础",
    items: [
      { title: "【计算机组成原理】", keyword: "计算机组成原理", href: "https://www.runoob.com/computer-organization/computer-organization-tutorial.html", palette: ["#4b8a61", "#9ad0b0"], badge: "CPU" },
      { title: "【数据结构与算法】", keyword: "数据结构", href: "https://www.runoob.com/data-structures/data-structures-tutorial.html", palette: ["#6a8cc6", "#a9c3f6"], badge: "DS" },
      { title: "【设计模式】", keyword: "设计模式", href: "https://www.runoob.com/design-pattern/design-pattern-tutorial.html", palette: ["#6d5d8d", "#b6a6e8"], badge: "DP" },
      { title: "【Python 设计模式】", keyword: "设计模式", href: "https://www.runoob.com/python-design-pattern/python-design-pattern-tutorial.html", palette: ["#4c8a5f", "#8ad2a3"], badge: "Py" },
    ],
  },
  {
    title: "XML / Web Service",
    items: [
      { title: "【学习 XML】", keyword: "XML", href: "https://www.runoob.com/xml/xml-tutorial.html", palette: ["#7e7f3d", "#d5d77b"], badge: "X" },
      { title: "【学习 DTD】", keyword: "DTD", href: "https://www.runoob.com/dtd/dtd-tutorial.html", palette: ["#6e7b9d", "#acbbeb"], badge: "DTD" },
      { title: "【学习 XPath】", keyword: "XPath", href: "https://www.runoob.com/xpath/xpath-tutorial.html", palette: ["#5d7bb7", "#9ac2ff"], badge: "X" },
      { title: "【学习 XQuery】", keyword: "XQuery", href: "https://www.runoob.com/xquery/xquery-tutorial.html", palette: ["#7f558e", "#d7a4eb"], badge: "XQ" },
    ],
  },
  {
    title: ".NET",
    items: [
      { title: "【学习 ASP.NET】", keyword: "ASP.NET", href: "https://www.runoob.com/aspnet/aspnet-tutorial.html", palette: ["#7e4bc6", "#c198ff"], badge: "A" },
      { title: "【学习 MVC】", keyword: "MVC", href: "https://www.runoob.com/aspnet/mvc-intro.html", palette: ["#3a67af", "#8ac0ff"], badge: "M" },
      { title: "【学习 Razor】", keyword: "Razor", href: "https://www.runoob.com/aspnet/razor-intro.html", palette: ["#d76a3c", "#f3a27a"], badge: "R" },
      { title: "【学习 PowerShell】", keyword: "PowerShell", href: "https://www.runoob.com/powershell/powershell-tutorial.html", palette: ["#4a78c8", "#8eb8ff"], badge: "PS" },
    ],
  },
  {
    title: "网站建设",
    items: [
      { title: "【网站建设指南】", keyword: "网站建设", href: "https://www.runoob.com/web/web-buildingprimer.html", palette: ["#59856c", "#adcfbb"], badge: "Web" },
      { title: "【浏览器信息】", keyword: "浏览器", href: "https://www.runoob.com/browsers/browser-information.html", palette: ["#6d8d74", "#afc9ac"], badge: "Br" },
      { title: "【网站主机教程】", keyword: "主机", href: "https://www.runoob.com/hosting/hosting-tutorial.html", palette: ["#5f7cab", "#a9c1eb"], badge: "H" },
      { title: "【网站品质】", keyword: "品质", href: "https://www.runoob.com/quality/quality-tutorial.html", palette: ["#954d53", "#d79ea3"], badge: "Q" },
    ],
  },
];

const navItems = [
  "首页",
  "菜鸟工具",
  "菜鸟笔记",
  "参考手册",
  "用户笔记",
  "测验/考试",
  "本地书签",
];

const navFilters: Record<string, string> = {
  首页: "",
  菜鸟工具: "AI",
  菜鸟笔记: "Python",
  参考手册: "JavaScript",
  用户笔记: "HTML",
  "测验/考试": "CSS",
  本地书签: "Java",
};

export function RunoobHomePage() {
  const [searchValue, setSearchValue] = useState("");
  const [activeNav, setActiveNav] = useState("首页");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleGroups = useMemo(() => {
    const normalized = (searchValue || navFilters[activeNav] || "").trim().toLowerCase();

    return tutorialGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!normalized) return true;
          return (
            item.title.toLowerCase().includes(normalized) ||
            item.keyword.toLowerCase().includes(normalized) ||
            group.title.toLowerCase().includes(normalized)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeNav, searchValue]);

  return (
    <div className="runoob-home">
      <header className="runoob-header">
        <div className="runoob-shell runoob-brandbar">
          <Link className="brandmark" href="/" aria-label="菜鸟教程首页">
            RUNOOB.COM
          </Link>

          <button
            type="button"
            className="runoob-mobile-toggle"
            aria-label="切换导航"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            ☰
          </button>

          <label className="search-shell" aria-label="搜索">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="搜索……"
              aria-label="搜索内容"
            />
          </label>
        </div>

        <nav
          className={`runoob-nav ${mobileMenuOpen ? "is-open" : ""}`}
          aria-label="主导航"
        >
          {navItems.map((item) => (
            <Link
              key={item}
              href="/"
              title={item}
              className={activeNav === item ? "is-active" : ""}
              onClick={() => {
                const nextQuery = navFilters[item] ?? "";
                setActiveNav(item);
                setSearchValue(nextQuery);
                setMobileMenuOpen(false);
              }}
            >
              {item}
            </Link>
          ))}
        </nav>
      </header>

      <main className="runoob-shell runoob-main">
        {visibleGroups.length === 0 ? (
          <section className="tech-panel empty-panel">
            <div className="section-header">
              <span className="section-icon" aria-hidden="true">
                ≡
              </span>
              <h2>没有匹配内容</h2>
            </div>
            <p className="empty-text">试试搜索 Python、AI、HTML 或 JavaScript。</p>
          </section>
        ) : (
          visibleGroups.map((group) => (
            <section key={group.title} className="tech-panel">
              <div className="section-header">
                <span className="section-icon" aria-hidden="true">
                  ≡
                </span>
                <h2>{group.title}</h2>
              </div>
              <div className="card-grid">
                {group.items.map((item) => (
                  <a
                    className="course-card"
                    key={`${group.title}-${item.title}`}
                    href={item.route ?? item.href}
                    target={item.route ? undefined : "_blank"}
                    rel={item.route ? undefined : "noreferrer"}
                    aria-label={item.title}
                  >
                    <span
                      className="course-icon"
                      style={{
                        background: `linear-gradient(135deg, ${item.palette[0]} 0%, ${item.palette[1]} 100%)`,
                      }}
                    >
                      {item.badge}
                    </span>
                    <span className="course-title">{item.title}</span>
                  </a>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
