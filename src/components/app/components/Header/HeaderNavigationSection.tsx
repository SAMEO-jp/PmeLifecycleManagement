"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"


export function HeaderNavigationSection() {
  return (
    <section className="flex items-center gap-4">
      <SidebarTrigger />
    </section>
  )
}
