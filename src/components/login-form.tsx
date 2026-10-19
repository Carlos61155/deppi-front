"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { getCurrentUser, login } from "@/services/authService";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await login({
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      const user = await getCurrentUser();

      const roleHomeRoutes = [
        { role: "ADMIN", path: "/dashboard" },
        { role: "ALUNO", path: "/dashboard/aluno" },
        { role: "PROFESSOR", path: "/dashboard/professor" },
        { role: "DEPPI", path: "/dashboard/deppi" },
      ];

      const destination = roleHomeRoutes.find(({ role }) =>
        user.roles.includes(role),
      )?.path;

      if (!destination) {
        localStorage.removeItem("token");
        setMessage("Não há uma tela inicial configurada para seu cargo.");
        return;
      }

      router.replace(destination);
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      setMessage(
        "Não foi possível entrar. Confira suas credenciais e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-red">Entrar</CardTitle>
          <CardDescription>Use seu e-mail institucional.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail institucional</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="aluno@ifce.edu.br"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>

                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--verde-if)]"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>

                {message && (
                  <p role="status" aria-live="polite" className="text-sm">
                    {message}
                  </p>
                )}

                <FieldDescription className="text-center">
                  Ainda não tem conta?{" "}
                  <a href="#" className="text-[var(--verde-if)]">
                    Crie sua conta
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
