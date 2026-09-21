import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase @ssr v0.12+ 已改用 cookie 自动鉴权，
 * middleware 中不需要显式创建 Supabase 客户端。
 * 此函数为占位出口——后续需要验证 session 时可接入 server.ts 的 createClient()。
 */
export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request });
}
