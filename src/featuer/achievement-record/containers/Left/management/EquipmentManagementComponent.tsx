"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Equipment {
  id: string
  equipmentName: string
  parentId?: string
  parentName?: string
  createdAt: Date
  deletedAt?: Date
  children?: Equipment[]
}

export function EquipmentManagementComponent() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)

  // フォームデータ
  const [formData, setFormData] = useState({
    equipmentName: '',
    parentId: ''
  })

  // 設備を取得（親子関係を構築）
  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_master')
        .select('*')
        .is('deleted_at', null)
        .order('equipment_name', { ascending: true })

      if (error) {
        console.error('設備取得エラー:', error)
        return
      }

      if (data) {
        const formattedEquipments = data.map((item: { id: string; equipment_name: string; parent_id: string | null }) => ({
          id: item.id,
          equipmentName: item.equipment_name,
          parentId: item.parent_id,
          createdAt: new Date(item.created_at),
          deletedAt: item.deleted_at ? new Date(item.deleted_at) : undefined
        }))

        // 親子関係を構築
        const equipmentMap = new Map<string, Equipment>()
        const rootEquipments: Equipment[] = []

        // まず全ての設備をマップに登録
        formattedEquipments.forEach(equipment => {
          equipmentMap.set(equipment.id, { ...equipment, children: [] })
        })

        // 親子関係を設定
        formattedEquipments.forEach(equipment => {
          const equipmentWithChildren = equipmentMap.get(equipment.id)!
          if (equipment.parentId) {
            const parent = equipmentMap.get(equipment.parentId)
            if (parent) {
              parent.children = parent.children || []
              parent.children.push(equipmentWithChildren)
            }
          } else {
            rootEquipments.push(equipmentWithChildren)
          }
        })

        // 親の名前を設定
        formattedEquipments.forEach(equipment => {
          if (equipment.parentId) {
            const parent = equipmentMap.get(equipment.parentId)
            if (parent) {
              equipmentMap.get(equipment.id)!.parentName = parent.equipmentName
            }
          }
        })

        setEquipments(rootEquipments)
      }
    } catch (error) {
      console.error('設備取得中にエラーが発生しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipments()
  }, [])

  // フォームをリセット
  const resetForm = () => {
    setFormData({
      equipmentName: '',
      parentId: ''
    })
    setEditingEquipment(null)
  }

  // 作成ダイアログを開く
  const handleCreateClick = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  // 編集ダイアログを開く
  const handleEditClick = (equipment: Equipment) => {
    setFormData({
      equipmentName: equipment.equipmentName,
      parentId: equipment.parentId || ''
    })
    setEditingEquipment(equipment)
    setIsCreateDialogOpen(true)
  }

  // 設備を作成/更新
  const handleSave = async () => {
    if (!formData.equipmentName.trim()) return

    try {
      if (editingEquipment) {
        // 更新
        const { error } = await supabase
          .from('equipment_master')
          .update({
            equipment_name: formData.equipmentName.trim(),
            parent_id: formData.parentId || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEquipment.id)

        if (error) {
          console.error('設備更新エラー:', error)
          return
        }
      } else {
        // 作成
        const { error } = await supabase
          .from('equipment_master')
          .insert({
            id: crypto.randomUUID(),
            equipment_name: formData.equipmentName.trim(),
            parent_id: formData.parentId || null
          })

        if (error) {
          console.error('設備作成エラー:', error)
          return
        }
      }

      setIsCreateDialogOpen(false)
      resetForm()
      fetchEquipments()
    } catch (error) {
      console.error('設備保存中にエラーが発生しました:', error)
    }
  }

  // 論理削除
  const handleDelete = async (equipment: Equipment) => {
    if (!confirm(`「${equipment.equipmentName}」を削除しますか？`)) return

    try {
      const { error } = await supabase
        .from('equipment_master')
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', equipment.id)

      if (error) {
        console.error('設備削除エラー:', error)
        return
      }

      fetchEquipments()
    } catch (error) {
      console.error('設備削除中にエラーが発生しました:', error)
    }
  }

  // 設備ツリーを表示するコンポーネント
  const EquipmentTree = ({ equipment, level = 0 }: { equipment: Equipment, level?: number }) => (
    <div key={equipment.id}>
      <Card className={`p-3 ${level > 0 ? 'ml-4 border-l-2 border-l-gray-300' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {level > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
            <h4 className="font-medium text-sm">{equipment.equipmentName}</h4>
            {equipment.parentName && (
              <Badge variant="outline" className="text-xs">
                親: {equipment.parentName}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(equipment)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(equipment)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
      {equipment.children && equipment.children.length > 0 && (
        <div className="mt-2">
          {equipment.children.map(child => (
            <EquipmentTree key={child.id} equipment={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )

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
        <h3 className="text-sm font-medium">設備管理</h3>
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
                {editingEquipment ? '設備編集' : '設備作成'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="equipment-name">設備名 *</Label>
                <Input
                  id="equipment-name"
                  value={formData.equipmentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipmentName: e.target.value }))}
                  placeholder="例: クレーン、フォークリフト"
                />
              </div>
              <div>
                <Label htmlFor="parent-equipment">親設備</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="親設備を選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">なし（ルート設備）</SelectItem>
                    {equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.equipmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        {equipments.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            設備がありません
          </div>
        ) : (
          equipments.map((equipment) => (
            <EquipmentTree key={equipment.id} equipment={equipment} />
          ))
        )}
      </div>
    </div>
  )
}
