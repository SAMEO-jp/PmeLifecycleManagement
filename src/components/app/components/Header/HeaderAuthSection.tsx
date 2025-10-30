"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { authClient } from "@/core/better-auth/auth-client"

export function HeaderAuthSection() {
  const { data: session, isPending } = authClient.useSession()

  // ローディング中は何も表示しない
  if (isPending) {
    return null
  }

  // セッションがある場合は何も表示しない（UserButton はサイドバーに配置済み）
  if (session) {
    return null
  }

  return (
    <section className="ml-auto flex items-center gap-4">
      <div className="flex gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/auth/sign-in">サインイン</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">サインアップ</Link>
        </Button>
      </div>
    </section>
  )
}
