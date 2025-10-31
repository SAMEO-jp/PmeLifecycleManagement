"use client"

import { useMainSidebarWidth, useDisplayHeight, useHeaderHeight } from "@/components/app/providers/display-size-context"

interface RightTopSectionProps {
  title: string
  subtitle: string
}

export function RightTopSection({ title, subtitle }: RightTopSectionProps) {
  const mainSidebarWidth = useMainSidebarWidth()
  const displayHeight = useDisplayHeight()
  const headerHeight = useHeaderHeight()

  const sectionHeight = displayHeight - headerHeight
  const topSectionHeight = sectionHeight / 11
  const sectionWidth = mainSidebarWidth * 1.5

  return (
    <div
      className="bg-transparent border-b-2 border-gray-300 rounded-t-lg flex flex-col items-center justify-center p-4"
      style={{
        width: `${sectionWidth}px`,
        height: `${topSectionHeight}px`
      }}
    >
      <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{subtitle}</p>
    </div>
  )
}
