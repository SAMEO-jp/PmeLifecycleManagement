'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { useUsers, useDeleteUser } from '@/server/users/hook';
import { UserTable } from '@/server/users/types';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

export default function UsersPage() {
  const { users, loading, refetch } = useUsers();
  const { deleteUser } = useDeleteUser();

  const handleDelete = async (user: UserTable) => {
    if (confirm(`ユーザー「${user.name}」を削除しますか？`)) {
      try {
        await deleteUser({ id: user.id });
        toast.success('ユーザーを削除しました');
        refetch();
      } catch {
        toast.error('ユーザーの削除に失敗しました');
      }
    }
  };

  const columns: DataTableColumn<UserTable>[] = [
    {
      key: 'name',
      label: 'ユーザー名',
    },
    {
      key: 'email',
      label: 'メールアドレス',
    },
    {
      key: 'role',
      label: '役割',
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
          title="ユーザー管理"
          description="ユーザーの一覧と管理"
          action={{
            label: '新規作成',
            href: '/users/new',
          }}
        />
        <DataTable
          data={users || []}
          columns={columns}
          getViewHref={(row) => `/users/${row.id}`}
          onDelete={handleDelete}
          emptyMessage="ユーザーがいません"
        />
      </div>
    </AuthGuard>
  );
}
