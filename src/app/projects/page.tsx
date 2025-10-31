'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { useProjects, useDeleteProject } from '@/server/projects/hook';
import { ProjectTable } from '@/server/projects/types';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, refetch } = useProjects();
  const { deleteProject } = useDeleteProject();

  const handleDelete = async (project: ProjectTable) => {
    if (confirm(`プロジェクト「${project.name}」を削除しますか？`)) {
      try {
        await deleteProject({ id: project.id });
        toast.success('プロジェクトを削除しました');
        refetch();
      } catch (error) {
        toast.error('プロジェクトの削除に失敗しました');
      }
    }
  };

  const columns: DataTableColumn<ProjectTable>[] = [
    {
      key: 'projectNumber',
      label: 'PME番号',
    },
    {
      key: 'name',
      label: 'プロジェクト名',
    },
    {
      key: 'status',
      label: 'ステータス',
      render: (value) => {
        const status = value as string;
        const statusMap: Record<string, { label: string; className: string }> = {
          active: { label: '進行中', className: 'bg-green-100 text-green-800' },
          inactive: { label: '停止中', className: 'bg-gray-100 text-gray-800' },
          completed: { label: '完了', className: 'bg-blue-100 text-blue-800' },
        };
        const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100' };
        return (
          <span className={`px-2 py-1 rounded text-xs ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      label: '作成日',
      render: (value) => format(new Date(value as string), 'yyyy/MM/dd', { locale: ja }),
    },
    {
      key: 'updated_at',
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
          title="プロジェクト"
          description="プロジェクトの一覧と管理"
          action={{
            label: '新規作成',
            href: '/projects/new',
          }}
        />
        <DataTable
          data={projects || []}
          columns={columns}
          getViewHref={(row) => `/projects/${row.id}`}
          getEditHref={(row) => `/projects/${row.id}/edit`}
          onDelete={handleDelete}
          emptyMessage="プロジェクトがありません"
        />
      </div>
    </AuthGuard>
  );
}
