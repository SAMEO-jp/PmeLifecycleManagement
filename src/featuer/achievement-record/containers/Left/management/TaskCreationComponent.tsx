"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, X, Plus, Minus } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Project {
  id: string
  projectName: string
  projectNumber: string
}

interface TaskType {
  id: string
  typeName: string
  colorCode?: string
}

interface Equipment {
  id: string
  equipmentName: string
}

interface EquipmentAssignment {
  equipmentId: string
  usageType: 'main' | 'support' | 'tool'
  plannedHours?: number
  quantity: number
}

export function TaskCreationComponent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // フォームデータ
  const [formData, setFormData] = useState({
    taskName: '',
    projectId: '',
    taskTypeId: '',
    equipmentAssignments: [] as EquipmentAssignment[]
  })

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // プロジェクト取得
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })

        if (projectsError) {
          console.error('プロジェクト取得エラー:', projectsError)
        } else if (projectsData) {
          setProjects(projectsData.map(p => ({
            id: p.id,
            projectName: p.project_name,
            projectNumber: p.project_number
          })))
        }

        // タスク種類取得
        const { data: taskTypesData, error: taskTypesError } = await supabase
          .from('task_types')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (taskTypesError) {
          console.error('タスク種類取得エラー:', taskTypesError)
        } else if (taskTypesData) {
          setTaskTypes(taskTypesData.map(t => ({
            id: t.id,
            typeName: t.type_name,
            colorCode: t.color_code
          })))
        }

        // 設備取得
        const { data: equipmentsData, error: equipmentsError } = await supabase
          .from('equipment_master')
          .select('*')
          .is('deleted_at', null)
          .order('equipment_name', { ascending: true })

        if (equipmentsError) {
          console.error('設備取得エラー:', equipmentsError)
        } else if (equipmentsData) {
          setEquipments(equipmentsData.map(e => ({
            id: e.id,
            equipmentName: e.equipment_name
          })))
        }

      } catch (error) {
        console.error('データ取得中にエラーが発生しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 設備割り当てを追加
  const addEquipmentAssignment = () => {
    setFormData(prev => ({
      ...prev,
      equipmentAssignments: [
        ...prev.equipmentAssignments,
        {
          equipmentId: '',
          usageType: 'main',
          plannedHours: undefined,
          quantity: 1
        }
      ]
    }))
  }

  // 設備割り当てを削除
  const removeEquipmentAssignment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipmentAssignments: prev.equipmentAssignments.filter((_, i) => i !== index)
    }))
  }

  // 設備割り当てを更新
  const updateEquipmentAssignment = (index: number, field: keyof EquipmentAssignment, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipmentAssignments: prev.equipmentAssignments.map((assignment, i) =>
        i === index ? { ...assignment, [field]: value } : assignment
      )
    }))
  }

  // タスク作成
  const handleCreateTask = async () => {
    if (!formData.taskName.trim() || !formData.projectId || !formData.taskTypeId) {
      alert('タスク名、プロジェクト、タスク種類は必須です')
      return
    }

    try {
      // タスク作成
      const taskId = crypto.randomUUID()
      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          id: taskId,
          task_name: formData.taskName.trim(),
          task_type_id: formData.taskTypeId
        })

      if (taskError) {
        console.error('タスク作成エラー:', taskError)
        return
      }

      // プロジェクトとの関連付け
      const { error: projectRelationError } = await supabase
        .from('task_project_relations')
        .insert({
          task_id: taskId,
          project_id: formData.projectId,
          relation_type: 'task', // 通常のタスクとして設定
          sort_order: 0
        })

      if (projectRelationError) {
        console.error('プロジェクト関連付けエラー:', projectRelationError)
        return
      }

      // 設備割り当て
      for (const assignment of formData.equipmentAssignments) {
        if (!assignment.equipmentId) continue

        const { error: equipmentError } = await supabase
          .from('task_equipment_relations')
          .insert({
            task_id: taskId,
            equipment_id: assignment.equipmentId,
            usage_type: assignment.usageType,
            planned_hours: assignment.plannedHours,
            quantity: assignment.quantity
          })

        if (equipmentError) {
          console.error('設備割り当てエラー:', equipmentError)
          return
        }
      }

      // フォームをリセット
      setFormData({
        taskName: '',
        projectId: '',
        taskTypeId: '',
        equipmentAssignments: []
      })

      alert('タスクが作成されました')

    } catch (error) {
      console.error('タスク作成中にエラーが発生しました:', error)
    }
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
      <h3 className="text-sm font-medium">タスク作成</h3>

      <Card className="p-4">
        <CardContent className="space-y-4">
          {/* 基本情報 */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="task-name">タスク名 *</Label>
              <Input
                id="task-name"
                value={formData.taskName}
                onChange={(e) => setFormData(prev => ({ ...prev, taskName: e.target.value }))}
                placeholder="タスク名を入力"
              />
            </div>

            <div>
              <Label htmlFor="project">プロジェクト *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="プロジェクトを選択" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.projectName} ({project.projectNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task-type">タスク種類 *</Label>
              <Select
                value={formData.taskTypeId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, taskTypeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="タスク種類を選択" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((taskType) => (
                    <SelectItem key={taskType.id} value={taskType.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: taskType.colorCode }}
                        />
                        {taskType.typeName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 設備割り当て */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>設備割り当て</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEquipmentAssignment}
              >
                <Plus className="h-3 w-3 mr-1" />
                設備追加
              </Button>
            </div>

            {formData.equipmentAssignments.map((assignment, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">設備 {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEquipmentAssignment(index)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">設備</Label>
                      <Select
                        value={assignment.equipmentId}
                        onValueChange={(value) => updateEquipmentAssignment(index, 'equipmentId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="設備を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipments.map((equipment) => (
                            <SelectItem key={equipment.id} value={equipment.id}>
                              {equipment.equipmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">用途</Label>
                      <Select
                        value={assignment.usageType}
                        onValueChange={(value: 'main' | 'support' | 'tool') => updateEquipmentAssignment(index, 'usageType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">主要設備</SelectItem>
                          <SelectItem value="support">支援設備</SelectItem>
                          <SelectItem value="tool">ツール</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">予定時間（時間）</Label>
                      <Input
                        type="number"
                        value={assignment.plannedHours || ''}
                        onChange={(e) => updateEquipmentAssignment(index, 'plannedHours', parseInt(e.target.value) || undefined)}
                        placeholder="例: 8"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">数量</Label>
                      <Input
                        type="number"
                        value={assignment.quantity}
                        onChange={(e) => updateEquipmentAssignment(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {formData.equipmentAssignments.length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-sm">
                設備が割り当てられていません
              </div>
            )}
          </div>

          {/* 作成ボタン */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateTask} className="flex-1">
              <Save className="h-4 w-4 mr-1" />
              タスク作成
            </Button>
            <Button
              variant="outline"
              onClick={() => setFormData({
                taskName: '',
                projectId: '',
                taskTypeId: '',
                equipmentAssignments: []
              })}
            >
              <X className="h-4 w-4 mr-1" />
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
