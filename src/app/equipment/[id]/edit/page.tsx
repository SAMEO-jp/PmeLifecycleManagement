'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useEquipmentMaster,
  useUpdateEquipmentMaster,
  useEquipmentMasters,
} from '@/server/equipment-master/hook';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditEquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const equipmentId = params.id as string;

  const { equipmentMaster, loading: equipmentLoading } = useEquipmentMaster({ id: equipmentId });
  const { updateEquipmentMaster, loading: updateLoading } = useUpdateEquipmentMaster();
  const { equipmentMasters, loading: equipmentListLoading } = useEquipmentMasters();

  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentNumber: '',
    category: '',
    parentId: '',
  });

  useEffect(() => {
    if (equipmentMaster) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        equipmentName: equipmentMaster.equipmentName,
        equipmentNumber: equipmentMaster.equipmentNumber,
        category: equipmentMaster.category || '',
        parentId: equipmentMaster.parentId || '',
      });
    }
  }, [equipmentMaster]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.equipmentName.trim()) {
      toast.error('設備名を入力してください');
      return;
    }

    try {
      const result = await updateEquipmentMaster({
        id: equipmentId,
        equipmentName: formData.equipmentName,
        equipmentNumber: formData.equipmentNumber,
        category: formData.category || undefined,
        parentId: formData.parentId || undefined,
      });

      if (result.success) {
        toast.success('設備を更新しました');
        router.push(`/equipment/${equipmentId}`);
      } else {
        toast.error(result.error || '設備の更新に失敗しました');
      }
          } catch (_error) {
      toast.error('設備の更新に失敗しました');
    }
  };

  if (equipmentLoading || equipmentListLoading) {
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

  // Filter out current equipment from parent options to prevent circular reference
  const availableParents = equipmentMasters?.filter((eq) => eq.id !== equipmentId) || [];

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="mb-4">
          <Link href={`/equipment/${equipmentId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              設備詳細に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="設備編集"
          description={`設備番号: ${equipmentMaster.equipmentNumber}`}
        />

        <Card>
          <CardHeader>
            <CardTitle>設備情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="equipmentName">設備名 *</Label>
                <Input
                  id="equipmentName"
                  value={formData.equipmentName}
                  onChange={(e) =>
                    setFormData({ ...formData, equipmentName: e.target.value })
                  }
                  placeholder="設備名を入力"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipmentNumber">設備番号</Label>
                <Input
                  id="equipmentNumber"
                  value={formData.equipmentNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, equipmentNumber: e.target.value })
                  }
                  placeholder="設備番号を入力"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="カテゴリを入力"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">親設備 (オプション)</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="親設備を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">なし（最上位）</SelectItem>
                    {availableParents.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.equipmentName} ({equipment.equipmentNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? '更新中...' : '更新'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/equipment/${equipmentId}`)}
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
