"use client"

import { useMainSidebarWidth, useDisplayHeight, useHeaderHeight } from "@/components/app/providers/display-size-context"
import { useLeftSection } from "./Left/context"
import { LeftTopSection } from "./Left/LeftTopSection"
import { LeftBottomSection } from "./Left/LeftBottomSection"

interface LeftSectionProps {
  title?: string
  subtitle?: string
  content?: React.ReactNode
}

export function LeftSection({ title, subtitle, content }: LeftSectionProps = {}) {
  const mainSidebarWidth = useMainSidebarWidth()
  const displayHeight = useDisplayHeight()
  const headerHeight = useHeaderHeight()
  const { leftSectionData } = useLeftSection()

  const sectionHeight = displayHeight - headerHeight

  // propsが渡されていない場合はコンテキストからデータを取得
  const displayTitle = title ?? leftSectionData.title
  const displaySubtitle = subtitle ?? leftSectionData.subtitle
  const displayContent = content ?? leftSectionData.content

  return (
    <div
      className="bg-gray-100 border-2 border-gray-300 flex flex-col"
      style={{
        width: `${mainSidebarWidth}px`,
        height: `${sectionHeight}px`
      }}
    >
      <LeftTopSection title={displayTitle} subtitle={displaySubtitle} />
      <LeftBottomSection content={displayContent} />
    </div>
  )
}
