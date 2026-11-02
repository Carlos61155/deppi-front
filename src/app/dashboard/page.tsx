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
import { CourseStatusReport } from "@/services/dashboardService";
import { GetCoursesByStatusReport } from "@/services/dashboardService";
interface EnrollmentStatusReport {
  status: string;
  total: number;
}
type EnrollmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "CANCELED"
  | "COMPLETED";

const enrollmentLabels: Record<
  string,
  { label: string; color: string; textColor: string; icon: typeof Clock3 }
> = {
  PENDING: { label: "Pendente", color: "bg-amber-700", textColor: "text-amber-700", icon: Clock3 },
  APPROVED: { label: "Deferida", color: "bg-green-700", textColor: "text-green-700", icon: CircleCheck },
  REJECTED: { label: "Indeferida", color: "bg-red-700", textColor: "text-red-700", icon: CircleX },
  ACTIVE: { label: "Em andamento", color: "bg-blue-600", textColor: "text-blue-700", icon: Clock3 },
  COMPLETED: { label: "Concluída", color: "bg-teal-600", textColor: "text-teal-700", icon: CircleCheck },
  CANCELED: { label: "Cancelada", color: "bg-gray-500", textColor: "text-gray-600", icon: CircleX },
};
const allEnrollmentStatuses: EnrollmentStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ACTIVE",
  "COMPLETED",
  "CANCELED",
];

export default function DashboardPage() {
  const [report, setReport] = useState<GeneralReport | null>(null);
  const [statuses, setStatuses] = useState<EnrollmentStatusReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [courseStatuses, setCourseStatuses] = useState<CourseStatusReport[]>([]);
  const [courseStatusError, setCourseStatusError] = useState(false);

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
  async function loadCourseStatuses() {
    try {
      const result = await GetCoursesByStatusReport();
      setCourseStatuses(result);
    } catch {
      setCourseStatusError(true);
    }
  }

  void loadCourseStatuses();
}, []);

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

  const displayedStatuses = allEnrollmentStatuses.map((status) => ({
    status,
    total: statuses.find((item) => item.status === status)?.total ?? 0,
  }));
  const maxStatus = Math.max(1, ...displayedStatuses.map((item) => item.total));
const courseStatusConfig = {
  UNDER_REVIEW: { label: "Em análise", color: "#c45a00" },
  IN_PROGRESS: { label: "Em andamento", color: "#16803c" },
  COMPLETED: { label: "Concluído", color: "#2453e6" },
  CLOSED: { label: "Fechado", color: "#9ca3af" },
} as const;

const courseStatusItems = Object.entries(courseStatusConfig).map(
  ([status, config]) => ({
    status,
    ...config,
    total:
      courseStatuses.find((item) => item.status === status)?.total ?? 0,
  }),
);

const courseTotal = courseStatusItems.reduce(
  (sum, item) => sum + item.total,
  0,
);

let currentPercent = 0;
const donutStops =
  courseTotal === 0
    ? "#e5e7eb 0% 100%"
    : courseStatusItems
        .map((item) => {
          const start = currentPercent;
          currentPercent += (item.total / courseTotal) * 100;
          return `${item.color} ${start}% ${currentPercent}%`;
        })
        .join(", ");

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
            {displayedStatuses.map((item) => {
                const config = enrollmentLabels[item.status] ?? {
                  label: item.status,
                  color: "bg-gray-500",
                  textColor: "text-gray-600",
                  icon: Clock3,
                };
                const Icon = config.icon;
                const percentage = (item.total / maxStatus) * 100;

                return (
                  <div
                    key={item.status}
                    className="grid grid-cols-[130px_1fr_60px] items-center gap-3"
                  >
                    <span className={`flex items-center gap-2 text-sm ${config.textColor}`}>
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
              })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos por situação</CardTitle>
          </CardHeader>
        <CardContent>
  {courseStatusError ? (
    <p className="text-sm text-muted-foreground">
      Não foi possível carregar as situações dos cursos.
    </p>
  ) : (
    <div className="flex flex-wrap items-center justify-center gap-8 py-2">
      <div
        className="relative size-48 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${donutStops})` }}
        aria-label={`Total de ${courseTotal} cursos`}
      >
        <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-card">
          <strong className="text-3xl">{courseTotal}</strong>
          <span className="text-sm text-muted-foreground">cursos</span>
        </div>
      </div>

      <div className="min-w-48 space-y-3">
        {courseStatusItems.map((item) => (
          <div
            key={item.status}
            className="flex items-center justify-between gap-6"
          >
            <span className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
            <span className="font-medium">
              {item.total.toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )}
</CardContent>
        </Card>
      </section>
    </main>
  );
}
