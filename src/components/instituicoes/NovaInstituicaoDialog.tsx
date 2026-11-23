"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateCampus, type CampusRow } from "@/services/dashboardService";

const emptyForm = {
  name: "",
  code: "",
  address: "",
  city: "",
  state: "",
  phone: "",
  email: "",
};

interface NovaInstituicaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (campus: CampusRow) => void;
}

export default function NovaInstituicaoDialog({
  open,
  onOpenChange,
  onCreated,
}: NovaInstituicaoDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const campus = await CreateCampus({
        name: form.name.trim(),
        code: form.code.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        phone: [form.phone.trim()],
        email: form.email.trim(),
      });

      onCreated(campus);
      setForm(emptyForm);
      onOpenChange(false);
    } catch (createError) {
      console.error("Não foi possível cadastrar a instituição:", createError);
      const apiMessage = (createError as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setFormError(apiMessage || "Não foi possível cadastrar. Confira os dados e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!saving) {
      if (nextOpen) setFormError("");
      onOpenChange(nextOpen);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-xl font-semibold">Nova instituição</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreate}>
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="institution-name">Nome</Label>
              <Input id="institution-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nome da instituição" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-code">CNPJ / código</Label>
              <Input id="institution-code" required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="00.000.000/0000-00" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-phone">Telefone</Label>
              <Input id="institution-phone" required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(00) 00000-0000" />
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="institution-address">Endereço</Label>
              <Input id="institution-address" required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Rua, número e bairro" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-city">Cidade</Label>
              <Input id="institution-city" required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Cidade" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-state">Estado (UF)</Label>
              <Input id="institution-state" required maxLength={2} value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} placeholder="CE" />
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="institution-email">E-mail institucional</Label>
              <Input id="institution-email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="contato@instituicao.edu.br" />
            </div>

            {formError && (
              <p role="alert" className="flex items-center gap-2 text-sm text-destructive sm:col-span-2">
                <AlertCircle className="size-4 shrink-0" />
                {formError}
              </p>
            )}
          </div>

          <DialogFooter className="px-6 py-4">
            <Button type="button" variant="outline" disabled={saving} onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="gap-2 bg-orange-700 text-white hover:bg-orange-800">
              <Plus />
              {saving ? "Cadastrando..." : "Cadastrar instituição"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
