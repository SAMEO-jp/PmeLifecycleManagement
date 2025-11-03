'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/server/users/hook';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewUserPage() {
  const router = useRouter();
  const { createUser, loading } = useCreateUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('ユーザー名を入力してください');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('メールアドレスを入力してください');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('有効なメールアドレスを入力してください');
      return;
    }

    try {
      const result = await createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role || undefined,
      });

      if (result.success) {
        toast.success('ユーザーを作成しました');
        router.push(`/users/${result.data?.id}`);
      } else {
        toast.error(result.error || 'ユーザーの作成に失敗しました');
      }
    } catch (error) {
      toast.error('ユーザーの作成に失敗しました');
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="mb-4">
          <Link href="/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ユーザー一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title="新規ユーザー作成"
          description="新しいユーザーを作成します"
        />

        <Card>
          <CardHeader>
            <CardTitle>ユーザー情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">ユーザー名 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ユーザー名を入力"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">役割 (オプション)</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="役割を入力"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? '作成中...' : '作成'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/users')}
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
