'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTask } from '@/server/tasks/hook';
import { useTaskTypes } from '@/server/task-types/hook';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';

export default function NewTaskPage() {
  const router = useRouter();
  const { createTask, loading } = useCreateTask();
  const { taskTypes, loading: taskTypesLoading } = useTaskTypes();

  const [formData, setFormData] = useState({
    taskName: '',
    taskTypeId: '',
    planId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.taskName.trim()) {
      toast.error('タスク名を入力してください');
      return;
    }

    if (!formData.taskTypeId) {
      toast.error('タスクタイプを選択してください');
      return;
    }

    try {
      const result = await createTask({
        taskName: formData.taskName,
        taskTypeId: formData.taskTypeId,
        planId: formData.planId || undefined,
      });

      if (result.success) {
        toast.success('タスクを作成しました');
        router.push(`/tasks/${result.data?.id}`);
      } else {
        toast.error(result.error || 'タスクの作成に失敗しました');
      }
    } catch (error) {
      toast.error('タスクの作成に失敗しました');
    }
  };

  if (taskTypesLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="mb-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              タスク一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="新規タスク作成"
          description="新しいタスクを作成します"
        />

        <Card>
          <CardHeader>
            <CardTitle>タスク情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="taskName">タスク名 *</Label>
                <Input
                  id="taskName"
                  value={formData.taskName}
                  onChange={(e) =>
                    setFormData({ ...formData, taskName: e.target.value })
                  }
                  placeholder="タスク名を入力"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskTypeId">タスクタイプ *</Label>
                <Select
                  value={formData.taskTypeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, taskTypeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="タスクタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.typeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planId">プランID (オプション)</Label>
                <Input
                  id="planId"
                  value={formData.planId}
                  onChange={(e) =>
                    setFormData({ ...formData, planId: e.target.value })
                  }
                  placeholder="プランIDを入力"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? '作成中...' : '作成'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/tasks')}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
