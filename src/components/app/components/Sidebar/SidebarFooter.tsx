"use client"
import React from "react"
import { authClient } from "@/core/better-auth/auth-client"
import NipponSteelUserButton from "./nipponSteelUserButton"

const SidebarFooter = React.memo(() => {
  // better-auth の useSession を直接使用
  const { data: session, isPending } = authClient.useSession()

  // ローディング中は何も表示しない
  if (isPending) {
    return null
  }

  // セッションがない場合は何も表示しない
  if (!session) {
    return null
  }

  return (
    <div className="border-t p-4 bg-primary/5 hover:bg-primary/10 transition-colors">
      <NipponSteelUserButton />
    </div>
  )
})

SidebarFooter.displayName = 'SidebarFooter'

export { SidebarFooter }