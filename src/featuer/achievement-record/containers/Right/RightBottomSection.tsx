"use client"

import { useMainSidebarWidth, useDisplayHeight, useHeaderHeight } from "@/components/app/providers/display-size-context"

interface RightBottomSectionProps {
  content: React.ReactNode
}

export function RightBottomSection({ content }: RightBottomSectionProps) {
  const mainSidebarWidth = useMainSidebarWidth()
  const displayHeight = useDisplayHeight()
  const headerHeight = useHeaderHeight()

  const sectionHeight = displayHeight - headerHeight
  const bottomSectionHeight = sectionHeight * 10 / 11
  const sectionWidth = mainSidebarWidth * 1.5

  return (
    <div
      className="bg-transparent flex items-center justify-center p-4"
      style={{
        width: `${sectionWidth}px`,
        height: `${bottomSectionHeight}px`
      }}
    >
      <div className="w-full h-full">
        {content}
      </div>
    </div>
  )
}
