"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/authContext";
import { hasPermission } from "@/lib/auth/authorization";
import type { Permission } from "@/lib/auth/types";

type CanProps = {
  permissions: Permission[];
  children: ReactNode;
};

export function Can({ permissions, children }: CanProps) {
  const { user } = useAuth();
  const userPermissions = user?.permissions ?? [];

  const allowed = permissions.every((permission) =>
    hasPermission({ ...user, permissions: userPermissions },
      permission,
    ),
  );

  return allowed ? children : null;
}