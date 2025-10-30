"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PLMLogo } from "@/components/ui/plm-logo"

export function HeaderNavigation() {
  return (
    <section className="flex items-center gap-4">
      <SidebarTrigger />
      <Link href="/" className="flex items-center gap-2">
        <PLMLogo className="text-foreground" size="md" />
      </Link>
    </section>
  )
}
