"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TaskType {
  id: string
  typeName: string
  description?: string
  colorCode?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
}

export function TaskTypesManagementComponent() {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTaskType, setEditingTaskType] = useState<TaskType | null>(null)

  // フォームデータ
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    colorCode: '#2563eb',
    sortOrder: 0,
    isActive: true
  })

  // タスク種類を取得
  const fetchTaskTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('task_types')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('タスク種類取得エラー:', error)
        return
      }

      if (data) {
        const formattedTaskTypes = data.map((item: any) => ({
          id: item.id,
          typeName: item.type_name,
          description: item.description,
          colorCode: item.color_code,
          sortOrder: item.sort_order,
          isActive: item.is_active,
          createdAt: new Date(item.created_at)
        }))
        setTaskTypes(formattedTaskTypes)
      }
    } catch (error) {
      console.error('タスク種類取得中にエラーが発生しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTaskTypes()
  }, [])

  // フォームをリセット
  const resetForm = () => {
    setFormData({
      typeName: '',
      description: '',
      colorCode: '#2563eb',
      sortOrder: 0,
      isActive: true
    })
    setEditingTaskType(null)
  }

  // 作成ダイアログを開く
  const handleCreateClick = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  // 編集ダイアログを開く
  const handleEditClick = (taskType: TaskType) => {
    setFormData({
      typeName: taskType.typeName,
      description: taskType.description || '',
      colorCode: taskType.colorCode || '#2563eb',
      sortOrder: taskType.sortOrder,
      isActive: taskType.isActive
    })
    setEditingTaskType(taskType)
    setIsCreateDialogOpen(true)
  }

  // タスク種類を作成/更新
  const handleSave = async () => {
    if (!formData.typeName.trim()) return

    try {
      if (editingTaskType) {
        // 更新
        const { error } = await supabase
          .from('task_types')
          .update({
            type_name: formData.typeName.trim(),
            description: formData.description.trim() || null,
            color_code: formData.colorCode,
            sort_order: formData.sortOrder,
            is_active: formData.isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTaskType.id)

        if (error) {
          console.error('タスク種類更新エラー:', error)
          return
        }
      } else {
        // 作成
        const { error } = await supabase
          .from('task_types')
          .insert({
            id: crypto.randomUUID(),
            type_name: formData.typeName.trim(),
            description: formData.description.trim() || null,
            color_code: formData.colorCode,
            sort_order: formData.sortOrder,
            is_active: formData.isActive
          })

        if (error) {
          console.error('タスク種類作成エラー:', error)
          return
        }
      }

      setIsCreateDialogOpen(false)
      resetForm()
      fetchTaskTypes()
    } catch (error) {
      console.error('タスク種類保存中にエラーが発生しました:', error)
    }
  }

  // 論理削除
  const handleDelete = async (taskType: TaskType) => {
    if (!confirm(`「${taskType.typeName}」を削除しますか？`)) return

    try {
      const { error } = await supabase
        .from('task_types')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskType.id)

      if (error) {
        console.error('タスク種類削除エラー:', error)
        return
      }

      fetchTaskTypes()
    } catch (error) {
      console.error('タスク種類削除中にエラーが発生しました:', error)
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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">タスク種類管理</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-1" />
              新規作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTaskType ? 'タスク種類編集' : 'タスク種類作成'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type-name">種類名 *</Label>
                <Input
                  id="type-name"
                  value={formData.typeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, typeName: e.target.value }))}
                  placeholder="例: 開発、設計、テスト"
                />
              </div>
              <div>
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="タスク種類の説明"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="color-code">色コード</Label>
                <Input
                  id="color-code"
                  type="color"
                  value={formData.colorCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="sort-order">並び順</Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <Label htmlFor="is-active">有効</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {taskTypes.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            タスク種類がありません
          </div>
        ) : (
          taskTypes.map((taskType) => (
            <Card key={taskType.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: taskType.colorCode }}
                    />
                    <h4 className="font-medium text-sm">{taskType.typeName}</h4>
                    <Badge variant={taskType.isActive ? "default" : "secondary"}>
                      {taskType.isActive ? "有効" : "無効"}
                    </Badge>
                  </div>
                  {taskType.description && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {taskType.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    並び順: {taskType.sortOrder}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(taskType)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(taskType)}
                    disabled={!taskType.isActive}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
