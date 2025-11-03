"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, Users, Calendar, CheckSquare } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { authClient } from "@/core/better-auth/auth-client"

interface Project {
  id: string
  name: string
  projectNumber: string
  createdAt: Date
  taskCount?: number
  memberCount?: number
}

interface Task {
  id: string
  task_name: string
  task_type_name?: string
  created_at: string
}

interface ProjectWithTasks extends Project {
  tasks: Task[]
}

export function LeftProjectListComponent() {
  const [projects, setProjects] = useState<ProjectWithTasks[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Supabaseからプロジェクトデータを取得（タスク情報付き）
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 現在のユーザーを取得
        const _session = await authClient.getSession()
        const _currentUserId = _session?.data?.user?.id

        // プロジェクトを取得
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })

        if (projectsError) {
          console.error('プロジェクト取得エラー:', projectsError)
          return
        }

        if (projectsData) {
          // 各プロジェクトのタスク数とメンバー数を取得
          const projectsWithDetails = await Promise.all(
            projectsData.map(async (project) => {
              // プロジェクトに関連する全てのタスクを取得（統計情報と情報表示の両方で使用）
              const { data: allTaskRelations } = await supabase
                .from('task_project_relations')
                .select(`
                  task_id,
                  relation_type,
                  tasks (
                    id,
                    task_name,
                    task_types (
                      type_name
                    )
                  )
                `)
                .eq('project_id', project.id)

              // 統計情報用のタスク数：プロジェクトルートタスクを除外
              const regularTaskRelations = allTaskRelations?.filter(tr => tr.relation_type !== 'main') || []

              // プロジェクトのタスクに割り当てられているユーザー数を取得（通常タスクのみ）
              const { data: userRelations, error: _userError } = await supabase
                .from('task_user_relations')
                .select('user_id', { count: 'exact' })
                .in('task_id', regularTaskRelations?.map(tr => tr.task_id) || [])
                .is('deleted_at', null)

              const taskCount = regularTaskRelations?.length || 0
              const memberCount = userRelations?.length || 0

              return {
                id: project.id,
                name: project.project_name,
                projectNumber: project.project_number,
                createdAt: new Date(project.created_at),
                taskCount,
                memberCount,
                tasks: allTaskRelations?.map(tr => ({
                  id: tr.tasks?.id || '',
                  task_name: tr.tasks?.task_name || '',
                  task_type_name: tr.tasks?.task_types?.type_name || '',
                  relation_type: tr.relation_type,
                  created_at: project.created_at
                })) || []
              }
            })
          )

          setProjects(projectsWithDetails)
        }
      } catch (error) {
        console.error('プロジェクト取得中にエラーが発生しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleProjectInfoClick = (projectId: string) => {
    setSelectedProjectId(selectedProjectId === projectId ? null : projectId)
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">プロジェクト一覧</h3>
        {projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            プロジェクトがありません
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {project.projectNumber}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleProjectInfoClick(project.id)}
                  className="shrink-0"
                >
                  <Info className="h-3 w-3 mr-1" />
                  情報
                </Button>
              </div>

              {/* プロジェクト統計 */}
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" />
                  <span>{project.taskCount}タスク</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{project.memberCount}人</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{project.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              {/* タスク一覧（情報ボタンが押された場合のみ表示） */}
              {selectedProjectId === project.id && (
                <div className="border-t pt-3 mt-3">
                  <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
                    <CheckSquare className="h-3 w-3" />
                    プロジェクトタスク一覧
                  </h5>
                  {project.tasks.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      タスクがありません
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {project.tasks.map((task) => (
                        <div key={task.id} className={`flex items-center justify-between py-1 px-2 rounded text-xs ${
                          task.relation_type === 'main' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}>
                          <span className="flex-1 truncate">{task.task_name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {task.relation_type === 'main' && (
                              <Badge variant="outline" className="text-xs px-1 py-0 text-blue-600 border-blue-300">
                                参加管理
                              </Badge>
                            )}
                            {task.task_type_name && task.relation_type !== 'main' && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                {task.task_type_name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
