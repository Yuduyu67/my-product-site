import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "Java", "PHP", "MySQL"];

const sidebarItems = [
  "MySQL 简介",
  "MySQL 安装",
  "MySQL 连接",
  "MySQL 数据库",
  "MySQL 表",
  "MySQL 查询",
  "MySQL 更新",
  "MySQL 删除",
  "MySQL 事务",
  "MySQL 索引",
  "MySQL 连接池",
  "MySQL 进阶",
];

export function MysqlTutorialPage() {
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
            <div className="sidebar-title">MySQL 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/mysql">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">Database</span>
              <h1>MySQL 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">SQL</div>
              <div>
                <p>
                  MySQL 是一个广泛使用的关系型数据库管理系统，常用于 Web 应用、后台系统和数据存储场景。
                </p>
                <p>
                  你也可以继续学习 <Link href="/mysql">MySQL 基本查询</Link> 与数据库设计基础。
                </p>
              </div>
            </div>

            <section>
              <h2>数据库基础</h2>
              <p>
                MySQL 通过表、行和列来组织数据，使用 SQL 语句进行查询、更新、删除和事务控制，是现代应用开发中的核心基础设施之一。
              </p>
              <pre className="code-block">{`SELECT * FROM users WHERE status = 'active';`}</pre>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
