'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTask } from '@/server/tasks/hook';
import { useTaskProjectRelations } from '@/server/task-project-relations/hook';
import { useTaskUserRelations } from '@/server/task-user-relations/hook';
import { useTaskEquipmentRelations } from '@/server/task-equipment-relations/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { task, loading: taskLoading } = useTask({ id: taskId });
  const { taskProjectRelations, loading: projectRelationsLoading } = useTaskProjectRelations({ taskId });
  const { taskUserRelations, loading: userRelationsLoading } = useTaskUserRelations({ taskId });
  const { taskEquipmentRelations, loading: equipmentRelationsLoading } = useTaskEquipmentRelations({ taskId });

  const isLoading = taskLoading || projectRelationsLoading || userRelationsLoading || equipmentRelationsLoading;

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!task) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">タスクが見つかりません</h2>
            <Button className="mt-4" onClick={() => router.push('/tasks')}>
              タスク一覧に戻る
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
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              タスク一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title={task.taskName}
          description={`タスクID: ${task.id}`}
        >
          <div className="flex gap-2 mt-4">
            <Button asChild>
              <Link href={`/tasks/${task.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Link>
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>タスク情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">タスク名</div>
                <div className="text-lg">{task.taskName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">タスクタイプID</div>
                <div className="text-lg">{task.taskTypeId}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">プランID</div>
                <div className="text-lg">{task.planId || '未設定'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">作成日</div>
                <div className="text-lg">
                  {format(new Date(task.createdAt), 'yyyy年MM月dd日', { locale: ja })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">更新日</div>
                <div className="text-lg">
                  {format(new Date(task.updatedAt), 'yyyy年MM月dd日', { locale: ja })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">関連プロジェクト</span>
                <span className="text-2xl font-bold">{taskProjectRelations?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">アサインユーザー</span>
                <span className="text-2xl font-bold">{taskUserRelations?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">関連設備</span>
                <span className="text-2xl font-bold">{taskEquipmentRelations?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">プロジェクト</TabsTrigger>
            <TabsTrigger value="users">ユーザー</TabsTrigger>
            <TabsTrigger value="equipment">設備</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>関連プロジェクト</CardTitle>
                <CardDescription>このタスクに関連付けられたプロジェクト</CardDescription>
              </CardHeader>
              <CardContent>
                {taskProjectRelations && taskProjectRelations.length > 0 ? (
                  <div className="space-y-2">
                    {taskProjectRelations.map((relation) => (
                      <Link
                        key={relation.id}
                        href={`/projects/${relation.projectId}`}
                        className="block p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="font-medium">プロジェクトID: {relation.projectId}</div>
                        <div className="text-sm text-muted-foreground">
                          関連タイプ: {relation.relationType || '未指定'}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">関連プロジェクトがありません</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>アサインユーザー</CardTitle>
                <CardDescription>このタスクに割り当てられたユーザー</CardDescription>
              </CardHeader>
              <CardContent>
                {taskUserRelations && taskUserRelations.length > 0 ? (
                  <div className="space-y-2">
                    {taskUserRelations.map((relation) => (
                      <div
                        key={relation.id}
                        className="p-3 rounded-lg border"
                      >
                        <div className="font-medium">ユーザーID: {relation.userId}</div>
                        <div className="text-sm text-muted-foreground">
                          役割: {relation.roleType || '未指定'} |
                          見積時間: {relation.estimatedHours || 0}h |
                          実績時間: {relation.actualHours || 0}h
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">アサインユーザーがいません</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment">
            <Card>
              <CardHeader>
                <CardTitle>関連設備</CardTitle>
                <CardDescription>このタスクで使用する設備</CardDescription>
              </CardHeader>
              <CardContent>
                {taskEquipmentRelations && taskEquipmentRelations.length > 0 ? (
                  <div className="space-y-2">
                    {taskEquipmentRelations.map((relation) => (
                      <Link
                        key={relation.id}
                        href={`/equipment/${relation.equipmentId}`}
                        className="block p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="font-medium">設備ID: {relation.equipmentId}</div>
                        <div className="text-sm text-muted-foreground">
                          使用タイプ: {relation.usageType || '未指定'} |
                          数量: {relation.quantity || 0}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">関連設備がありません</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
