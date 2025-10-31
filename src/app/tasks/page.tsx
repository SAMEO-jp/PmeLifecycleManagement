'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useTasks, useDeleteTask } from '@/server/tasks/hook';
import { TaskTable } from '@/server/tasks/types';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import { Kanban } from 'lucide-react';

export default function TasksPage() {
  const { tasks, loading, refetch } = useTasks();
  const { deleteTask } = useDeleteTask();

  const handleDelete = async (task: TaskTable) => {
    if (confirm(`タスク「${task.taskName}」を削除しますか？`)) {
      try {
        await deleteTask({ id: task.id });
        toast.success('タスクを削除しました');
        refetch();
      } catch (error) {
        toast.error('タスクの削除に失敗しました');
      }
    }
  };

  const columns: DataTableColumn<TaskTable>[] = [
    {
      key: 'taskName',
      label: 'タスク名',
    },
    {
      key: 'taskTypeId',
      label: 'タスクタイプID',
    },
    {
      key: 'planId',
      label: 'プランID',
      render: (value) => value || '-',
    },
    {
      key: 'createdAt',
      label: '作成日',
      render: (value) => format(new Date(value as string), 'yyyy/MM/dd', { locale: ja }),
    },
    {
      key: 'updatedAt',
      label: '更新日',
      render: (value) => format(new Date(value as string), 'yyyy/MM/dd', { locale: ja }),
    },
  ];

  if (loading) {
    return <PageLoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <PageHeader
          title="タスク"
          description="タスクの一覧と管理"
          action={{
            label: '新規作成',
            href: '/tasks/new',
          }}
        >
          <div className="mt-4">
            <Link href="/tasks/board">
              <Button variant="outline">
                <Kanban className="h-4 w-4 mr-2" />
                ボード表示
              </Button>
            </Link>
          </div>
        </PageHeader>
        <DataTable
          data={tasks || []}
          columns={columns}
          getViewHref={(row) => `/tasks/${row.id}`}
          getEditHref={(row) => `/tasks/${row.id}/edit`}
          onDelete={handleDelete}
          emptyMessage="タスクがありません"
        />
      </div>
    </AuthGuard>
  );
}
