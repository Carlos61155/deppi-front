"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/Can";
import { GrantRoleDialog } from "@/components/auth/GrantRoleDialog";
import type { AvailableRole } from "@/services/dashboardService";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetUsers, type UserRow } from "@/services/dashboardService";

type UsuariosDashboardCLientProps = {
  userId: string;
};

export default function UsuariosDashboardClient({
  userId,
}:UsuariosDashboardCLientProps){
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await GetUsers();
        setUsers(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Não foi possível carregar os usuários:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [search, users]);

  return (
    <main className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total.toLocaleString("pt-BR")} usuários cadastrados
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou e-mail"
          className="pl-9"
          aria-label="Buscar usuários por nome ou e-mail"
        />
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Carregando usuários...
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive">
          Não foi possível carregar os usuários. Tente novamente.
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cargos</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles.map((role) => role.name).join(", ") ||
                      "Sem cargo"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                  <Can permissions={["MANAGE_USERS"]}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedUser(user)}
                    >
                      <ShieldPlus />
                      Conceder cargo
                    </Button>
                  </Can>
                </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <GrantRoleDialog
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onGranted={(userId, grantedRole: AvailableRole) => {
              setUsers((currentUsers) =>
                currentUsers.map((user) => {
                  if (user.id !== userId) return user;

                  const alreadyHasRole = user.roles.some(
                    (role) => role.slug === grantedRole.slug,
                  );

                  if (alreadyHasRole) return user;

                  return {
                    ...user,
                    roles: [
                      ...user.roles,
                      {
                        id: grantedRole.id,
                        name: grantedRole.name,
                        slug: grantedRole.slug,
                      },
                    ],
                  };
                }),
              );
            }}
          />
        </div>
      )}
    </main>
  );
}