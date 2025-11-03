"use client"

import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app/components/AppHeader";
import { AppSidebar } from "@/components/app/components/AppSidebar";
import { MenuProvider } from "@/components/app/components/Sidebar";
import { DevagLayout } from "@/components/app/components/DevagLayout/DevagLayout";
import { useMainSidebarWidth } from "@/components/app/providers/display-size-context";
import { LeftSectionProvider } from "@/featuer/achievement-record/containers/Left/context";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const mainSidebarWidth = useMainSidebarWidth()

  const mainContent = (
    <MenuProvider>
      <SidebarProvider
        defaultOpen={true}
        style={{ "--sidebar-width": `${mainSidebarWidth}px` } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarRail />
        <SidebarInset className="flex flex-col h-screen">
          <AppHeader />
          <main
            className="flex-1 overflow-y-scroll p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </MenuProvider>
  );

  return (
    <LeftSectionProvider>
      <DevagLayout>{mainContent}</DevagLayout>
    </LeftSectionProvider>
  );
}
