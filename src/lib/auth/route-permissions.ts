import type { Permission, Role } from "../auth/types";

type RouteRule = {
  path: string;
  roles?: Role[];
  permissions?: Permission[];
};

export const routePermissions: RouteRule[] = [
  {
    path: "/dashboard/admin",
    roles: ["ADMIN"],
  },
  {
    path: "/admin/roles",
    permissions: ["MANAGE_ROLES"],
  },
];

export function findRouteRule(pathname: string) {
  return routePermissions
    .filter((rule) => {
      return pathname === rule.path || pathname.startsWith(`${rule.path}/`);
    })
    .sort((a, b) => b.path.length - a.path.length)[0];
}
