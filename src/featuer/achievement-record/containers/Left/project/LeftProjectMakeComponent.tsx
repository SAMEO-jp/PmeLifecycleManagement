/**
 * # LeftProjectMakeComponent.tsx
 *
 * このコンポーネントは、プロジェクトの作成とプロジェクト参加の機能を担当します。
 *
 * ## 概要
 *
 * - プロジェクト作成モード: 新規プロジェクトを作成するためのフォームを表示
 * - プロジェクト参加モード: 既存プロジェクトの一覧を表示し、参加機能を提供
 *
 * ## 主な機能
 *
 * ### プロジェクト作成機能 (`handleCreateProject`)
 * 1. プロジェクト基本情報の作成 (名前、番号)
 * 2. プロジェクトルートタスク種類の自動作成/確認
 * 3. プロジェクトルートタスクの自動作成
 * 4. プロジェクトとタスクの関連付け
 *
 * ### プロジェクト参加機能 (`handleJoinProject`)
 * 1. プロジェクトのルートタスクを取得
 * 2. ユーザーが既に参加済みかチェック
 * 3. 未参加の場合、ユーザーをルートタスクに割り当て
 *
 * ## データフロー
 *
 * ```
 * プロジェクト作成時:
 * ユーザー入力 → Supabase (projects) → タスク種類確認 → ルートタスク作成 → 関連付け → UI更新
 *
 * プロジェクト参加時:
 * プロジェクト選択 → ルートタスク取得 → 参加状態チェック → ユーザー割り当て → UI更新
 * ```
 *
 * ## 使用されるデータベーステーブル
 *
 * - `projects`: プロジェクト基本情報
 * - `task_types`: タスク種類 (プロジェクトルート)
 * - `tasks`: タスク情報
 * - `task_project_relations`: プロジェクト-タスク関連
 * - `task_user_relations`: タスク-ユーザー関連
 *
 * ## Props
 *
 * ```typescript
 * interface LeftProjectMakeComponentProps {
 *   mode?: 'join' | 'create'  // デフォルト: 'create'
 * }
 * ```
 *
 * ## 状態管理
 *
 * - `projects`: プロジェクト一覧
 * - `isLoading`: 読み込み状態
 * - `newProjectName`: 新規プロジェクト名入力
 * - `newProjectNumber`: 新規プロジェクト番号入力
 * - `showSuccessMessage`: 作成成功メッセージ表示フラグ
 *
 * ## エラーハンドリング
 *
 * - Supabase操作のエラーをコンソールに出力
 * - エラー発生時は処理を中断し、UIにフィードバック
 * - ネットワークエラーなどの例外をtry-catchで捕捉
 *
 * ## 依存関係
 *
 * - React hooks (useState, useEffect)
 * - Supabase client
 * - Better Auth client
 * - UIコンポーネント (shadcn/ui)
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { authClient } from "@/core/better-auth/auth-client"

interface Project {
  id: string
  name: string
  projectNumber: string
  createdAt: Date
  isJoined?: boolean // 参加済みかどうか
}

interface LeftProjectMakeComponentProps {
  mode?: 'join' | 'create'
}

export function LeftProjectMakeComponent({ mode = 'create' }: LeftProjectMakeComponentProps = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectNumber, setNewProjectNumber] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Supabaseからプロジェクトデータを取得
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 現在のユーザーを取得
        const session = await authClient.getSession()
        const currentUserId = session?.data?.user?.id

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .is('deleted_at', null) // 削除されていないもののみ
          .order('created_at', { ascending: false })

        if (error) {
          console.error('プロジェクト取得エラー:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          return
        }

        if (data) {
          const formattedProjects = data.map((item: { id: string; project_name: string; project_number: string; created_at: string }) => ({
            id: item.id,
            name: item.project_name,
            projectNumber: item.project_number,
            createdAt: new Date(item.created_at),
            isJoined: mode === 'join' ? false : undefined // 参加モードでのみ使用
          }))

          // 参加モードの場合、各プロジェクトの参加状態を確認
          if (mode === 'join' && currentUserId) {
            for (const project of formattedProjects) {
              // プロジェクトのルートタスクを取得
              const { data: taskRelation } = await supabase
                .from('task_project_relations')
                .select('task_id')
                .eq('project_id', project.id)
                .eq('relation_type', 'main')
                .single()

              if (taskRelation) {
                // ユーザーがこのタスクに割り当てられているか確認
                const { data: userRelation } = await supabase
                  .from('task_user_relations')
                  .select('id')
                  .eq('task_id', taskRelation.task_id)
                  .eq('user_id', currentUserId)
                  .is('deleted_at', null)
                  .single()

                project.isJoined = !!userRelation
              }
            }
          }

          setProjects(formattedProjects)
        }
      } catch (error) {
        console.error('プロジェクト取得中にエラーが発生しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [mode])

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !newProjectNumber.trim()) return

    try {
      const newProject = {
        id: crypto.randomUUID(),
        project_name: newProjectName.trim(),
        project_number: newProjectNumber.trim(),
      }

      // Supabaseに保存
      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()

      if (error) {
        console.error('プロジェクト作成エラー:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        // エラーメッセージを表示（ここではコンソールに表示）
        return
      }

      // プロジェクトルートタスク種類が存在するか確認
      let projectRootTaskTypeId = null
      const { data: taskTypes, error: taskTypeError } = await supabase
        .from('task_types')
        .select('id')
        .eq('type_name', 'プロジェクトルート')
        .single()

      console.log('タスク種類確認結果:', { taskTypes, taskTypeError })

      if (taskTypeError && taskTypeError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('タスク種類取得エラー:', taskTypeError)
        return // エラーが発生したら処理を中断
      } else if (!taskTypes) {
        // プロジェクトルートタスク種類が存在しない場合は作成
        console.log('プロジェクトルートタスク種類を作成します...')
        const { data: newTaskType, error: createTaskTypeError } = await supabase
          .from('task_types')
          .insert({
            id: 'project-root',
            type_name: 'プロジェクトルート',
            description: 'プロジェクトのルートタスク。プロジェクト参加者が割り当てられるタスク',
            color_code: '#2563eb',
            sort_order: 1,
            is_active: true,
          })
          .select()
          .single()

        if (createTaskTypeError) {
          console.error('プロジェクトルートタスク種類作成エラー:', createTaskTypeError)
          return // エラーが発生したら処理を中断
        } else if (newTaskType) {
          projectRootTaskTypeId = newTaskType.id
          console.log('プロジェクトルートタスク種類を作成しました:', newTaskType)
        }
      } else {
        projectRootTaskTypeId = taskTypes.id
        console.log('既存のプロジェクトルートタスク種類を使用:', taskTypes)
      }

      // プロジェクトルートタスクを作成（既に存在しない場合のみ）
      if (projectRootTaskTypeId && data && data[0]) {
        // 既にこのプロジェクトにプロジェクトルートタスクが存在するかチェック
        const { data: existingRootTask, error: checkError } = await supabase
          .from('task_project_relations')
          .select(`
            task_id,
            tasks!inner (
              task_type_id
            )
          `)
          .eq('project_id', data[0].id)
          .eq('relation_type', 'main')
          .eq('tasks.task_type_id', projectRootTaskTypeId)
          .single()

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
          console.error('プロジェクトルートタスク存在チェックエラー:', checkError)
          return // エラーが発生したら処理を中断
        }

        if (existingRootTask) {
          console.log('プロジェクトルートタスクは既に存在します:', existingRootTask)
        } else {
          console.log('プロジェクトルートタスクを作成します...', {
            projectId: data[0].id,
            taskTypeId: projectRootTaskTypeId,
            taskName: `${newProjectName.trim()} - ルートタスク`
          })

          const rootTask = {
            id: crypto.randomUUID(),
            task_name: `${newProjectName.trim()} - ルートタスク`,
            task_type_id: projectRootTaskTypeId,
          }

          const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .insert(rootTask)
            .select()
            .single()

          if (taskError) {
            console.error('プロジェクトルートタスク作成エラー:', taskError)
            return // エラーが発生したら処理を中断
          } else if (taskData) {
            console.log('プロジェクトルートタスクを作成しました:', taskData)

            // プロジェクトとタスクの関連付け
            console.log('プロジェクトとタスクを関連付けます...', {
              taskId: taskData.id,
              projectId: data[0].id
            })

            const { error: relationError } = await supabase
              .from('task_project_relations')
              .insert({
                task_id: taskData.id,
                project_id: data[0].id,
                relation_type: 'main', // メインのタスクとして設定
                sort_order: 0,
              })

            if (relationError) {
              console.error('プロジェクトタスク関連付けエラー:', relationError)
              return // エラーが発生したら処理を中断
            } else {
              console.log('プロジェクトルートタスクを作成し、プロジェクトに関連付けました')
            }
          }
        }
      } else {
        console.log('プロジェクトルートタスク作成スキップ:', {
          hasTaskTypeId: !!projectRootTaskTypeId,
          hasProjectData: !!(data && data[0])
        })
      }

      // ローカルstateにも追加
      if (data && data[0]) {
        setProjects(prev => [...prev, {
          id: data[0].id,
          name: data[0].project_name,
          projectNumber: data[0].project_number,
          createdAt: new Date(data[0].created_at)
        }])
      }

      setNewProjectName("")
      setNewProjectNumber("")
      setIsCreating(false)
      setShowSuccessMessage(true)

      // 3秒後に成功メッセージを非表示
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)

    } catch (error) {
      console.error('プロジェクト作成中にエラーが発生しました:', error)
    }
  }

  const handleCancel = () => {
    setNewProjectName("")
    setNewProjectNumber("")
    setIsCreating(false)
  }

  const handleJoinProject = async (projectId: string) => {
    try {
      // 現在のユーザーを取得
      const session = await authClient.getSession()
      if (!session?.data?.user?.id) {
        console.error('ユーザーが認証されていません')
        return
      }
      const currentUserId = session.data.user.id

      // プロジェクトのルートタスクを取得
      console.log('プロジェクトルートタスクを検索します...', { projectId })

      const { data: taskRelation, error: relationError } = await supabase
        .from('task_project_relations')
        .select(`
          task_id,
          tasks (
            id,
            task_name,
            task_types (
              type_name
            )
          )
        `)
        .eq('project_id', projectId)
        .eq('relation_type', 'main')
        .single()

      console.log('プロジェクトルートタスク検索結果:', { taskRelation, relationError })

      if (relationError || !taskRelation?.tasks) {
        console.error('プロジェクトルートタスクが見つかりません:', {
          error: relationError,
          hasTaskRelation: !!taskRelation,
          hasTasks: !!(taskRelation?.tasks)
        })

        // デバッグ用：該当プロジェクトの全タスク関連を確認
        const { data: allRelations, error: allError } = await supabase
          .from('task_project_relations')
          .select('*')
          .eq('project_id', projectId)

        console.log('デバッグ：プロジェクトの全タスク関連:', { allRelations, allError })

        return
      }

      // 既にユーザーがこのプロジェクトルートタスクに割り当てられているかチェック
      const { data: existingAssignment, error: checkAssignError } = await supabase
        .from('task_user_relations')
        .select('id')
        .eq('task_id', taskRelation.task_id)
        .eq('user_id', currentUserId)
        .is('deleted_at', null)
        .single()

      if (checkAssignError && checkAssignError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('ユーザー割り当てチェックエラー:', checkAssignError)
        return
      }

      if (existingAssignment) {
        console.log('既にこのプロジェクトに参加しています')
        // ローカルstateを更新
        setProjects(prev => prev.map(project =>
          project.id === projectId
            ? { ...project, isJoined: true }
            : project
        ))
        return
      }

      // プロジェクトルートタスクにユーザーを割り当て
      const { error: assignError } = await supabase
        .from('task_user_relations')
        .insert({
          task_id: taskRelation.task_id,
          user_id: currentUserId,
          role_type: 'assignee', // 担当者として割り当て
        })

      if (assignError) {
        console.error('プロジェクト参加エラー:', assignError)
        return
      }

      // ローカルstateを更新
      setProjects(prev => prev.map(project =>
        project.id === projectId
          ? { ...project, isJoined: true }
          : project
      ))

      console.log('プロジェクトに参加しました')

    } catch (error) {
      console.error('プロジェクト参加処理中にエラーが発生しました:', error)
    }
  }

  // 参加モード: プロジェクト一覧を表示
  if (mode === 'join') {
    return (
      <div className="space-y-4 p-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">読み込み中...</div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">プロジェクト一覧</h3>
            {projects.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                プロジェクトがありません
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {project.projectNumber}
                      </p>
                    </div>
                    {project.isJoined ? (
                      <Button variant="secondary" size="sm" disabled>
                        参加済み
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleJoinProject(project.id)}
                      >
                        参加
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  // 作成モード: 追加フォームを直接表示
  return (
    <div className="space-y-4 p-4">
      {/* 成功メッセージ */}
      {showSuccessMessage && (
        <Card className="p-3 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">プロジェクトが作成されました</span>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center text-muted-foreground">読み込み中...</div>
      ) : (
        <Card className="p-4">
          <CardHeader className="px-0 pt-0 pb-3">
            <CardTitle className="text-sm">新規プロジェクト作成</CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0 space-y-3">
            <div>
              <Label htmlFor="project-name" className="text-xs">プロジェクト名</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="プロジェクト名を入力"
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="project-number" className="text-xs">プロジェクト番号</Label>
              <Input
                id="project-number"
                value={newProjectNumber}
                onChange={(e) => setNewProjectNumber(e.target.value)}
                placeholder="プロジェクト番号を入力"
                className="h-8"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateProject}
                size="sm"
                className="flex-1 h-8"
              >
                <Save className="h-3 w-3 mr-1" />
                作成
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
