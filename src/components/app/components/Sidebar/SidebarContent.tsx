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
import { AchievementRecordSidebarSection } from "./featuer/achievement-recode/AchievementRecordSidebarSection"

export function SidebarContent() {
  const pathname = usePathname()
  const { menuItems } = useMenuContext()

  // achievement-recordページの場合、特別なコンテンツを表示
  if (pathname === "/achievement/achievement-record") {
    return <AchievementRecordSidebarSection />
  }

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
