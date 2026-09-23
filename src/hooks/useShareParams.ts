"use client";

import { useState } from "react";
import type { ConversationEntry } from "@/components/mentor/scenes";

/**
 * Extracts share params from the ?share= URL query parameter.
 *
 * Uses DOM APIs (URLSearchParams on window.location) directly to avoid
 * Next.js 16's Suspense requirement for useSearchParams(), while keeping
 * the read synchronous so components can branch on shared mode immediately.
 */
export function extractShareParams(): { sharedMode: boolean; sharedConversation: ConversationEntry[] } {
  try {
    const params = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
    const shareData = params?.get("share");
    if (!shareData) return { sharedMode: false, sharedConversation: [] };
    const decoded = JSON.parse(atob(shareData));
    if (!decoded || !Array.isArray(decoded.conversation)) return { sharedMode: false, sharedConversation: [] };
    return { sharedMode: true, sharedConversation: decoded.conversation };
  } catch {
    return { sharedMode: false, sharedConversation: [] };
  }
}

/**
 * Custom hook wrapper that initializes share params from URL on mount.
 * Returns a stable tuple [sharedMode, sharedConversation] that flips once
 * the initial check completes.
 */
export function useShareParams(): { sharedMode: boolean; sharedConversation: ConversationEntry[] } {
  // Seed from sync read on init — works for URL navigations
  const init = extractShareParams();

  const [result, setResult] = useState(init);

  // Read once more after first paint so any SSR timing edge cases are caught
  // (window.location may be unreliable before hydration in some setups)
  if (result.sharedMode === false && typeof window !== "undefined") {
    const after = extractShareParams();
    if (after.sharedMode) {
      setResult(after);
    }
  }

  return result;
}
