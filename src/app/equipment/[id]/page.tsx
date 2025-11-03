'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEquipmentMaster } from '@/server/equipment-master/hook';
import { useTaskEquipmentRelations } from '@/server/task-equipment-relations/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const equipmentId = params.id as string;

  const { equipmentMaster, loading: equipmentLoading } = useEquipmentMaster({ id: equipmentId });
  const { taskEquipmentRelations, loading: relationsLoading } = useTaskEquipmentRelations({
    equipmentId,
  });

  if (equipmentLoading || relationsLoading) {
    return <PageLoadingSpinner />;
  }

  if (!equipmentMaster) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">設備が見つかりません</h2>
            <Button className="mt-4" onClick={() => router.push('/equipment')}>
              設備一覧に戻る
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <Link href="/equipment">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              設備一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title={equipmentMaster.equipmentName}
          description={`設備番号: ${equipmentMaster.equipmentNumber}`}
        >
          <div className="flex gap-2 mt-4">
            <Button asChild>
              <Link href={`/equipment/${equipmentMaster.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Link>
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>設備情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">設備名</div>
                <div className="text-lg">{equipmentMaster.equipmentName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">設備番号</div>
                <div className="text-lg">{equipmentMaster.equipmentNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">カテゴリ</div>
                <div className="text-lg">{equipmentMaster.category || '未設定'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">親設備ID</div>
                <div className="text-lg">{equipmentMaster.parentId || '最上位'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">作成日</div>
                <div className="text-lg">
                  {format(new Date(equipmentMaster.createdAt), 'yyyy年MM月dd日', { locale: ja })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>関連タスク</CardTitle>
            </CardHeader>
            <CardContent>
              {taskEquipmentRelations && taskEquipmentRelations.length > 0 ? (
                <div className="space-y-2">
                  {taskEquipmentRelations.map((relation) => (
                    <Link
                      key={relation.id}
                      href={`/tasks/${relation.taskId}`}
                      className="block p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">タスクID: {relation.taskId}</div>
                      <div className="text-sm text-muted-foreground">
                        使用タイプ: {relation.usageType || '未指定'} | 数量: {relation.quantity || 0}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">関連タスクがありません</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
