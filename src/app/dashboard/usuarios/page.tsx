import { requirePermission} from "@/lib/auth/authorize";
import UsuariosDashboardClient from "./UsuariosDashboardCLient"

export default async function DashboardPage() {
  const user = await requirePermission("DEPPI_ROLES");

  return <UsuariosDashboardClient userId={user.id}/>;
}