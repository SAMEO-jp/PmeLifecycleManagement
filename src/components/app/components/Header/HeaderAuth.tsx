"use client"

import Link from "next/link"
import { UserButton, SignedIn, SignedOut } from "@daveyplate/better-auth-ui"
import { Button } from "@/components/ui/button"

export function HeaderAuth() {
  return (
    <section className="ml-auto flex items-center gap-4">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/sign-in">サインイン</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-up">サインアップ</Link>
          </Button>
        </div>
      </SignedOut>
    </section>
  )
}
