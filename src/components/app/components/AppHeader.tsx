"use client"

import { HeaderNavigation, HeaderAuth } from "./Header"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <HeaderNavigation />
        <HeaderAuth />
      </div>
    </header>
  )
}

