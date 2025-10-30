import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app/components/AppHeader";
import { AppSidebar } from "@/components/app/components/AppSidebar";
import { MenuProvider } from "@/components/app/components/Sidebar";
import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <MenuProvider>
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
    </MenuProvider>
  );
}
