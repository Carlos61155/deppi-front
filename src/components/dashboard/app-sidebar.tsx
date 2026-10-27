"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  GraduationCap,
  House,
  LogOut,
  UserRound,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";

const items = [
  { title: "Início", url: "/dashboard", icon: House },
  { title: "Cursos", url: "/dashboard/cursos", icon: GraduationCap },
  { title: "Instituições", url: "/dashboard/instituicoes", icon: Building2 },
  { title: "Usuários", url: "/dashboard/usuarios", icon: Users },
  { title: "Relatórios", url: "/dashboard/relatorios", icon: BarChart3 },
  { title: "Perfil", url: "/dashboard/perfil", icon: UserRound },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <Sidebar className="border-r bg-[#f5f4f0]">
      <SidebarHeader className="px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--verde-if)] font-bold text-white">
            D
          </span>
          <span>
            <span className="block font-bold">DEPPI</span>
            <span className="block text-xs text-muted-foreground">
              IFCE · Extensão
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">
            Administração
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  pathname === item.url ||
                  (item.url !== "/dashboard" &&
                    pathname.startsWith(`${item.url}/`));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={active}
                      className="h-12 rounded-lg px-4 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-800"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
