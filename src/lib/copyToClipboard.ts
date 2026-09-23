"use client";

/**
 * Robust clipboard copy with fallback chain:
 *  1. navigator.clipboard.writeText (modern browsers, HTTPS required)
 *  2. document.execCommand('copy') + temporary textarea (legacy fallback)
 *
 * Returns { success, message } so callers can provide proper feedback.
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; message: string }> {
  // Try modern Clipboard API first
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: "分享链接已复制！" };
    } catch {
      console.warn("Clipboard API failed, trying fallback...", arguments);
    }
  }

  // Fallback: create a temporary textarea and use execCommand
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (ok) {
      return { success: true, message: "分享链接已复制！" };
    }
    throw new Error("execCommand copy returned false");
  } catch (err) {
    console.error("Clipboard fallback failed:", err);
    return { success: false, message: "复制失败，请手动复制：" + text };
  }
}
