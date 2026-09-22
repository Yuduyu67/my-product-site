import type { SupabaseClient } from "@supabase/supabase-js";

export type SiteRole = "student" | "teacher";

export interface RoleCheck {
  ok: boolean;
  message?: string;
}

const ROLE_LABEL: Record<SiteRole, string> = {
  student: "学生",
  teacher: "教师",
};

/**
 * 保证当前登录用户持有期望身份的 profile 记录。
 * - 尚无 profile → 以期望身份创建（同时记录邮箱）
 * - profile 身份不符 → 登出并拒绝（学生 / 教师账号不通用）
 */
export async function ensureRole(supabase: SupabaseClient, role: SiteRole): Promise<RoleCheck> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "未登录" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const existing = (profile as { role: string } | null)?.role;

  if (!existing) {
    // Use upsert instead of insert to avoid duplicate key errors on retry
    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      role,
      email: user.email ?? "",
    });
    if (error) return { ok: false, message: `创建账号档案失败：${error.message}` };
    return { ok: true };
  }

  if (existing !== role) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: `该邮箱已注册为${ROLE_LABEL[existing as SiteRole] ?? existing}账号。学生与教师账号不通用，请从${ROLE_LABEL[existing as SiteRole] ?? existing}入口登录。`,
    };
  }

  return { ok: true };
}
