'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/server/users/hook';
import { useTaskUserRelations } from '@/server/task-user-relations/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { user, loading: userLoading } = useUser({ id: userId });
  const { taskUserRelations, loading: relationsLoading } = useTaskUserRelations({ userId });

  if (userLoading || relationsLoading) {
    return <PageLoadingSpinner />;
  }

  if (!user) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">ユーザーが見つかりません</h2>
            <Button className="mt-4" onClick={() => router.push('/users')}>
              ユーザー一覧に戻る
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
          <Link href="/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ユーザー一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title={user.name}
          description={user.email}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">ユーザー名</div>
                <div className="text-lg">{user.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">メールアドレス</div>
                <div className="text-lg">{user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">役割</div>
                <div className="text-lg">{user.role || '未設定'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">作成日</div>
                <div className="text-lg">
                  {format(new Date(user.createdAt), 'yyyy年MM月dd日', { locale: ja })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>アサインタスク</CardTitle>
              <CardDescription>このユーザーに割り当てられたタスク</CardDescription>
            </CardHeader>
            <CardContent>
              {taskUserRelations && taskUserRelations.length > 0 ? (
                <div className="space-y-2">
                  {taskUserRelations.map((relation) => (
                    <Link
                      key={relation.id}
                      href={`/tasks/${relation.taskId}`}
                      className="block p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">タスクID: {relation.taskId}</div>
                      <div className="text-sm text-muted-foreground">
                        役割: {relation.roleType || '未指定'} |
                        見積: {relation.estimatedHours || 0}h |
                        実績: {relation.actualHours || 0}h
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">アサインタスクがありません</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
