"use client"

import { LeftSection } from "./containers/LeftSection"
import { CenterSection } from "./containers/CenterSection"
import { RightSection } from "./containers/RightSection"
import { useLeftSection } from "./containers/Left/context"
import { useMenuContext } from "@/components/app/components/Sidebar"
import { LeftProjectMakeComponent } from "./containers/Left/project/LeftProjectMakeComponent"
import { LeftProjectListComponent } from "./containers/Left/project/LeftProjectListComponent"
import { TaskTypesManagementComponent } from "./containers/Left/management/TaskTypesManagementComponent"
import { EquipmentManagementComponent } from "./containers/Left/management/EquipmentManagementComponent"
import { TaskCreationComponent } from "./containers/Left/management/TaskCreationComponent"

export function AchivmentRecodePage() {
  const { isVisible } = useLeftSection()
  const { activeView } = useMenuContext()

  // 左セクションのコンテンツを動的に決定
  const getLeftSectionProps = () => {
    switch (activeView) {
      case 'project-join':
        return {
          title: "プロジェクト参加",
          subtitle: "参加可能なプロジェクト",
          content: <LeftProjectMakeComponent mode="join" />
        }
      case 'project-create':
        return {
          title: "プロジェクト追加",
          subtitle: "新規プロジェクト作成",
          content: <LeftProjectMakeComponent mode="create" />
        }
      case 'project-list':
        return {
          title: "プロジェクト一覧",
          subtitle: "全プロジェクトとタスク情報",
          content: <LeftProjectListComponent />
        }
      case 'project-task-create':
        return {
          title: "プロジェクトタスク作成",
          subtitle: "プロジェクトにタスクを追加",
          content: <div className="p-4 text-center text-muted-foreground">プロジェクトタスク作成機能（開発中）</div>
        }
      case 'task-types-management':
        return {
          title: "タスク種類管理",
          subtitle: "タスク種類の作成・編集・削除",
          content: <TaskTypesManagementComponent />
        }
      case 'equipment-management':
        return {
          title: "設備管理",
          subtitle: "設備の作成・編集・削除",
          content: <EquipmentManagementComponent />
        }
      case 'task-create':
        return {
          title: "タスク作成",
          subtitle: "プロジェクト・種類・設備を関連付けてタスク作成",
          content: <TaskCreationComponent />
        }
      case 'tasks':
        return {
          title: "タスク",
          subtitle: "タスク管理",
          content: <div className="p-4 text-center text-muted-foreground">タスク管理機能（開発中）</div>
        }
      case 'past-records':
        return {
          title: "過去実績",
          subtitle: "実績履歴",
          content: <div className="p-4 text-center text-muted-foreground">過去実績表示機能（開発中）</div>
        }
      default:
        return {}
    }
  }

  return (
    <div className="relative h-96">
      {/* 右のセクションを先にレンダリング - 右寄せ */}
      <div className="absolute right-0 top-0 z-0">
        <RightSection />
      </div>

      {/* 左と中央のセクションをflexで配置 */}
      <div className="flex h-full">
        {/* 左のセクションを次にレンダリング - 左寄せ */}
        {isVisible && (
          <div className="shrink-0 z-0">
            <LeftSection {...getLeftSectionProps()} />
          </div>
        )}

        {/* 真ん中のセクションを最後にレンダリング - 残りのスペースを埋める */}
        <div className="flex-1 z-0">
          <CenterSection isExpanded={!isVisible} />
        </div>
      </div>
    </div>
  )
}
