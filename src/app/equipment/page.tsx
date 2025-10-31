'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { useEquipmentMasters, useDeleteEquipmentMaster } from '@/server/equipment-master/hook';
import { EquipmentMasterTable } from '@/server/equipment-master/types';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

export default function EquipmentPage() {
  const { equipmentMasters, loading, refetch } = useEquipmentMasters();
  const { deleteEquipmentMaster } = useDeleteEquipmentMaster();

  const handleDelete = async (equipment: EquipmentMasterTable) => {
    if (confirm(`設備「${equipment.equipmentName}」を削除しますか？`)) {
      try {
        await deleteEquipmentMaster({ id: equipment.id });
        toast.success('設備を削除しました');
        refetch();
      } catch (error) {
        toast.error('設備の削除に失敗しました');
      }
    }
  };

  const columns: DataTableColumn<EquipmentMasterTable>[] = [
    {
      key: 'equipmentName',
      label: '設備名',
    },
    {
      key: 'equipmentNumber',
      label: '設備番号',
    },
    {
      key: 'category',
      label: 'カテゴリ',
      render: (value) => value || '-',
    },
    {
      key: 'parentId',
      label: '親設備',
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
          title="設備管理"
          description="設備の一覧と管理"
          action={{
            label: '新規登録',
            href: '/equipment/new',
          }}
        />
        <DataTable
          data={equipmentMasters || []}
          columns={columns}
          getViewHref={(row) => `/equipment/${row.id}`}
          getEditHref={(row) => `/equipment/${row.id}/edit`}
          onDelete={handleDelete}
          emptyMessage="設備がありません"
        />
      </div>
    </AuthGuard>
  );
}

