"use client";
/* ── Vesper-style landing for CodeMentor AI ── */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Count-up component with IntersectionObserver */
function Counter({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let start: number | null = null;
    let raf: number;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !start) {
          start = performance.now();
          const tick = (now: number) => {
            if (!ref.current) return;
            const t = Math.min((now - start!) / 1800, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            ref.current.textContent = (ease * target).toFixed(decimals);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [target, decimals]);
  return <span ref={ref}>0</span>;
}

interface Faq { question: string; answer: string; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs: Faq[] = [
    {
      question: "AI 导师不会直接把答案给我吗？",
      answer: "CodeMentor 采用苏格拉底式教学：导师不会直接给出答案，而是用一步步的引导性问题帮你找到问题本身。真正的知识，得靠你自己推导出来，才能刻进记忆。当然，如果确实卡住了，每轮对话都可以查看「引导线索」，像灯塔一样照亮方向。",
    },
    {
      question: "支持哪些编程语言？",
      answer: "目前覆盖 7 种语言：Python、Java、C/C++、JavaScript、HTML/CSS、MySQL、PHP。每种语言都有预设的实战排错场景，也支持你粘贴任意代码或错误日志让 AI 分析。",
    },
    {
      question: "对话历史会自动保存吗？",
      answer: "当前阶段，一次完整对话会保存在当前页面会话中（刷新后会清空，这是正常的）。我们正在接入数据库持久化，未来会让你登录后在教师看板里看到所有历史对话、知识点掌握度、班级数据等。",
    },
    {
      question: "免费版够用吗？有隐藏收费吗？",
      answer: "免费版的核心功能永久免费：7 种语言的导师舱、苏格拉底式对话、报错日志诊断、每天 3 次引导线索。升级 Pro 可解锁无限对话、云端历史、错题本等进阶能力。详见下方的价格表。",
    },
  ];

  const benefits = [
    { icon: "🎓", title: "苏格拉底式引导", desc: "不直接给答案，用问题引导你自主发现错误。知识自己推导的，才能真正刻进脑子里。" },
    { icon: "", title: "覆盖 7 门语言", desc: "Python、Java、C/C++、JS、HTML/CSS、MySQL、PHP —— 覆盖大学编程与实验课主要语言栈。" },
    { icon: "🩺", title: "错误日志诊断", desc: "粘贴编译或运行时错误日志，AI 会定位出错方向，再一步步引导你修复。" },
    { icon: "📊", title: "教师数据看板", desc: "全班对话记录、知识点掌握度、场景使用率一览无余，教学决策有据可依。" },
  ];

  const steps = [
    { num: "1", title: "粘贴代码", desc: "将出错的代码或报错日志粘贴到导师舱的代码编辑区。" },
    { num: "2", title: "AI 启发提问", desc: "AI 导师不会直接给答案，而是用关键问题引导你自己找到问题所在。" },
    { num: "3", title: "自己修复验证", desc: "按线索修改代码，重新发送分析，形成「排查→思考→修正」的闭环。" },
  ];

  const pricing = [
    {
      tag: "免费版",
      price: "¥0",
      period: "永久",
      featured: false,
      feats: ["7 种语言导师舱", "苏格拉底式引导对话", "错误日志诊断", "每天 3 次引导线索"],
      cta: "立即体验",
    },
    {
      tag: "学生 Pro",
      price: "¥29",
      period: "/月",
      featured: true,
      feats: ["无限次引导对话", "对话历史云端同步", "个人错题本 & 知识点图谱", "优先响应 · 无广告"],
      cta: "升级为 Pro",
    },
    {
      tag: "校园版",
      price: "定制",
      period: "联系校方",
      featured: false,
      feats: ["教师数据看板", "全班掌握度分析", "自定义教学场景库", "私有化部署可选"],
      cta: "联系销售",
    },
  ];

  /* Burger toggle */
  useEffect(() => {
    const b = document.querySelector(".burger-v") as HTMLElement | null;
    if (!b) return;
    b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      b.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", !open);
    });
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") b.click(); };
    window.addEventListener("keydown", esc);
    let last = window.innerWidth;
    const r = () => { if (last <= 900 && window.innerWidth > 900) b.click(); last = window.innerWidth; };
    window.addEventListener("resize", r);
    setTimeout(() => {
      document.querySelectorAll(".appear").forEach((el) => el.classList.add("is-in"));
    }, 4000);
  }, []);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <>
      <div className="grain" />

      <div className="v-page-wrap">
        <div className={`menu-backdrop-v ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
        <nav className={`mobile-nav-v ${menuOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/mentor" onClick={() => setMenuOpen(false)}>Product</Link>
          <Link href="#how-it-works" onClick={() => setMenuOpen(false)}>Case Studies</Link>
          <Link href="/teacher" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className="v-hero-screen">
          {/* Video background */}
          <div className="hero-photo">
            <video autoPlay muted loop playsInline>
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Header */}
          <header className="header-v">
            <Link href="/" className="logo-v appear appear--scale d08s" aria-label="CodeMentor AI">
              <svg className="logo-mark" viewBox="0 0 24 24"><g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" /><rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" /><circle cx="16.7" cy="20.8" r="1.45" />
              </g></svg>
              <span>CodeMentor<span className="logo-suffix">.ai</span></span>
            </Link>

            <nav id="site-nav-v" aria-label="Primary">
              <Link href="#benefits" className="nav-link-v appear appear--scale d16s">Benefits</Link>
              <Link href="#how-it-works" className="nav-link-v appear appear--soft d28s">How It Works</Link>
              <Link href="#faqs" className="nav-link-v appear appear--scale d40s">FAQs</Link>
              <Link href="#pricing" className="nav-link-v appear appear--soft d52s">Pricing</Link>
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Link href="/signin" className="btn btn-solid header-cta-v appear appear--scale d34s">Start for Free</Link>
              <button className="burger-v" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
                <span /><span /><span />
              </button>
            </div>
          </header>

          {/* Hero */}
          <main className="hero-v">
            <div className="hero-copy">
              <div className="badge-v appear appear--pop d22s">
                <svg className="badge-star" viewBox="0 0 18 20"><path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" /></svg>
                <span>Socratic AI 导师平台</span>
              </div>

              <h1 className="appear d42s">
                <span className="headline-line">Train <em>AI agents</em> on your</span>
                <span className="headline-line">workflows in minutes.</span>
              </h1>

              <p className="lede-v appear appear--soft d82s">
                Deploy adaptive AI agents that learn, execute, and scale operational tasks across your business.
              </p>

              <div className="hero-actions-v">
                <Link href="/signin" className="btn btn-solid btn-hero-solid appear appear--btn d96s">Start for Free</Link>
                <Link href="/python3" className="btn btn-ghost btn-hero-ghost appear appear--side d110s">See it in action</Link>
              </div>
            </div>
          </main>

          {/* Stats footer */}
          <footer className="stats-v">
            <div className="stat appear appear--stat d112s">
              <svg className="stat-icon" viewBox="0 0 24 24">
                <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#w1)" />
                <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#w2)" />
                <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
                <defs><linearGradient id="w1" x1="3" y1="2" x2="14" y2="22"><stop stopColor="rgba(255,255,255,.38)" /><stop offset="1" stopColor="rgba(58,58,58,.62)" /></linearGradient>
                <linearGradient id="w2" x1="14" y1="2" x2="21" y2="22"><stop stopColor="rgba(58,58,58,.38)" /><stop offset="1" stopColor="rgba(255,255,255,.62)" /></linearGradient></defs>
              </svg>
              <span><Counter target={4200000} decimals={0} />+ workflows automated</span>
            </div>

            <div className="stat appear appear--stat d128s">
              <svg className="stat-icon" viewBox="0 0 24 24">
                <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#fff" />
                <path d="M12 7.1v7.4M8.15 12.35L12 16.2l3.85-3.85" stroke="#111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span>92% reduction in manual operations</span>
            </div>

            <div className="stat appear appear--stat d144s">
              <svg className="stat-icon stat-icon-wide" viewBox="0 0 40 22">
                <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
                <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
                <polygon points="2,10 4,8 4,14" fill="#2b2b2b" />
                <polygon points="18.4,10 16.4,8 16.4,14" fill="#2b2b2b" />
                <circle cx="8" cy="11.5" r="0.7" fill="#1a1a1a" /><circle cx="12.4" cy="11.5" r="0.7" fill="#1a1a1a" />
                <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
                <circle cx="17" cy="9" r="1.7" fill="#1a1a1a" /><circle cx="23.4" cy="9" r="1.7" fill="#1a1a1a" />
                <ellipse cx="20.2" cy="12" rx="1.2" ry="1" fill="#ddd" />
                <path d="M18 13.5 Q20.2 15.5 22.4 13.5" stroke="#111" strokeWidth="1.2" fill="none" />
                <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
                <text x="30.2" y="15.1" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12.5" fontWeight="700" fill="#fff">e</text>
              </svg>
              <span>180+ operational teams onboarded</span>
            </div>
          </footer>
        </div>

        {/* Below-fold: Benefits · How It Works · FAQs · Pricing */}
        <div className="v-below">
          <section id="benefits" className="v-section">
            <div className="v-sec-kicker">核心优势</div>
            <h2 className="v-sec-title">一个 AI 导师，7 种语言全栈</h2>
            <p className="v-sec-sub">CodeMentor 专为高校编程实验课设计 —— 不是直接给你答案，而是苏格拉底式引导你「自己找到答案」，让知识真正长进脑子里。</p>
            <div className="v-benefit-grid">
              {benefits.map((b, i) => (
                <div key={i} className="v-benefit-card">
                  <span className="v-benefit-icon">{b.icon}</span>
                  <div className="v-benefit-title">{b.title}</div>
                  <div className="v-benefit-desc">{b.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="v-section">
            <div className="v-sec-kicker">使用方式</div>
            <h2 className="v-sec-title">三步完成一次排错闭环</h2>
            <p className="v-sec-sub">从粘贴错误代码到最终修复，全程由 AI 导师用问题引导，而非直接给答案。</p>
            <div className="v-steps">
              {steps.map((s) => (
                <div key={s.num} className="v-step">
                  <div className="v-step-num">{s.num}</div>
                  <div className="v-step-title">{s.title}</div>
                  <div className="v-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="faqs" className="v-section">
            <div className="v-sec-kicker">常见问题</div>
            <h2 className="v-sec-title">你可能想问的</h2>
            <div className="v-faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`v-faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button type="button" className="v-faq-q" onClick={() => toggleFaq(i)}>
                    <span>{f.question}</span>
                    <span className="v-faq-chevron" />
                  </button>
                  <div className="v-faq-a"><p>{f.answer}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section id="pricing" className="v-section">
            <div className="v-sec-kicker">定价方案</div>
            <h2 className="v-sec-title">按你的需求，任选一种</h2>
            <div className="v-price-grid">
              {pricing.map((p, i) => (
                <div key={i} className={`v-price-card ${p.featured ? 'featured' : ''}`}>
                  <div className="v-price-tag">{p.tag}</div>
                  <div className="v-price-amount">{p.price}<span>{p.period}</span></div>
                  <ul className="v-price-feats">
                    {p.feats.map((f, j) => (<li key={j}>{f}</li>))}
                  </ul>
                  <Link href="/signin" className="btn btn-ghost btn-ghost-v">{p.cta}</Link>
                </div>
              ))}
            </div>
          </section>

          <footer className="v-foot-v">
            <span>© 2026 CodeMentor AI · Socratic-style AI Programming Mentor Platform</span>
            <div style={{ display:'flex', gap:18 }}>
              <Link href="/mentor">Product</Link>
              <Link href="/teacher">Teacher Dashboard</Link>
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
