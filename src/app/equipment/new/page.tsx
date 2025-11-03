'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateEquipmentMaster, useEquipmentMasters } from '@/server/equipment-master/hook';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';

export default function NewEquipmentPage() {
  const router = useRouter();
  const { createEquipmentMaster, loading } = useCreateEquipmentMaster();
  const { equipmentMasters, loading: equipmentLoading } = useEquipmentMasters();

  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentNumber: '',
    category: '',
    parentId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.equipmentName.trim()) {
      toast.error('設備名を入力してください');
      return;
    }

    try {
      const result = await createEquipmentMaster({
        equipmentName: formData.equipmentName,
        equipmentNumber: formData.equipmentNumber,
        category: formData.category || undefined,
        parentId: formData.parentId || undefined,
      });

      if (result.success) {
        toast.success('設備を登録しました');
        router.push(`/equipment/${result.data?.id}`);
      } else {
        toast.error(result.error || '設備の登録に失敗しました');
      }
    } catch {
      toast.error('設備の登録に失敗しました');
    }
  };

  if (equipmentLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="mb-4">
          <Link href="/equipment">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              設備一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="新規設備登録"
          description="新しい設備を登録します"
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
                    {equipmentMasters?.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.equipmentName} ({equipment.equipmentNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? '登録中...' : '登録'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/equipment')}
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
