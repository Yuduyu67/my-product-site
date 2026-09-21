import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "Java", "PHP", "MySQL"];

const sidebarItems = [
  "PHP 简介",
  "PHP 语法",
  "PHP 变量",
  "PHP 字符串",
  "PHP 数组",
  "PHP 条件语句",
  "PHP 循环",
  "PHP 函数",
  "PHP 面向对象",
  "PHP 文件处理",
  "PHP MySQL",
  "PHP 框架",
];

export function PhpTutorialPage() {
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
              <Link key={item} href={item === "首页" ? "/" : item === "HTML" ? "/html" : item === "CSS" ? "/css" : item === "JS" ? "/js" : item === "Java" ? "/java" : item === "PHP" ? "/php" : "/mysql"}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="python-shell python-main">
        <div className="python-layout">
          <aside className="python-sidebar">
            <div className="sidebar-title">PHP 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/php">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">Server</span>
              <h1>PHP 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">PHP</div>
              <div>
                <p>
                  PHP 是一种广泛用于 Web 开发的脚本语言，适合生成动态页面、处理表单、访问数据库和构建后端接口。
                </p>
                <p>
                  你也可以继续学习 <Link href="/php">PHP 语法</Link> 与常规 Web 开发应用。
                </p>
              </div>
            </div>

            <section>
              <h2>PHP 基础</h2>
              <p>
                PHP 代码通常嵌入到 HTML 中，通过服务器解析后返回结果。它对动态网站、CMS、论坛和电商平台非常常见。
              </p>
              <pre className="code-block">{`<?php
  echo "Hello, PHP!";
?>`}</pre>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
