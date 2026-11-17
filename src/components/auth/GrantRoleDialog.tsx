"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  AssignRole,
  GetRoles,
  type AvailableRole,
  type UserRow,
} from "@/services/dashboardService";

const roleDescriptions: Record<AvailableRole["slug"], string> = {
  DEPPI: "Analisa inscrições e gerencia cursos e professores.",
  ADMIN: "Gerencia instituições, usuários e relatórios.",
  PROFESSOR: "Acessa as funcionalidades de professor.",
  ALUNO: "Acessa as funcionalidades de aluno.",
};

type GrantRoleDialogProps = {
  user: UserRow | null;
  onClose: () => void;
  onGranted: (userId: string, role: AvailableRole) => void;
};

export function GrantRoleDialog({
  user,
  onClose,
  onGranted,
}: GrantRoleDialogProps) {
  const [roles, setRoles] = useState<AvailableRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadRoles() {
      setLoadingRoles(true);
      setError("");
      setSelectedRoleId("");

      try {
        const result = await GetRoles();
        if (!cancelled) setRoles(result);
      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar os cargos.");
        }
      } finally {
        if (!cancelled) setLoadingRoles(false);
      }
    }

    void loadRoles();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const currentRoleSlugs = new Set(user?.roles.map((role) => role.slug) ?? []);
  const grantableRoles = roles.filter(
    (role) => !currentRoleSlugs.has(role.slug),
  );
  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  async function handleGrant() {
    if (!user || !selectedRole) return;

    setSaving(true);
    setError("");

    try {
      await AssignRole(user.id, selectedRole.id);
      onGranted(user.id, selectedRole);
      onClose();
    } catch {
      setError("Não foi possível conceder o cargo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Conceder cargo</DialogTitle>
          <DialogDescription>
            Escolha o cargo para{" "}
            <strong className="text-foreground">{user?.name}</strong>. Os
            cargos atuais são mantidos.
          </DialogDescription>
        </DialogHeader>

        {loadingRoles ? (
          <p className="text-sm text-muted-foreground">Carregando cargos...</p>
        ) : grantableRoles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este usuário já possui todos os cargos disponíveis.
          </p>
        ) : (
          <RadioGroup
            value={selectedRoleId}
            onValueChange={(value) => setSelectedRoleId(String(value))}
            className="gap-3"
          >
            {grantableRoles.map((role) => (
              <Label
                key={role.id}
                htmlFor={`role-${role.id}`}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  selectedRoleId === role.id
                    ? "border-orange-600 bg-orange-50"
                    : "bg-background"
                }`}
              >
                <RadioGroupItem
                  id={`role-${role.id}`}
                  value={role.id}
                  className="mt-1"
                />
                <span>
                  <span className="block font-semibold">{role.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {roleDescriptions[role.slug]}
                  </span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        )}

        <p className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
          Esta ação concede acesso ao usuário. A remoção de cargos deve ser
          feita por uma operação própria.
        </p>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleGrant}
            disabled={!selectedRole || saving || loadingRoles}
            className="bg-orange-700 text-white hover:bg-orange-800"
          >
            {saving
              ? "Concedendo..."
              : `Conceder ${selectedRole?.name ?? "cargo"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}