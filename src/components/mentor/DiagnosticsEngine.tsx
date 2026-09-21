"use client";

import { useState, useCallback } from "react";

const CHANNELS = [
  { key: "software", label: "纯软件通道" },
  { key: "system", label: "系统与仿真通道" },
];

interface DiagnosticsEngineProps {
  onStartDiagnosis?: (code: string, log: string, language: string) => Promise<void>;
  /** Current scene code (for diagnosis context) */
  code?: string;
  /** Current error log */
  log?: string;
  /** Current language */
  language?: string;
}

export function DiagnosticsEngine({ onStartDiagnosis, code = "", log = "", language = "Python" }: DiagnosticsEngineProps) {
  const [channel, setChannel] = useState("software");
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");

  const handleStart = useCallback(async () => {
    if (!onStartDiagnosis) return;
    setStatus("analyzing");
    try {
      await onStartDiagnosis(code, log, language);
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }, [onStartDiagnosis, code, log, language]);

  return (
    <div className="cm-diag-panel">
      <div className="cm-diag-title">诊断引擎</div>

      <div className="cm-diag-channels">
        {CHANNELS.map((ch) => (
          <button key={ch.key} className={`cm-btn-tint ${channel === ch.key ? "active" : ""}`} onClick={() => setChannel(ch.key)}>
            {ch.label}
          </button>
        ))}
      </div>

      <div className="cm-diag-status">
        <span className={`cm-diag-dot ${status === "analyzing" ? "pulse" : ""}`}
          style={{ background: status === "done" ? "var(--cm-success)" : status === "analyzing" ? "var(--cm-warning)" : "#4a4a5a" }} />
        {status === "idle" && (
          <>等待输入{" "}<button className="cm-btn-glow cm-btn-sm" onClick={handleStart} disabled={!code}>开始诊断</button></>
        )}
        {status === "analyzing" && (
          <span>
            AI 诊断中... <span style={{ fontSize: "0.75rem", color: "var(--cm-text-muted)", marginLeft: 4 }}>({language})</span>
          </span>
        )}
        {status === "done" && "诊断完成 — 引导线索已就绪"}
      </div>

      <div className="cm-diag-token-bar">
        <div className="cm-diag-token-fill" style={{ width: status === "idle" ? "0%" : status === "analyzing" ? "60%" : "100%" }} />
      </div>
    </div>
  );
}
