"use client";

import Link from "next/link";
import { CodeInputPanel } from "@/components/mentor/CodeInputPanel";
import { ChatInterface } from "@/components/mentor/ChatInterface";
import { SCENES } from "@/components/mentor/scenes";
import { useChat } from "@/hooks/useChat";

export default function CMentorPage() {
  const scene = SCENES.cpp[0];
  const { conversation, loading, restoring, error, sendMessage, deleteExchange } = useChat("C/C++");

  const isAiMode = restoring || conversation.length >= 2 || loading;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="cm-lab-header">
        <Link href="/" style={{ fontSize: "0.88rem", color: "var(--cm-primary)" }}>← 返回首页</Link>
        <span className="cm-lab-title">⚡ C/C++ 实验排错导师舱</span>
        <span className="cm-lab-scene-label">场景：{scene.name}</span>
      </header>
      <div className="cm-lab-layout">
        <div className="cm-lab-left">
          <CodeInputPanel
            onSend={sendMessage}
            loading={loading}
            language="C/C++"
          />
        </div>
        <div className="cm-lab-right">
          {isAiMode ? (
            <ChatInterface conversation={conversation} loading={loading || restoring} error={error} isRealtime onDeleteExchange={deleteExchange} />
          ) : (
            <ChatInterface conversation={scene.conversation} isRealtime={false} />
          )}
        </div>
      </div>
    </div>
  );
}
