"use client";

import { useState } from "react";
import type { ConversationEntry, Hint } from "./scenes";
import { HintScaffolding } from "./HintScaffolding";

interface ChatInterfaceProps {
  conversation: ConversationEntry[];
  loading?: boolean;
  error?: string | null;
  /** If true, use reveal-mode (for mock data). If false, show all in real-time (for AI). */
  isRealtime?: boolean;
  /** Called with the index of a student message to delete that exchange */
  onDeleteExchange?: (studentIndex: number) => void;
  /** Called when user clicks "give up" and wants direct answer */
  onGiveUp?: () => void;
  /** Called when user clicks "copy share link"; receives base64-encoded conversation JSON */
  onCopyShareLink?: () => Promise<void>;
}

export function ChatInterface({ conversation, loading, error, isRealtime = false, onDeleteExchange, onGiveUp, onCopyShareLink }: ChatInterfaceProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [shareError, setShareError] = useState<string | null>(null);

  // Realtime mode shows everything; reveal mode advances manually
  const visibleCount = isRealtime ? conversation.length : Math.min(revealedCount, conversation.length);

  function handleNext() {
    setRevealedCount((c) => Math.min(c + 2, conversation.length));
  }

  function toggleHints(entryIndex: number) {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      if (next.has(entryIndex)) next.delete(entryIndex); else next.add(entryIndex);
      return next;
    });
  }

  // Loading indicator
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--cm-text-muted)" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🎓</div>
        <div>AI 导师正在思考...</div>
      </div>
    );
  }

  if (conversation.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "var(--cm-text-muted)", marginTop: 60 }}>
        <p style={{ fontSize: "2rem" }}>💬</p>
        <p>在左侧对话框粘贴代码或报错日志发送，AI 导师将引导你自主排查问题。</p>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "30px 0", color: "#f87171" }}>
        <p style={{ fontSize: "1.2rem", marginBottom: 8 }}>❌ {error}</p>
        <p style={{ fontSize: "0.85rem", color: "var(--cm-text-muted)" }}>请重试或稍后再次尝试</p>
      </div>
    );
  }

  return (
    <div>
      {conversation.slice(0, visibleCount).map((entry, idx) => (
        <div key={idx} className={`cm-chat-msg ${entry.role}`}>
          <div className="cm-chat-avatar">{entry.role === "ai" ? "🎓" : "👤"}</div>
          <div>
            <div className="cm-chat-bubble">{entry.content}</div>
            {entry.role === "student" && isRealtime && onDeleteExchange && (
              <button
                onClick={() => onDeleteExchange(idx)}
                title="删除这轮对话（云端历史同步删除）"
                style={{ marginTop: 6, fontSize: "0.72rem", color: "var(--cm-text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                🗑 删除这轮
              </button>
            )}
            {entry.hints && entry.hints.length > 0 && (
              <>
                <button onClick={() => toggleHints(idx)} style={{ display: "block", marginTop: 8, fontSize: "0.78rem", color: "var(--cm-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {revealedHints.has(idx) ? "▲ 收起引导线索" : "▼ 查看引导线索"}
                </button>
                {revealedHints.has(idx) && <HintScaffolding hints={entry.hints as Hint[]} />}
              </>
            )}
          </div>
        </div>
      ))}

      {/* Realtime mode: always show all messages, no reveal button */}
      {isRealtime && (
        <div style={{ textAlign: "center", marginTop: 16, padding: "14px 0", borderTop: "1px solid var(--cm-border)", color: "var(--cm-text-muted)", fontSize: "0.85rem" }}>
          <div style={{ marginBottom: 8 }}>对话已实时展示，继续输入你的问题或代码...</div>
          {conversation.length >= 2 && !loading && onGiveUp && onCopyShareLink && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  try {
                    console.log("[ChatInterface] onGiveUp clicked");
                    onGiveUp?.();
                    setShareError(null);
                  } catch (e) {
                    console.error("[ChatInterface] onGiveUp error:", e);
                    setShareError("操作失败：" + e);
                  }
                }}
                className="cm-btn-outline-glow cm-btn-sm"
                style={{ padding: "6px 16px", fontSize: "0.78rem", cursor: "pointer" }}
              >
                ⚡ 我已卡住，请直接给答案
              </button>
              <button
                onClick={() => {
                  try {
                    console.log("[ChatInterface] onCopyShareLink clicked");
                    setShareError(null);
                    onCopyShareLink?.();
                  } catch (e) {
                    console.error("[ChatInterface] onCopyShareLink error:", e);
                    setShareError("复制失败：" + e);
                  }
                }}
                className="cm-btn-glass cm-btn-sm"
                style={{ padding: "6px 16px", fontSize: "0.78rem", cursor: "pointer" }}
              >
                🔗 复制分享链接
              </button>
            </div>
          )}
          {shareError && (
            <div style={{ color: "#f87171", fontSize: "0.78rem", marginTop: 8 }}>
              ⚠️ {shareError}（请打开浏览器控制台查看详细信息）
            </div>
          )}
        </div>
      )}

      {/* Reveal mode: show reveal button for mock data */}
      {!isRealtime && conversation.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          {visibleCount < conversation.length ? (
            <>
              <button className="cm-btn-glass cm-btn-glass-sm" onClick={handleNext}>
                💡 揭示下一步
              </button>
              <span style={{ marginLeft: 12, fontSize: "0.8rem", color: "var(--cm-text-muted)" }}>
                剩余 {Math.ceil((conversation.length - visibleCount) / 2)} 轮
              </span>
            </>
          ) : (
            <div style={{ color: "var(--cm-text-muted)", fontSize: "0.85rem" }}>
              ✅ 全部对话已展示完毕！引导学生自主完成实践验证。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
