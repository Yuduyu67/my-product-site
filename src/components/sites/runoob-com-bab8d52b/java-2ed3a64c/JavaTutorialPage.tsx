import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "Java", "PHP", "MySQL"];

const sidebarItems = [
  "Java 简介",
  "Java 环境",
  "Java 基础语法",
  "Java 对象",
  "Java 类与对象",
  "Java 集合框架",
  "Java 多线程",
  "Java IO",
  "Java 网络编程",
  "Java 数据库",
  "Java 进阶话题",
];

export function JavaDataTutorialPage() {
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
            <div className="sidebar-title">Java 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/java">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">后端</span>
              <h1>Java 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">Java</div>
              <div>
                <p>
                  Java 是一种面向对象的跨平台语言，广泛用于企业开发、移动开发和后端服务。它强调稳定性、可扩展性以及统一的开发规范。
                </p>
                <p>
                  你也可以继续学习 <Link href="/java">Java 基础语法</Link> 与常见开发模式。
                </p>
              </div>
            </div>

            <section>
              <h2>Java 简介</h2>
              <p>
                Java 代码通常使用 class 组织，并通过 JVM 运行，这使得它具有良好的跨平台能力。它常见于企业级系统、微服务、Spring 框架等场景。
              </p>
              <pre className="code-block">{`public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}`}</pre>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
