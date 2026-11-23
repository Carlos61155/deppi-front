"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetCampuses, type CampusRow } from "@/services/dashboardService";
import NovaInstituicaoDialog from "@/components/instituicoes/NovaInstituicaoDialog";

export default function InstituicoesDashboardClient() {
  const [campuses, setCampuses] = useState<CampusRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadCampuses() {
      try {
        const response = await GetCampuses();
        setCampuses(response);
      } catch (loadError) {
        console.error("Não foi possível carregar as instituições:", loadError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadCampuses();
  }, []);

  const filteredCampuses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return campuses;

    return campuses.filter((campus) =>
      [campus.name, campus.city, campus.state, campus.code]
        .some((value) => value.toLocaleLowerCase("pt-BR").includes(query)),
    );
  }, [campuses, search]);

  return (
    <main className="space-y-5 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instituições</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {campuses.length.toLocaleString("pt-BR")} instituições cadastradas
          </p>
        </div>
        <Button
          type="button"
          className="h-10 gap-2 bg-orange-700 px-4 text-white hover:bg-orange-800"
          onClick={() => setDialogOpen(true)}
        >
          <Plus />
          Nova instituição
        </Button>
      </div>

      <NovaInstituicaoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={(campus) => setCampuses((current) => [campus, ...current])}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome, campus ou cidade"
          className="h-10 bg-background pl-10"
          aria-label="Buscar instituições por nome, campus, cidade ou CNPJ"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Carregando instituições...</p>}
      {error && (
        <p className="text-sm text-destructive">
          Não foi possível carregar as instituições. Tente novamente.
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/70 hover:bg-muted/70">
                <TableHead className="h-9 px-4">Nome</TableHead>
                <TableHead className="h-9 px-4">Campus</TableHead>
                <TableHead className="h-9 px-4">Cidade</TableHead>
                <TableHead className="h-9 px-4">CNPJ</TableHead>
                <TableHead className="h-9 w-24 px-4"><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampuses.map((campus) => (
                <TableRow key={campus.id}>
                  <TableCell className="px-4 font-medium">{campus.name}</TableCell>
                  <TableCell className="px-4">{campus.city}</TableCell>
                  <TableCell className="px-4 text-muted-foreground">
                    {campus.city}/{campus.state}
                  </TableCell>
                  <TableCell className="px-4 font-mono text-xs">{campus.code}</TableCell>
                  <TableCell className="px-3">
                    <div className="flex justify-end gap-1">
                      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Editar ${campus.name}`} title="Editar instituição">
                        <Pencil className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" aria-label={`Excluir ${campus.name}`} title="Excluir instituição">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCampuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {search ? "Nenhuma instituição encontrada." : "Nenhuma instituição cadastrada."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
