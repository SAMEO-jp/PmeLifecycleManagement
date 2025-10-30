"use client"

import Image from "next/image"
import Link from "next/link"
import { UserButton, SignedIn, SignedOut } from "@daveyplate/better-auth-ui"
import { Button } from "@/components/ui/button"
import { PLMLogo } from "@/components/ui/plm-logo"

export default function SamplePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between mb-8">
          <PLMLogo className="text-black dark:text-zinc-50" size="md" />
          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="flex items-center gap-4">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/auth/sign-in">サインイン</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">サインアップ</Link>
                </Button>
              </div>
            </SignedOut>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            PME Lifecycle Management
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <SignedIn>
              ようこそ、PME設備のライフサイクル管理システムへ
            </SignedIn>
            <SignedOut>
              PME設備のライフサイクル管理システムへようこそ。サインインして開始してください。
            </SignedOut>
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  )
}

