
import { SidebarHeader as ShadcnSidebarHeader } from "@/components/ui/sidebar"
import { Building2 } from "lucide-react"
import { useHeaderHeight } from "@/components/app/providers/display-size-context"
import Link from "next/link"

export function SidebarHeader() {
  const headerHeight = useHeaderHeight()

  // アイコンサイズ: ヘッダー高さの60%
  const iconSize = Math.floor(headerHeight * 0.6)
  // 文字サイズ: ヘッダー高さの20%
  const fontSize = Math.floor(headerHeight * 0.3)

  return (
    <ShadcnSidebarHeader
      className="border-b p-4"
      style={{ height: `${headerHeight}px` }}
    >
      <div className="flex justify-center items-center h-full">
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" style={{ transform: 'translateX(-20%)' }}>
          <div
            className="flex items-center justify-center rounded-full bg-primary text-primary-foreground"
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          >
            <Building2 style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }} />
          </div>
          <div className="flex flex-col">
            <span
              className="font-semibold"
              style={{ fontSize: `${fontSize}px` }}
            >
              PME System
            </span>
          </div>
        </Link>
      </div>
    </ShadcnSidebarHeader>
  )
}
