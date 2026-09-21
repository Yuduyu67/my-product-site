import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "本地书签", "搜索"];

const sidebarItems = [
  "CSS 简介",
  "CSS 语法",
  "CSS 选择器",
  "CSS 颜色",
  "CSS 字体",
  "CSS 边框",
  "CSS 盒模型",
  "CSS 布局",
  "CSS 伪类",
  "CSS 动画",
  "CSS 响应式",
  "CSS 工具类",
];

export function CssTutorialPage() {
  return (
    <div className="python-page">
      <header className="python-header">
        <div className="python-shell">
          <div className="python-topbar">
            <Link className="logo-link" href="/" aria-label="菜鸟教程首页">
              菜鸟教程
            </Link>
            <button className="menu-button" type="button" aria-label="菜单">
              ☰
            </button>
            <label className="python-search" aria-label="搜索">
              <span className="search-mark">⌕</span>
              <input type="text" placeholder="搜索……" readOnly aria-label="搜索内容" />
            </label>
          </div>

          <nav className="python-tabs" aria-label="主导航">
            {tabItems.map((item) => (
              <Link key={item} href={item === "首页" ? "/" : item === "HTML" ? "/html" : item === "CSS" ? "/css" : item === "JS" ? "/js" : "/"}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="python-shell python-main">
        <div className="python-layout">
          <aside className="python-sidebar">
            <div className="sidebar-title">CSS 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/css">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">Style</span>
              <h1>CSS 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">CSS</div>
              <div>
                <p>
                  CSS（Cascading Style Sheets）用于控制网页的布局、颜色、字体和视觉反馈。它让页面从“内容堆叠”变成真正的设计作品。
                </p>
                <p>
                  你也可以点击 <Link href="/css">CSS 选择器</Link> 继续学习页面样式与布局控制。
                </p>
              </div>
            </div>

            <section>
              <h2>CSS 是什么</h2>
              <p>
                CSS 通过选择器匹配元素，再应用属性值来改变外观。常见属性包括 color、background、margin、padding、display 和 animation。
              </p>
              <pre className="code-block">{`h1 { color: #2d7d4a; font-size: 2rem; }`}</pre>
            </section>

            <section>
              <h2>基础示例</h2>
              <div className="code-panel">
                <h3>style.css</h3>
                <pre className="code-block">{`body {
  background: #f5f5f3;
  font-family: sans-serif;
}

.card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}`}</pre>
                <Link href="/css" className="run-link">
                  运行实例 »
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
