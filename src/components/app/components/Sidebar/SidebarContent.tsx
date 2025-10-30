"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarContent as ShadcnSidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useMenuContext } from "./contexts/MenuContext"

export function SidebarContent() {
  const pathname = usePathname()
  const { menuItems } = useMenuContext()

  return (
    <ShadcnSidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>メインメニュー</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </ShadcnSidebarContent>
  )
}
