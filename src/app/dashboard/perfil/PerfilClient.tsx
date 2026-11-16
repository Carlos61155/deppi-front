"use client";

import { useState } from "react";

export default function PerfilClient() {
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Depois: validar e enviar as alterações para a API.
  }

  return (
    <main className="p-6 md:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Perfil</h1>
        <p className="text-muted-foreground">
          Seus dados e sua senha de acesso.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
        {/* Cartão de resumo */}
        <section className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-semibold"
              aria-label="Iniciais de Márcia Holanda"
            >
              MH
            </div>

            <div>
              <h2 className="text-xl font-semibold">Márcia Holanda</h2>
              <p className="text-sm text-muted-foreground">
                marcia.holanda@ifce.edu.br
              </p>
            </div>
          </div>

          <hr className="my-5" />

          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">SIAPE</dt>
              <dd>1840221</dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Cargos</dt>
              <dd className="mt-1">
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm text-green-800">
                  DEPPI
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Conta criada em</dt>
              <dd>02/09/2026</dd>
            </div>
          </dl>
        </section>

        {/* Formulário de edição */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-card p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Editar perfil</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Nome</span>
              <input
                name="nome"
                defaultValue="Márcia Holanda"
                autoComplete="name"
                className="w-full rounded-lg border bg-background px-4 py-3"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">
                Nome social <span className="text-muted-foreground">(opcional)</span>
              </span>
              <input
                name="nomeSocial"
                placeholder="Como prefere ser chamado(a)"
                autoComplete="nickname"
                className="w-full rounded-lg border bg-background px-4 py-3"
              />
            </label>
          </div>

          <hr className="my-5" />

          <h2 className="mb-4 text-lg font-semibold">Trocar senha</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Nova senha</span>
              <span className="flex rounded-lg border bg-background">
                <input
                  name="novaSenha"
                  type={mostrarNovaSenha ? "text" : "password"}
                  minLength={8}
                  autoComplete="new-password"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarNovaSenha((visivel) => !visivel)}
                  className="px-4 text-sm text-muted-foreground"
                  aria-label={mostrarNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarNovaSenha ? "Ocultar" : "Mostrar"}
                </button>
              </span>
              <span className="block text-sm text-muted-foreground">
                Mínimo de 8 caracteres.
              </span>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Confirmar nova senha</span>
              <span className="flex rounded-lg border bg-background">
                <input
                  name="confirmarSenha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  minLength={8}
                  autoComplete="new-password"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacao((visivel) => !visivel)}
                  className="px-4 text-sm text-muted-foreground"
                  aria-label={
                    mostrarConfirmacao ? "Ocultar confirmação" : "Mostrar confirmação"
                  }
                >
                  {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
                </button>
              </span>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}