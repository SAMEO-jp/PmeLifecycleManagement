'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useTaskTypes,
  useCreateTaskType,
  useUpdateTaskType,
  useDeleteTaskType,
} from '@/server/task-types/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { TaskTypeTable } from '@/server/task-types/types';

export default function ManageTaskTypesPage() {
  const { taskTypes, loading, refetch } = useTaskTypes();
  const { createTaskType, loading: createLoading } = useCreateTaskType();
  const { updateTaskType, loading: updateLoading } = useUpdateTaskType();
  const { deleteTaskType } = useDeleteTaskType();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.typeName.trim()) {
      toast.error('タイプ名を入力してください');
      return;
    }

    try {
      const result = await createTaskType(formData);
      if (result.success) {
        toast.success('タスクタイプを作成しました');
        setFormData({ typeName: '', description: '' });
        setIsCreating(false);
        refetch();
      } else {
        toast.error(result.error || 'タスクタイプの作成に失敗しました');
      }
    } catch {
      toast.error('タスクタイプの作成に失敗しました');
    }
  };

  const handleEdit = (taskType: TaskTypeTable) => {
    setEditingId(taskType.id);
    setFormData({
      typeName: taskType.typeName,
      description: taskType.description || '',
    });
    setIsCreating(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    if (!formData.typeName.trim()) {
      toast.error('タイプ名を入力してください');
      return;
    }

    try {
      const result = await updateTaskType({
        id: editingId,
        ...formData,
      });
      if (result.success) {
        toast.success('タスクタイプを更新しました');
        setFormData({ typeName: '', description: '' });
        setEditingId(null);
        refetch();
      } else {
        toast.error(result.error || 'タスクタイプの更新に失敗しました');
      }
    } catch {
      toast.error('タスクタイプの更新に失敗しました');
    }
  };

  const handleDelete = async (taskType: TaskTypeTable) => {
    if (confirm(`タスクタイプ「${taskType.typeName}」を削除しますか？`)) {
      try {
        await deleteTaskType({ id: taskType.id });
        toast.success('タスクタイプを削除しました');
        refetch();
      } catch {
        toast.error('タスクタイプの削除に失敗しました');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ typeName: '', description: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  if (loading) {
    return <PageLoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-4">
          <Link href="/task-types">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              タスクタイプ一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="タスクタイプ管理"
          description="タスクタイプの作成・編集・削除"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'タスクタイプ編集' : 'タスクタイプ作成'}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? '既存のタスクタイプを編集します'
                  : '新しいタスクタイプを作成します'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isCreating && !editingId ? (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規作成
                </Button>
              ) : (
                <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeName">タイプ名 *</Label>
                    <Input
                      id="typeName"
                      value={formData.typeName}
                      onChange={(e) =>
                        setFormData({ ...formData, typeName: e.target.value })
                      }
                      placeholder="タイプ名を入力"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">説明 (オプション)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="説明を入力"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={createLoading || updateLoading}
                    >
                      {editingId ? '更新' : '作成'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      キャンセル
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>既存のタスクタイプ</CardTitle>
              <CardDescription>
                登録されているタスクタイプ ({taskTypes?.length || 0})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {taskTypes && taskTypes.length > 0 ? (
                  taskTypes.map((taskType) => (
                    <div
                      key={taskType.id}
                      className={`p-3 rounded-lg border ${
                        editingId === taskType.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{taskType.typeName}</div>
                          {taskType.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {taskType.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(taskType)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(taskType)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    タスクタイプがありません
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
