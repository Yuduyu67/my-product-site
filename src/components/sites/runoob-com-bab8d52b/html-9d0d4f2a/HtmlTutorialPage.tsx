import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "本地书签", "搜索"];

const sidebarItems = [
  "HTML 简介",
  "HTML 元素",
  "HTML 属性",
  "HTML 标题",
  "HTML 段落",
  "HTML 链接",
  "HTML 图像",
  "HTML 表格",
  "HTML 表单",
  "HTML 语义化",
  "HTML 多媒体",
  "HTML 5 特性",
];

export function HtmlTutorialPage() {
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
            <div className="sidebar-title">HTML 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/html">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">HTML5</span>
              <h1>HTML 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">HTML</div>
              <div>
                <p>
                  HTML 是超文本标记语言，用来定义网页的结构和内容。通过标签和属性，浏览器就能将文本、图片、链接、表格和表单等内容组织起来。
                </p>
                <p>
                  你也可以点击 <Link href="/html">HTML 基础标签</Link> 继续学习网页结构与常用元素。
                </p>
              </div>
            </div>

            <section>
              <h2>HTML 是什么</h2>
              <p>
                HTML（HyperText Markup Language）是一种用于创建网页的标准标记语言。它不负责页面样式，但通过元素与属性描述文档结构。
              </p>
              <pre className="code-block">&lt;h1&gt;Hello, World!&lt;/h1&gt;</pre>
            </section>

            <section>
              <h2>第一个 HTML 文档</h2>
              <div className="code-panel">
                <h3>index.html</h3>
                <pre className="code-block">{`<!DOCTYPE html>
<html>
  <head>
    <title>我的页面</title>
  </head>
  <body>
    <h1>欢迎来到菜鸟教程</h1>
    <p>这是一个简单的 HTML 页面。</p>
  </body>
</html>`}</pre>
                <Link href="/html" className="run-link">
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
