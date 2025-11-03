'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject, useUpdateProject } from '@/server/projects/hook';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProjectStatus } from '@/server/projects/types';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { project, loading: projectLoading } = useProject({ id: projectId });
  const { updateProject, loading: updateLoading } = useUpdateProject();

  const [formData, setFormData] = useState({
    name: '',
    status: 'active' as ProjectStatus,
  });

  useEffect(() => {
    if (project) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: project.name,
        status: project.status,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('プロジェクト名を入力してください');
      return;
    }

    try {
      const result = await updateProject({
        id: projectId,
        ...formData,
      });
      if (result.success) {
        toast.success('プロジェクトを更新しました');
        router.push(`/projects/${projectId}`);
      } else {
        toast.error(result.error || 'プロジェクトの更新に失敗しました');
      }
    } catch {
      toast.error('プロジェクトの更新に失敗しました');
    }
  };

  if (projectLoading) {
    return <PageLoadingSpinner />;
  }

  if (!project) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">プロジェクトが見つかりません</h2>
            <Button className="mt-4" onClick={() => router.push('/projects')}>
              プロジェクト一覧に戻る
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
          <Link href={`/projects/${projectId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              プロジェクト詳細に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="プロジェクト編集"
          description={`PME番号: ${project.projectNumber}`}
        />

        <Card>
          <CardHeader>
            <CardTitle>プロジェクト情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">プロジェクト名 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="プロジェクト名を入力"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as ProjectStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">進行中</SelectItem>
                    <SelectItem value="inactive">停止中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
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
                  onClick={() => router.push(`/projects/${projectId}`)}
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
