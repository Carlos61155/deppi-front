import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/authorize";

export default async function DashboardEntryPage() {
  const user = await requireUser();

  if (user.roles.includes("ADMIN")) {
    redirect("/dashboard/admin");
  }

  if (user.roles.includes("ALUNO")) {
    redirect("/dashboard/aluno");
  }

  if (user.roles.includes("PROFESSOR")) {
    redirect("/dashboard/professor");
  }

  if (user.roles.includes("DEPPI")) {
    redirect("/dashboard/deppi");
  }

  redirect("/forbidden");
}