'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateProject } from '@/server/projects/hook';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, loading } = useCreateProject();
  const [formData, setFormData] = useState({
    name: '',
    projectNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('プロジェクト名を入力してください');
      return;
    }

    try {
      const result = await createProject(formData);
      if (result.success) {
        toast.success('プロジェクトを作成しました');
        router.push(`/projects/${result.data?.id}`);
      } else {
        toast.error(result.error || 'プロジェクトの作成に失敗しました');
      }
    } catch {
      toast.error('プロジェクトの作成に失敗しました');
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="mb-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              プロジェクト一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="新規プロジェクト作成"
          description="新しいプロジェクトを作成します"
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

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? '作成中...' : '作成'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/projects')}
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
