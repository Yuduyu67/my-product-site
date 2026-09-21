import Link from "next/link";

const tabItems = ["首页", "HTML", "CSS", "JS", "本地书签", "搜索"];

const sidebarItems = [
  "Python3 简介",
  "Python3 环境搭建",
  "Python3 基础语法",
  "Python3 数据类型",
  "Python3 运算符",
  "Python3 条件控制",
  "Python3 循环语句",
  "Python3 函数",
  "Python3 模块",
  "Python3 文件操作",
  "Python3 异常处理",
  "Python3 面向对象",
  "Python3 高级特性",
];

export function PythonTutorialPage() {
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
              <Link key={item} href={item === "首页" ? "/" : "/python3"}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="python-shell python-main">
        <div className="python-layout">
          <aside className="python-sidebar">
            <div className="sidebar-title">Python 3 教程</div>
            <ul>
              {sidebarItems.map((item, index) => (
                <li key={item} className={index === 0 ? "active" : ""}>
                  <Link href="/python3">{item}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="python-article">
            <div className="article-header">
              <span className="article-kicker">Python3.x</span>
              <h1>Python 3 教程</h1>
            </div>

            <div className="article-banner">
              <div className="banner-logo">python3</div>
              <div>
                <p>
                  Python 的 3.0 版本，常被称为 Python 3000，或简称 Py3k。
                  相对于 Python 的早期版本，这是一个较大的升级。为了不带入过多的累赘，Python 3.0 在设计的时候没有考虑向下兼容。
                </p>
                <p>
                  你也可以点击 <Link href="/python3">Python2.x与3.x版本区别</Link>
                  来查看两者的不同。
                </p>
              </div>
            </div>

            <section>
              <h2>查看 Python 版本</h2>
              <p>
                我们可以在命令窗口（Windows 使用 win+R 调出 cmd 运行框）使用以下命令查看我们使用的 Python 版本：
              </p>
              <pre className="code-block">python -V 或 python --version</pre>
              <p>以上命令执行结果如下：</p>
              <pre className="code-block">Python 3.3.2</pre>
            </section>

            <section>
              <h2>第一个 Python3.x 程序</h2>
              <p>
                对于大多数程序语言，第一个入门编程代码便是 <strong>&quot;Hello World！&quot;</strong>，以下代码为使用 Python 输出
                <strong>&quot;Hello World！&quot;</strong>：
              </p>

              <div className="code-panel">
                <h3>hello.py 文件代码：</h3>
                <pre className="code-block">{`#!/usr/bin/python3
print("Hello, World!")`}</pre>
                <Link href="/python3" className="run-link">
                  运行实例 »
                </Link>
              </div>

              <p>你可以将以上代码保存在 <strong>hello.py</strong> 文件中并使用 python 命令执行该脚本文件。</p>
              <pre className="code-block">$ python3 hello.py</pre>
              <p>以上命令输出结果为：</p>
              <pre className="code-block">Hello, World!</pre>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
