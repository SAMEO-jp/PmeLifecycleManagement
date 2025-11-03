"use client"

import { useState } from "react"
import {
  SidebarContent as ShadcnSidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Menu, Zap, UserPlus, PlusCircle, CheckSquare, History, ClipboardList, List, Settings, Wrench, FileText } from "lucide-react"
import { useMenuContext, ActiveView } from "@/components/app/components/Sidebar"

type MenuItem = 'project-join' | 'project-create' | 'project-task-create' | 'project-list' | 'tasks' | 'past-records' | 'task-types-management' | 'equipment-management' | 'task-create'

export function AchievementRecordSidebarSection() {
  const { activeView, setActiveView } = useMenuContext()
  const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null)

  const handleMenuClick = (menu: MenuItem) => {
    const newView: ActiveView = menu
    setActiveView(activeView === newView ? 'default' : newView)
    setActiveMenu(activeMenu === menu ? null : menu)
    console.log(`${menu} menu clicked`)
  }

  return (
    <ShadcnSidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="space-y-4 p-2">

            {/* カレンダーセクション */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  カレンダー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground text-center py-4">
                  カレンダーセクション（サンプル）
                </div>
              </CardContent>
            </Card>

            {/* メニューセクション */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  メニュー
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* プロジェクト参加メニュー */}
                <Button
                  variant={activeView === 'project-join' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('project-join')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  プロジェクト参加
                </Button>

                {/* プロジェクト追加メニュー */}
                <Button
                  variant={activeView === 'project-create' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('project-create')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  プロジェクト追加
                </Button>

                {/* プロジェクト一覧メニュー */}
                <Button
                  variant={activeView === 'project-list' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('project-list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  プロジェクト一覧
                </Button>

                {/* プロジェクトタスク作成メニュー */}
                <Button
                  variant={activeView === 'project-task-create' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('project-task-create')}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  プロジェクトタスク作成
                </Button>

                {/* タスクメニュー */}
                <Button
                  variant={activeView === 'tasks' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('tasks')}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  タスク
                </Button>

                {/* 過去実績メニュー */}
                <Button
                  variant={activeView === 'past-records' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('past-records')}
                >
                  <History className="h-4 w-4 mr-2" />
                  過去実績
                </Button>
              </CardContent>
            </Card>

            {/* データ管理セクション */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  データ管理
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* タスク種類管理メニュー */}
                <Button
                  variant={activeView === 'task-types-management' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('task-types-management')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  タスク種類管理
                </Button>

                {/* 設備管理メニュー */}
                <Button
                  variant={activeView === 'equipment-management' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('equipment-management')}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  設備管理
                </Button>

                {/* タスク作成メニュー */}
                <Button
                  variant={activeView === 'task-create' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleMenuClick('task-create')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  タスク作成
                </Button>
              </CardContent>
            </Card>

            {/* アクションセクション */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  アクション
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground text-center py-4">
                  アクションセクション（サンプル）
                </div>
              </CardContent>
            </Card>

          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </ShadcnSidebarContent>
  )
}
