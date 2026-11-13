export type Role = "ADMIN" | "DEPPI" | "PROFESSOR" | "ALUNO";

export type Permission = "MANAGE_USERS" | "MANAGE_ROLES" | "DEPPI_ROLES";

export type AuthUser = {
  id: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
};
