"use client";

import { useRef, useEffect } from "react";

interface CodeRunnerProps {
  open: boolean;
  code: string;
  language?: string;
  onClose: () => void;
}

function detectLanguage(code: string, fallback: string): string {
  const c = code.trimStart();
  if (c.startsWith("def ") || c.startsWith("@") || /import\s+(pandas|numpy|requests|flask|django)/.test(c)) return "python";
  if (/<!DOCTYPE|<html|<body|<div\s|<h[1-6]|<table|<img\s/.test(c)) return "html";
  if (/<style\b|css\s*{/.test(c)) return "css";
  if (fallback) return fallback;
  return "html";
}

function wrapCode(code: string, lang: string): string {
  if (lang === "python") {
    return `<html><head><meta charset="utf-8"><title>Python 运行</title></head>
<body style="padding:16px;font-family:system-ui"><h3>⚠️ Python 需要 Pyodide 支持</h3><p>请在对话中输入代码，AI 导师会帮你分析和运行。</p></body></html>`;
  }

  if (lang === "css") {
    return `<html><head><meta charset="utf-8"><title>CSS 预览</title>
<style>${code}</style></head><body style="padding:16px;font-family:system-ui">
<div class="preview-box">示例内容</div></body></html>`;
  }

  if (lang === "javascript" || lang === "js") {
    return `<html><head><meta charset="utf-8"><title>JavaScript 运行</title></head>
<body style="padding:16px;font-family:system-ui">${code}
<script>
try { console.log = function() { window.parent.postMessage({type:'console',args:Array.from(arguments).map(a=>typeof a==='object'?JSON.stringify(a):String(a))},'*'); }; } catch(e){}
</script></body></html>`;
  }

  // HTML
  return `<html><head><meta charset="utf-8"><title>HTML 预览</title></head>
<body style="margin:0;padding:16px">${code}</body></html>`;
}

export function CodeRunner({ open, code, language = "HTML", onClose }: CodeRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const msgHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);
  const lang = detectLanguage(code, language.toLowerCase());
  const langLabel: Record<string, string> = {
    javascript: "JavaScript", js: "JavaScript", python: "Python",
    html: "HTML", css: "CSS",
  };
  const label = langLabel[lang] || lang;
  const iframeSrc = open ? wrapCode(code, lang) : "";

  useEffect(() => {
    let iframeWin: Window | null = null;
    if (open && iframeRef.current) {
      iframeWin = iframeRef.current.contentWindow;
      if (iframeWin && !msgHandlerRef.current) {
        const handler = (e: MessageEvent) => {
          // Console messages from iframe are sent to parent but not displayed here
          // This is for future enhancement - console log panel
          console.log("[CodeRunner] Console message:", e.data);
        };
        iframeWin.addEventListener("message", handler);
        msgHandlerRef.current = handler;
      }
    }
    return () => {
      if (msgHandlerRef.current && iframeWin) {
        iframeWin.removeEventListener("message", msgHandlerRef.current);
        msgHandlerRef.current = null;
      }
    };
  }, [open]);

  function handleClose() {
    onClose();
    if (msgHandlerRef.current && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.removeEventListener("message", msgHandlerRef.current);
      msgHandlerRef.current = null;
    }
  }

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.7)",
    }} onClick={handleClose}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", background: "rgba(20,20,30,0.95)", borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.88rem", color: "#fff", fontWeight: 600 }}>
            🚀 {label} 运行结果
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--cm-text-muted)", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 4 }}>
            {code.split("\n").length} 行
          </span>
        </div>
        <button onClick={handleClose} title="关闭" style={{
          background: "none", border: "none", color: "var(--cm-text-muted)",
          fontSize: "1.1rem", cursor: "pointer", padding: "4px 10px", lineHeight: 1,
        }}>✕ 关闭</button>
      </div>

      {/* Iframe */}
      <div style={{ flex: 1, position: "relative", background: "#fff" }} onClick={e => e.stopPropagation()}>
        <iframe
          ref={iframeRef}
          srcDoc={iframeSrc}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>
    </div>
  );
}
