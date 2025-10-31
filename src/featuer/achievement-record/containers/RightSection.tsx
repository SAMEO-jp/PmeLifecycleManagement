"use client"

import { useDisplayHeight, useHeaderHeight, useMainSidebarWidth } from "@/components/app/providers/display-size-context"

export function RightSection() {
  const displayHeight = useDisplayHeight()
  const headerHeight = useHeaderHeight()
  const mainSidebarWidth = useMainSidebarWidth()

  const sectionHeight = displayHeight - headerHeight
  const sectionWidth = mainSidebarWidth * 1.5

  return (
    <div
      className="bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
      style={{
        width: `${sectionWidth}px`,
        height: `${sectionHeight}px`
      }}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">右の四角</h2>
        <p className="text-sm text-gray-500">実績・成果ページ</p>
      </div>
    </div>
  )
}
