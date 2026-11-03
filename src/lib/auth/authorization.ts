import type { AuthUser, Permission, Role } from "./types";

export function hasRole(user: AuthUser, roles: Role[]): boolean {
  return user.roles.some((role) => roles.includes(role));
}

export function hasPermission(user: AuthUser, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

export function hasAnyPermission(
  user: AuthUser,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}
