import { requireRole } from "@/lib/auth/authorize";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function DashboardPage() {
  const user = await requireRole(["ADMIN"]);

  return <AdminDashboardClient user={user} />;
}