"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeInputPanel } from "@/components/mentor/CodeInputPanel";
import { ChatInterface } from "@/components/mentor/ChatInterface";
import { SCENES } from "@/components/mentor/scenes";
import { useChat } from "@/hooks/useChat";
import { useShareParams } from "@/hooks/useShareParams";
import { encodeShareData } from "@/lib/shareEncode";
// useSearchParams needs client — force dynamic rendering
export const dynamic = "force-dynamic";

export default function PythonMentorPage() {
  const scene = SCENES.python[0];
  const { sharedMode, sharedConversation } = useShareParams();
  const { conversation, loading, restoring, error, sendMessage, deleteExchange, clearConversation } = useChat("Python");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // The actual conversation being displayed to the user
  const activeConversation = sharedMode ? sharedConversation : conversation;

  async function copyShareLink() {
    try {
      console.log("[copyShareLink] activeConv length:", activeConversation?.length, "sharedMode:", sharedMode);
      const data = encodeShareData({ conversation: activeConversation });
      const url = `${window.location.origin}${window.location.pathname}?share=${data}`;
      console.log("[copyShareLink] url generated, length:", url.length);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          console.log("[copyShareLink] clipboard.writeText OK");
          showToast("分享链接已复制到剪贴板！");
          return;
        } catch (e) {
          console.warn("[copyShareLink] clipboard.writeText failed:", e);
        }
      }

      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) {
          console.log("[copyShareLink] execCommand OK");
          showToast("分享链接已复制到剪贴板！");
          return;
        }
      } catch (e) {
        console.warn("[copyShareLink] execCommand failed:", e);
      }

      console.log("[copyShareLink] all methods failed, showing toast with URL");
      showToast("复制失败，请手动复制：" + url);
    } catch (e) {
      console.error("[copyShareLink] ERROR:", e);
      showToast("复制失败：" + e);
    }
  }

  function handleGiveUp() {
    return sendMessage("我卡住了，请直接告诉我答案。", "", "Python", { giveUp: true });
  }

  const isAiMode = !sharedMode && (restoring || conversation.length >= 2 || loading);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {showConfirmClear && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }} onClick={() => setShowConfirmClear(false)}>
          <div className="cm-glass-card" style={{ padding: 24, maxWidth: 360, width: "90%" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px", fontSize: "1rem" }}>确认清除对话？</h3>
            <p style={{ margin: "0 0 16px", fontSize: "0.88rem", color: "var(--cm-text-muted)" }}>AI 导师将忘记之前聊的内容，此操作不可撤销。</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="cm-btn-glass cm-btn-sm" onClick={() => setShowConfirmClear(false)} style={{ padding: "8px 18px" }}>取消</button>
              <button className="cm-btn-glow cm-btn-sm" onClick={() => { clearConversation(); setShowConfirmClear(false); }} style={{ padding: "8px 18px" }}>确认清除</button>
            </div>
          </div>
        </div>
      )}
      <header className="cm-lab-header">
        <Link href="/" style={{ fontSize: "0.88rem", color: "var(--cm-primary)" }}>← 返回首页</Link>
        <span className="cm-lab-title">🐍 Python 实验排错导师舱</span>
        <button onClick={() => setShowConfirmClear(true)} title="开始新对话" style={{ fontSize: "0.82rem", color: "var(--cm-text-muted)", background: "none", border: "1px solid var(--cm-border)", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
          🔄 新对话
        </button>
        <span className="cm-lab-scene-label">场景：{scene.name}</span>
      </header>
      <div className="cm-lab-layout">
        <div className="cm-lab-left">
          <CodeInputPanel
            onSend={sharedMode ? undefined : sendMessage}
            loading={loading}
            language="Python"
          />
        </div>
        <div className="cm-lab-right">
          {sharedMode ? (
            <ChatInterface conversation={sharedConversation} isRealtime onCopyShareLink={copyShareLink} />
          ) : isAiMode ? (
            <ChatInterface conversation={conversation} loading={loading || restoring} error={error} isRealtime onDeleteExchange={deleteExchange} onGiveUp={handleGiveUp} onCopyShareLink={copyShareLink} />
          ) : (
            <ChatInterface conversation={scene.conversation} isRealtime={false} />
          )}
        </div>
      </div>
    </div>
  );
}

function showToast(message: string) {
  const existing = document.querySelector(".cm-copy-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "cm-copy-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("cm-copy-toast-visible"));

  setTimeout(() => {
    toast.classList.remove("cm-copy-toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
