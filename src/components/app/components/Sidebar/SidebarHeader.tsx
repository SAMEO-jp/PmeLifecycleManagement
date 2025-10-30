
import { SidebarHeader as ShadcnSidebarHeader } from "@/components/ui/sidebar"
import { Building2 } from "lucide-react"

export function SidebarHeader() {
  return (
    <ShadcnSidebarHeader className="border-b p-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">PME System</span>
          <span className="text-xs text-muted-foreground">設備管理システム</span>
        </div>
      </div>
    </ShadcnSidebarHeader>
  )
}
