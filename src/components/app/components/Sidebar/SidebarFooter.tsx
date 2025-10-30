"use client"
import React from "react"
import { UserButton } from "@daveyplate/better-auth-ui"
import { authClient } from "@/core/better-auth/auth-client"

export const SidebarFooter = React.memo(() => {
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
      <UserButton key="user-button" className="custom-user-button" />
    </div>
  )
})