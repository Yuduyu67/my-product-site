import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "本地书签", "搜索"];

const sidebarItems = [
  "JavaScript 简介",
  "JavaScript 变量",
  "JavaScript 数据类型",
  "JavaScript 运算符",
  "JavaScript 条件语句",
  "JavaScript 循环",
  "JavaScript 函数",
  "JavaScript 对象",
  "JavaScript DOM",
  "JavaScript 事件",
  "JavaScript 异步",
  "JavaScript 模块",
];

export function JavaScriptTutorialPage() {
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
            <div className="sidebar-title">JavaScript 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/js">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">Web</span>
              <h1>JavaScript 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">JS</div>
              <div>
                <p>
                  JavaScript 是浏览器端脚本语言，它让页面具备交互能力，比如表单校验、动画、状态切换和动态内容更新。
                </p>
                <p>
                  你也可以点击 <Link href="/js">JavaScript 事件</Link> 继续学习网页交互和异步编程。
                </p>
              </div>
            </div>

            <section>
              <h2>JavaScript 能做什么</h2>
              <p>
                JavaScript 可以用于 DOM 操作、数据处理、网络请求和页面交互。它是现代前端开发的核心语言之一。
              </p>
              <pre className="code-block">{`console.log(&quot;Hello, JavaScript!&quot;);`}</pre>
            </section>

            <section>
              <h2>基础示例</h2>
              <div className="code-panel">
                <h3>script.js</h3>
                <pre className="code-block">{`const message = "欢迎学习 JavaScript";
console.log(message);

document.querySelector("button").addEventListener("click", () => {
  alert("点击了按钮");
});`}</pre>
                <Link href="/js" className="run-link">
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
