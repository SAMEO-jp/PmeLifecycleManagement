"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/core/better-auth/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PLMLogo } from "@/components/ui/plm-logo"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/auth/sign-in" }: AuthGuardProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(redirectTo)
    }
  }, [session, isPending, router, redirectTo])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-6 text-center">
            <PLMLogo className="text-black dark:text-zinc-50" size="md" />
            <Spinner className="size-8 animate-spin text-primary" />
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                認証状態を確認中...
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                しばらくお待ちください
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-6 text-center">
            <PLMLogo className="text-black dark:text-zinc-50" size="md" />
            <div className="space-y-4">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                PME設備のライフサイクル管理システムへようこそ
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                このページにアクセスするには、サインインが必要です。
                サインインして開始してください。
              </p>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-4">
              <Button asChild size="lg">
                <Link href={redirectTo}>サインイン</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">ホームに戻る</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

