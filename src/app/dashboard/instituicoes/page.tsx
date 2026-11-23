import { requireRole } from "@/lib/auth/authorize";
import InstituicoesDashboardClient from "./InstituicoesDashboardClient";

export default async function DashboardInstituicoesClient() {
  await requireRole(["ADMIN"]);

  return <InstituicoesDashboardClient />;
}
