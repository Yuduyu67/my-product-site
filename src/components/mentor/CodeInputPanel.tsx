"use client";

import { useState } from "react";

const FILE_TYPES = ["C源码", "Java源码", "Python脚本", "Shell日志", "仿真波形"] as const;

interface CodeInputPanelProps {
  defaultCode?: string;
  defaultLog?: string;
  /** Callback when student sends a message */
  onSend?: (message: string, code: string, language: string) => void;
  /** Whether the AI is currently processing */
  loading?: boolean;
  /** Current language name for context */
  language?: string;
}

export function CodeInputPanel({
  defaultCode = '',
  defaultLog = '',
  onSend,
  loading = false,
  language = "Python",
}: CodeInputPanelProps) {
  const [activeTab, setActiveTab] = useState<"code" | "log">("code");
  const [codeText, setCodeText] = useState(defaultCode);
  const [logText, setLogText] = useState(defaultLog);
  const [fileType, setFileType] = useState<string>(FILE_TYPES[0]);
  const [inputValue, setInputValue] = useState("");

  const codeLines: string[] = codeText ? codeText.split('\n') : [];
  const langExt = language === "Python" ? "py" : language === "C/C++" ? "c" : language === "Java" ? "java" : language === "JavaScript" ? "js" : "txt";

  function sendMessage() {
    const message = inputValue.trim();
    if (!message || loading) return;

    // Detect code block in user input: ```lang ... ```
    const codeBlockMatch = message.match(/^```(\w*)\n([\s\S]*?)```$/);
    let userCode = codeText;
    let userMessage = message;

    if (codeBlockMatch) {
      const blockLang = codeBlockMatch[1] || language;
      const blockCode = codeBlockMatch[2].trim();
      // Update code editor with user's code block
      setCodeText(blockCode);
      userMessage = message.replace(codeBlockMatch[0], '').trim() || `分析以下${blockLang}代码：`;
      userCode = blockCode;
    }

    onSend?.(userMessage, userCode, language);
    setInputValue("");
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Tabs */}
      <div className="cm-tabs">
        <button className={`cm-tab ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
          💻 代码编辑区
        </button>
        <button className={`cm-tab ${activeTab === "log" ? "active" : ""}`} onClick={() => setActiveTab("log")}>
          📋 报错日志
        </button>
      </div>

      {/* Tool bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <select value={fileType} onChange={(e) => setFileType(e.target.value)}
          style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid var(--cm-border)", fontSize: "0.82rem", color: "var(--cm-text-muted)", background: "#0d0d14" }}>
          {FILE_TYPES.map((t) => (<option key={t}>{t}</option>))}
        </select>
        <span style={{ fontSize: "0.78rem", color: "var(--cm-text-muted)" }}>语言：{language}</span>
        <button
          onClick={() => setCodeText(defaultCode)}
          style={{ fontSize: "0.72rem", color: "var(--cm-primary)", background: "none", border: "1px solid var(--cm-border)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", marginLeft: "auto" }}
          title="恢复默认代码"
        >
          ↺ 重置
        </button>
      </div>

      {/* Code Editor — editable */}
      {activeTab === "code" && (
        <div className="cm-code-editor">
          <div className="cm-code-editor-header">
            <div className="cm-editor-dots">
              <span style={{ background: "#ff5f57" }} />
              <span style={{ background: "#febc2e" }} />
              <span style={{ background: "#28c840" }} />
            </div>
            <span>main.{langExt}</span>
          </div>
          <div className="cm-editor-body" style={{ position: "relative" }}>
            <div className="cm-line-numbers">
              {codeLines.map((_line, i) => (<div key={i}>{i + 1}</div>))}
            </div>
            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              spellCheck={false}
              placeholder="// 在此输入你的代码，或粘贴代码块到对话框..."
              style={{
                flex: 1, minHeight: 150, resize: "vertical",
                background: "transparent", border: "none",
                color: "var(--cm-text)", fontSize: "0.85rem", lineHeight: 1.6,
                outline: "none", padding: "8px 12px",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                boxSizing: "border-box", width: "100%",
              }}
            />
          </div>
        </div>
      )}

      {/* Log Viewer — editable */}
      {activeTab === "log" && (
        <div className="cm-code-editor">
          <div className="cm-code-editor-header">
            <div className="cm-editor-dots">
              <span style={{ background: "#ff5f57" }} />
              <span style={{ background: "#febc2e" }} />
              <span style={{ background: "#28c840" }} />
            </div>
            <span>error.log</span>
          </div>
          <div className="cm-line-content" style={{ maxHeight: 200, overflowY: "auto", color: "#f87171" }}>
            <textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              spellCheck={false}
              placeholder="// 粘贴编译/运行时错误日志..."
              style={{
                width: "100%", minHeight: 100, background: "transparent", border: "none",
                color: "#f87171", fontSize: "0.82rem", lineHeight: 1.5, outline: "none",
                resize: "vertical", fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                boxSizing: "border-box", padding: "4px 0",
              }}
            />
          </div>
        </div>
      )}

      {/* Chat Input — supports code blocks */}
      {onSend && (
        <form onSubmit={handleFormSubmit} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={"输入问题，或粘贴 ```代码``` 让AI分析（Enter 发送，Shift+Enter 换行）"}
              disabled={loading}
              rows={3}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8, resize: "vertical",
                border: "1px solid var(--cm-border)", background: "rgba(255,255,255,0.04)",
                color: "var(--cm-text)", fontSize: "0.88rem", outline: "none",
                boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5,
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="cm-btn-glow cm-btn-sm"
              style={{ padding: "10px 20px", alignSelf: "flex-end", height: 40 }}
            >
              {loading ? "..." : "发送"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
