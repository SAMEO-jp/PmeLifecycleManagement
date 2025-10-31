'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/server/projects/hook';
import { useTasks } from '@/server/tasks/hook';
import { useUsers } from '@/server/users/hook';
import { useEquipmentMasters } from '@/server/equipment-master/hook';
import { useTaskTypes } from '@/server/task-types/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const { equipmentMasters, loading: equipmentLoading } = useEquipmentMasters();
  const { taskTypes, loading: taskTypesLoading } = useTaskTypes();

  const isLoading =
    projectsLoading || tasksLoading || usersLoading || equipmentLoading || taskTypesLoading;

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  // プロジェクトステータス別集計
  const projectsByStatus = projects?.reduce((acc, project) => {
    const status = project.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // タスクタイプ別集計
  const tasksByType = tasks?.reduce((acc, task) => {
    const typeId = task.taskTypeId || 'unassigned';
    acc[typeId] = (acc[typeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // タスクタイプ名マップ
  const taskTypeMap = taskTypes?.reduce((acc, type) => {
    acc[type.id] = type.typeName;
    return acc;
  }, {} as Record<string, string>) || {};

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <PageHeader
          title="レポート・分析"
          description="システムの統計情報と分析データ"
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="projects">プロジェクト</TabsTrigger>
            <TabsTrigger value="tasks">タスク</TabsTrigger>
            <TabsTrigger value="resources">リソース</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">総プロジェクト数</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    進行中: {projectsByStatus.active || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">総タスク数</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    タイプ数: {Object.keys(tasksByType).length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">登録ユーザー</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">アクティブユーザー</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">登録設備</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{equipmentMasters?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">設備マスタ</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>プロジェクトステータス別集計</CardTitle>
                <CardDescription>プロジェクトの状態ごとの数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(projectsByStatus).map(([status, count]) => {
                    const statusLabels: Record<string, string> = {
                      active: '進行中',
                      inactive: '停止中',
                      completed: '完了',
                    };
                    const total = projects?.length || 1;
                    const percentage = Math.round((count / total) * 100);

                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {statusLabels[status] || status}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>タスクタイプ別集計</CardTitle>
                <CardDescription>タスクタイプごとの数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(tasksByType).map(([typeId, count]) => {
                    const typeName =
                      taskTypeMap[typeId] || (typeId === 'unassigned' ? '未分類' : typeId);
                    const total = tasks?.length || 1;
                    const percentage = Math.round((count / total) * 100);

                    return (
                      <div key={typeId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{typeName}</span>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ユーザー一覧</CardTitle>
                  <CardDescription>登録ユーザー ({users?.length || 0})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {users && users.length > 0 ? (
                      users.slice(0, 10).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border">
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">ユーザーがいません</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>設備一覧</CardTitle>
                  <CardDescription>登録設備 ({equipmentMasters?.length || 0})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {equipmentMasters && equipmentMasters.length > 0 ? (
                      equipmentMasters.slice(0, 10).map((equipment) => (
                        <div key={equipment.id} className="flex items-center justify-between p-2 rounded-lg border">
                          <div>
                            <div className="font-medium text-sm">{equipment.equipmentName}</div>
                            <div className="text-xs text-muted-foreground">
                              {equipment.equipmentNumber}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">設備がありません</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
