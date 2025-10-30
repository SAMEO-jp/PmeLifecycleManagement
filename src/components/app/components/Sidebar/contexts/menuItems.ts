import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Building2,
  Wrench
} from "lucide-react"
import { MenuItem } from "./MenuContext"

export const menuItems: MenuItem[] = [
  {
    title: "ダッシュボード",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "設備管理",
    url: "/equipment",
    icon: Building2,
  },
  {
    title: "メンテナンス",
    url: "/maintenance",
    icon: Wrench,
  },
  {
    title: "レポート",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "文書管理",
    url: "/documents",
    icon: FileText,
  },
]
