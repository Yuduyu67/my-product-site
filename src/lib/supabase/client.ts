import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 安全创建 Supabase 客户端。
 * 当环境变量未配置（开发早期 / 未接入 Supabase）时返回 null，
 * 所有调用方需要处理 null 情况，不会导致白屏。
 */
export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !/^https?:\/\//.test(url)) {
    return null;
  }

  return createBrowserClient(url, key);
}
