"use client";

import { useState, useCallback } from "react";
import type { ConversationEntry } from "@/components/mentor/scenes";

interface UseChatReturn {
  conversation: ConversationEntry[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: string, code: string, language: string) => Promise<void>;
  startDiagnosis: (code: string, log: string, language: string) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    code: string,
    language: string
  ) => {
    setError(null);
    setLoading(true);

    try {
      // Add student message
      const studentEntry: ConversationEntry = { role: "student", content: message };
      setConversation(prev => [...prev, studentEntry]);

      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentMessage: message,
          code,
          language,
          conversationHistory: conversation.map(c => ({
            role: c.role,
            content: c.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "AI 服务异常");
      }

      // Add AI response
      const aiEntry: ConversationEntry = { role: "ai", content: data.aiResponse };
      setConversation(prev => [...prev, aiEntry]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "消息发送失败";
      setError(msg);
      // Add error entry for user feedback
      setConversation(prev => [...prev, { role: "ai", content: `❌ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  const startDiagnosis = useCallback(async (
    code: string,
    log: string,
    language: string
  ) => {
    setError(null);
    setLoading(true);
    setConversation([]);

    try {
      // Build initial diagnosis prompt
      const diagnosticPrompt = log
        ? `我是 CodeMentor AI 编程导师。请分析以下代码和错误日志，用苏格拉底式提问引导学生自主发现错误。

语言：${language}

代码：
\`\`\`${language}
${code}
\`\`\`

错误日志：
${log}

请给出你的第一个引导性问题，帮助学生开始排查。`
        : `我是 CodeMentor AI 编程导师。请分析以下代码，用苏格拉底式提问引导学生自主发现潜在问题。

语言：${language}

代码：
\`\`\`${language}
${code}
\`\`\`

请给出你的第一个引导性问题，帮助学生开始排查。`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentMessage: diagnosticPrompt,
          code,
          language,
          conversationHistory: [],
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "AI 服务异常");
      }

      // Build initial conversation
      const studentEntry: ConversationEntry = {
        role: "student",
        content: log
          ? "老师，我的代码报了错，帮我看看怎么回事？"
          : "老师，请帮我诊断这段代码有没有问题。",
      };

      const aiEntry: ConversationEntry = {
        role: "ai",
        content: data.aiResponse,
      };

      setConversation([studentEntry, aiEntry]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "诊断启动失败";
      setError(msg);
      setConversation([{ role: "ai", content: `❌ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { conversation, loading, error, sendMessage, startDiagnosis };
}
