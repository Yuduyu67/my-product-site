"use client";

import { useState, useRef } from "react";
import { CodeRunner } from "./CodeRunner";

interface CodeInputPanelProps {
  /** Callback when student sends a message */
  onSend?: (message: string, code: string, language: string) => void;
  /** Whether the AI is currently processing */
  loading?: boolean;
  /** Current language name for context */
  language?: string;
  /** Callback when user wants to run code */
  onRunCode?: (code: string) => void;
}

export function CodeInputPanel({ onSend, loading = false, language = "Python" }: CodeInputPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [runnerCode, setRunnerCode] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Input grows with pasted content (capped) so code/logs stay readable
  const rows = Math.min(12, Math.max(4, inputValue.split("\n").length));

  function sendMessage() {
    const message = inputValue.trim();
    if (!message || loading) return;

    // If the whole input is a ```code block```, extract it as structured code context
    const codeBlockMatch = message.match(/^```(\w*)\n([\s\S]*?)```$/);
    let userCode = "";
    let userMessage = message;

    if (codeBlockMatch) {
      const blockLang = codeBlockMatch[1] || language;
      userCode = codeBlockMatch[2].trim();
      userMessage = `请分析以下${blockLang}代码：`;
    }

    onSend?.(userMessage, userCode, language);
    setInputValue("");
  }

  function handleRunCode() {
    if (!inputValue.trim()) return;
    setRunnerCode(inputValue);
    setRunnerOpen(true);
  }

  function handleRunnerClose() {
    setRunnerOpen(false);
    setRunnerCode("");
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--cm-text)" }}>💬 和导师对话</span>
        <span style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>语言：{language}</span>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder={"直接粘贴代码、报错日志或你的问题…\n例如：整段 Traceback、编译错误、或一段有 bug 的代码，复制进来发送即可，导师会自己识别并分析。\n（Enter 发送，Shift+Enter 换行）"}
          disabled={loading}
          rows={rows}
          spellCheck={false}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: 8, resize: "vertical",
            border: "1px solid var(--cm-border)", background: "rgba(255,255,255,0.04)",
            color: "var(--cm-text)", fontSize: "0.88rem", outline: "none",
            boxSizing: "border-box", lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 12 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--cm-text-muted)" }}>
            代码与报错日志可直接粘贴，导师自动识别内容
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleRunCode}
              disabled={loading || !inputValue.trim()}
              className="cm-btn-glass cm-btn-sm"
              style={{ padding: "10px 18px", height: 40, flexShrink: 0, opacity: !inputValue.trim() ? 0.5 : 1 }}
              title="用当前代码在浏览器中运行预览"
            >
              🚀 运行代码
            </button>
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="cm-btn-glow cm-btn-sm"
              style={{ padding: "10px 24px", height: 40, flexShrink: 0 }}
            >
              {loading ? "..." : "发送"}
            </button>
          </div>
        </div>
      </form>

      {/* Code Runner Modal */}
      <CodeRunner
        open={runnerOpen}
        code={runnerCode}
        language={language}
        onClose={handleRunnerClose}
      />
    </div>
  );
}
