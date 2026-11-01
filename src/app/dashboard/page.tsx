"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import { getCurrentUser } from "@/services/authService";
import {
  GetGeneralReport,
  type GeneralReport,
} from "@/services/dashboardService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartColumn, Clock3, CircleCheck, CircleX } from "lucide-react";

interface EnrollmentStatusReport {
  status: string;
  total: number;
}
type EnrollmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

interface EnrollmentItem {
  id: string;
  status: EnrollmentStatus;
  createdAt: string;
  course: {
    id: string;
    title: string;
  };
  student: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}
const enrollmentLabels: Record<
  string,
  { label: string; color: string; icon: typeof Clock3 }
> = {
  PENDING: { label: "Pendente", color: "bg-amber-600", icon: Clock3 },
  APPROVED: { label: "Deferida", color: "bg-green-600", icon: CircleCheck },
  REJECTED: { label: "Indeferida", color: "bg-red-600", icon: CircleX },
  CANCELED: { label: "Cancelada", color: "bg-gray-500", icon: CircleX },
};

export default function DashboardPage() {
  const [report, setReport] = useState<GeneralReport | null>(null);
  const [statuses, setStatuses] = useState<EnrollmentStatusReport[]>([]);
const [selectedStatus, setSelectedStatus] =useState<EnrollmentStatus>("PENDING");
const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const user = await getCurrentUser();

        if (!user.roles.includes("ADMIN")) {
          setForbidden(true);
          return;
        }

        const [generalReport, statusResponse] = await Promise.all([
          GetGeneralReport(),
          api.get<EnrollmentStatusReport[]>("enrollments/enrollment/status"),
        ]);

        setReport(generalReport);
        setStatuses(statusResponse.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);
useEffect(() => {
  async function loadEnrollments() {
    setEnrollmentsLoading(true);

    try {
      const response = await api.get<EnrollmentItem[]>(
        `enrollments/status/${selectedStatus}`,
      );
      setEnrollments(response.data);
    } catch {
      setEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  }

  void loadEnrollments();
}, [selectedStatus]);

  if (loading) {
    return <main className="p-8">Carregando o painel...</main>;
  }

  if (forbidden) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">403 — Acesso negado</h1>
        <p className="text-muted-foreground">
          Este painel está disponível apenas para administradores.
        </p>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Não foi possível carregar o painel
        </h1>
        <p className="text-muted-foreground">
          Confira sua conexão e tente novamente.
        </p>
      </main>
    );
  }

  const metrics = [
    {label: "Usuários", value: report.totalUsers},
    { label: "Alunos", value: report.totalStudents },
    { label: "Professores/servidores", value: report.totalCivilServants },
    { label: "Cursos", value: report.totalCourses },
    { label: "Inscrições", value: report.totalEnrollments },
    { label: "Instituições", value: report.totalCampus },
    { label: "Vagas restantes", value: report.totalRemainingSpots },
  ];

  const maxStatus = Math.max(1, ...statuses.map((item) => item.total));

  return (
    <main className="space-y-7 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bom dia, administrador
          </h1>
          <p className="mt-1 text-muted-foreground">
            Visão geral da plataforma DEPPI
          </p>
        </div>

        <Button variant="outline" className="gap-2">
          <ChartColumn className="size-4" />
          Ver relatórios
        </Button>
      </div>

      <section
        aria-label="Indicadores gerais"
        className="grid overflow-hidden rounded-xl border bg-card sm:grid-cols-2 xl:grid-cols-7"
      >
        {metrics.map((metric) => (
          <div key={metric.label} className="border-b p-5 xl:border-b-0 xl:border-r">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-3xl font-semibold">
              {metric.value.toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Inscrições por situação</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {statuses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma inscrição encontrada.
              </p>
            ) : (
              statuses.map((item) => {
                const config = enrollmentLabels[item.status] ?? {
                  label: item.status,
                  color: "bg-gray-500",
                  icon: Clock3,
                };
                const Icon = config.icon;
                const percentage = (item.total / maxStatus) * 100;

                return (
                  <div
                    key={item.status}
                    className="grid grid-cols-[130px_1fr_60px] items-center gap-3"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <Icon className="size-4" />
                      {config.label}
                    </span>

                    <div className="h-3 overflow-hidden rounded bg-muted">
                      <div
                        className={`h-full rounded ${config.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="text-right text-sm font-medium">
                      {item.total.toLocaleString("pt-BR")}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos por situação</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-56 items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              Para exibir este gráfico, conecte aqui o endpoint de cursos por
              situação da sua API.
            </p>
          </CardContent>
        </Card>
      </section>
      <section className="space-y-4">
  <h2 className="text-xl font-semibold">Inscrições por situação</h2>

  <label className="flex flex-wrap items-center gap-3">
    <span className="text-sm">Situação:</span>
    <select
      value={selectedStatus}
      onChange={(event) =>
        setSelectedStatus(event.target.value as EnrollmentStatus)
      }
      className="rounded-md border bg-background px-3 py-2"
    >
      <option value="PENDING">Pendentes</option>
      <option value="APPROVED">Deferidas</option>
      <option value="REJECTED">Indeferidas</option>
      <option value="CANCELED">Canceladas</option>
    </select>
  </label>

  {enrollmentsLoading ? (
    <p>Carregando inscrições...</p>
  ) : enrollments.length === 0 ? (
    <p className="text-sm text-muted-foreground">
      Nenhuma inscrição encontrada nessa situação.
    </p>
  ) : (
    <div className="space-y-3">
      {enrollments.map((enrollment) => (
        <article key={enrollment.id} className="rounded-lg border p-4">
          <p className="font-medium">{enrollment.student.user.name}</p>
          <p className="text-sm text-muted-foreground">
            {enrollment.student.user.email}
          </p>
          <p className="mt-2 text-sm">Curso: {enrollment.course.title}</p>
          <p className="text-sm">
            Inscrição em:{" "}
            {new Date(enrollment.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </article>
      ))}
    </div>
  )}
</section>
    </main>
  );
}