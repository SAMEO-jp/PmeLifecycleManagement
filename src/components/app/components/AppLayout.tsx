import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app/components/AppHeader";
import { AppSidebar } from "@/components/app/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarRail />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
