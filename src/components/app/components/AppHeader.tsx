"use client"

import { HeaderNavigationSection, HeaderAuthSection } from "./Header"
import { useHeaderHeight } from "@/components/app/providers/display-size-context"

export function AppHeader() {
  const headerHeight = useHeaderHeight()

  return (
    <header className="sticky top-0 z-0 w-full border-b bg-sidebar">
      <div
        className="container flex items-center px-4"
        style={{ height: `${headerHeight}px` }}
      >
        <HeaderNavigationSection />
        <HeaderAuthSection />
      </div>
    </header>
  )
}

