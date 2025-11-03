'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTask, useUpdateTask } from '@/server/tasks/hook';
import { useTaskTypes } from '@/server/task-types/hook';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { task, loading: taskLoading } = useTask({ id: taskId });
  const { updateTask, loading: updateLoading } = useUpdateTask();
  const { taskTypes, loading: taskTypesLoading } = useTaskTypes();

  const [formData, setFormData] = useState({
    taskName: '',
    taskTypeId: '',
    planId: '',
  });

  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        taskName: task.taskName,
        taskTypeId: task.taskTypeId,
        planId: task.planId || '',
      });
    }
  }, [task]);

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
      const result = await updateTask({
        id: taskId,
        taskName: formData.taskName,
        taskTypeId: formData.taskTypeId,
        planId: formData.planId || undefined,
      });

      if (result.success) {
        toast.success('タスクを更新しました');
        router.push(`/tasks/${taskId}`);
      } else {
        toast.error(result.error || 'タスクの更新に失敗しました');
      }
    } catch {
      toast.error('タスクの更新に失敗しました');
    }
  };

  if (taskLoading || taskTypesLoading) {
    return <PageLoadingSpinner />;
  }

  if (!task) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">タスクが見つかりません</h2>
            <Button className="mt-4" onClick={() => router.push('/tasks')}>
              タスク一覧に戻る
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="mb-4">
          <Link href={`/tasks/${taskId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              タスク詳細に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="タスク編集"
          description={`タスクID: ${task.id}`}
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
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? '更新中...' : '更新'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/tasks/${taskId}`)}
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
