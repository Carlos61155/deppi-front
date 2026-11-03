import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth/session";
import type { AuthUser, Permission, Role } from "./types";

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles: Role[]): Promise<AuthUser> {
  const user = await requireUser();

  if (!user.roles.some((role) => roles.includes(role))) {
    redirect("/forbidden");
  }

  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<AuthUser> {
  const user = await requireUser();

  if (!user.permissions.includes(permission)) {
    redirect("/forbidden");
  }

  return user;
}
