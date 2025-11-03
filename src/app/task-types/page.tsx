'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useTaskTypes, useDeleteTaskType } from '@/server/task-types/hook';
import { TaskTypeTable } from '@/server/task-types/types';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function TaskTypesPage() {
  const { taskTypes, loading, refetch } = useTaskTypes();
  const { deleteTaskType } = useDeleteTaskType();

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

  const columns: DataTableColumn<TaskTypeTable>[] = [
    {
      key: 'typeName',
      label: 'タイプ名',
    },
    {
      key: 'description',
      label: '説明',
      render: (value) => value || '-',
    },
    {
      key: 'createdAt',
      label: '作成日',
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
          title="タスクタイプ"
          description="タスクタイプの一覧"
        >
          <div className="mt-4">
            <Link href="/task-types/manage">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                タスクタイプ管理
              </Button>
            </Link>
          </div>
        </PageHeader>
        <DataTable
          data={taskTypes || []}
          columns={columns}
          onDelete={handleDelete}
          emptyMessage="タスクタイプがありません"
        />
      </div>
    </AuthGuard>
  );
}
