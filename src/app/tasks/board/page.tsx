'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/server/tasks/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { ArrowLeft, List } from 'lucide-react';

export default function TasksBoardPage() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return <PageLoadingSpinner />;
  }

  // Group tasks by taskTypeId for a simple board view
  const tasksByType = tasks?.reduce((acc, task) => {
    const typeId = task.taskTypeId || 'unassigned';
    if (!acc[typeId]) {
      acc[typeId] = [];
    }
    acc[typeId].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>) || {};

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              タスク一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="タスクボード"
          description="タスクをボード形式で表示"
        >
          <div className="mt-4">
            <Link href="/tasks">
              <Button variant="outline">
                <List className="h-4 w-4 mr-2" />
                リスト表示
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(tasksByType).map(([typeId, typeTasks]) => (
            <Card key={typeId} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {typeId === 'unassigned' ? '未分類' : `タイプID: ${typeId}`}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {typeTasks.length} タスク
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {typeTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="font-medium text-sm">{task.taskName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {task.id.slice(0, 8)}...
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {Object.keys(tasksByType).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            タスクがありません
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
