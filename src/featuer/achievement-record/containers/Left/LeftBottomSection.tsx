"use client"

import { useMainSidebarWidth, useDisplayHeight, useHeaderHeight } from "@/components/app/providers/display-size-context"

interface LeftBottomSectionProps {
  content: React.ReactNode
}

export function LeftBottomSection({ content }: LeftBottomSectionProps) {
  const mainSidebarWidth = useMainSidebarWidth()
  const displayHeight = useDisplayHeight()
  const headerHeight = useHeaderHeight()

  const sectionHeight = displayHeight - headerHeight
  const bottomSectionHeight = sectionHeight * 10 / 11

  return (
    <div
      className="bg-transparent flex items-center justify-center p-4"
      style={{
        width: `${mainSidebarWidth}px`,
        height: `${bottomSectionHeight}px`
      }}
    >
      <div className="w-full h-full">
        {content}
      </div>
    </div>
  )
}
