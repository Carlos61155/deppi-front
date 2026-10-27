import type { ReactNode } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-h-screen bg-[#faf9f6]">
        <header className="flex h-[74px] shrink-0 items-center gap-3 border-b px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground">Início</span>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-right">
              <span className="block text-sm font-semibold">Administrador</span>
              <span className="block text-[10px] font-bold tracking-widest text-[var(--verde-if)]">
                ADMIN
              </span>
            </span>
            <div className="flex size-10 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold">
              AD
            </div>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}