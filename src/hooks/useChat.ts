"use client";

import { useState, useCallback, useEffect } from "react";
import type { ConversationEntry } from "@/components/mentor/scenes";
import { useAuth } from "@/components/shared/AuthProvider";
import { createClient } from "@/lib/supabase/client";

/** 每个用户、每种语言最多保留的对话条数（一句问+一句答 = 1 条） */
const HISTORY_LIMIT = 15;

type ConversationRow = {
  id: string;
  student_message: string;
  ai_message: string;
};

interface UseChatReturn {
  conversation: ConversationEntry[];
  loading: boolean;
  /** True while saved history is being restored from Supabase */
  restoring: boolean;
  error: string | null;
  sendMessage: (message: string, code: string, language: string) => Promise<void>;
  /** Remove one exchange (student question + AI answer) from view and from Supabase */
  deleteExchange: (studentIndex: number) => void;
}

export function useChat(language: string): UseChatReturn {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore the latest exchanges from Supabase on mount (signed-in users only)
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;
    setRestoring(true);

    (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("conversations")
          .select("id, student_message, ai_message")
          .eq("user_id", user.id)
          .eq("language", language)
          .order("created_at", { ascending: false })
          .limit(HISTORY_LIMIT);
        if (cancelled) return;
        if (fetchError) {
          // Table not created yet → persistence silently disabled (no scary overlay)
          console.warn("Conversation restore skipped:", fetchError.message);
          return;
        }
        const rows = (data ?? []) as ConversationRow[];
        if (rows.length === 0) return;
        // Fetched newest-first; flip to chronological order for display
        setConversation(
          rows.reverse().flatMap((row) => [
            { role: "student" as const, content: row.student_message, id: row.id },
            { role: "ai" as const, content: row.ai_message, id: row.id },
          ])
        );
      } finally {
        if (!cancelled) setRestoring(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, language]);

  const sendMessage = useCallback(async (
    message: string,
    code: string,
    chatLanguage: string
  ) => {
    setError(null);
    setLoading(true);

    // Index where this exchange's two entries will live in the conversation array
    const baseIndex = conversation.length;

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
          language: chatLanguage,
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

      // Persist the exchange (signed-in users only).
      // A DB trigger trims each (user, language) to the latest HISTORY_LIMIT rows.
      if (user) {
        const supabase = createClient();
        supabase
          ?.from("conversations")
          .insert({
            user_id: user.id,
            language: chatLanguage,
            student_message: message,
            ai_message: data.aiResponse,
            code: code || null,
          })
          .select("id")
          .single()
          .then(({ data: inserted, error: insertError }) => {
            if (insertError) {
              console.warn("Conversation persist skipped:", insertError.message);
              return;
            }
            // Tag the two entries with the DB row id so they can be deleted later
            const rowId = (inserted as { id: string } | null)?.id;
            if (!rowId) return;
            setConversation(prev => prev.map((e, i) =>
              i === baseIndex || i === baseIndex + 1 ? { ...e, id: rowId } : e
            ));
          });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "消息发送失败";
      setError(msg);
      // Add error entry for user feedback
      setConversation(prev => [...prev, { role: "ai", content: `❌ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, [conversation, user]);

  const deleteExchange = useCallback((studentIndex: number) => {
    const entry = conversation[studentIndex];
    if (!entry || entry.role !== "student") return;

    // Remove the student question and the AI answer right after it
    setConversation(prev => prev.filter((_, i) => i !== studentIndex && i !== studentIndex + 1));

    if (entry.id && user) {
      createClient()
        ?.from("conversations")
        .delete()
        .eq("id", entry.id)
        .then(({ error: deleteError }) => {
          if (deleteError) console.warn("Conversation delete skipped:", deleteError.message);
        });
    }
  }, [conversation, user]);

  return { conversation, loading, restoring, error, sendMessage, deleteExchange };
}
