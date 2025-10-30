"use client"

import React from "react"
import { SidebarHeader } from "./Sidebar/SidebarHeader"
import { SidebarContent } from "./Sidebar/SidebarContent"
import { SidebarFooter } from "./Sidebar/SidebarFooter"
import { Sidebar } from "@/components/ui/sidebar"
import { MenuProvider } from "./Sidebar/contexts/MenuContext"

export const AppSidebar = React.memo(() => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </Sidebar>
  )
})

