"use client"

import { AuthGuard } from "../../components/app/components/AuthGuard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from '@/components/ui/page-header';
import { useProjects } from '@/server/projects/hook';
import { useTasks } from '@/server/tasks/hook';
import { useUsers } from '@/server/users/hook';
import { useEquipmentMasters } from '@/server/equipment-master/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, Package, CheckSquare, FolderKanban } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const { equipmentMasters, loading: equipmentLoading } = useEquipmentMasters();

  const isLoading = projectsLoading || tasksLoading || usersLoading || equipmentLoading;

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  const stats = [
    {
      title: 'プロジェクト',
      value: projects?.length || 0,
      icon: FolderKanban,
      href: '/projects',
      description: '進行中のプロジェクト',
    },
    {
      title: 'タスク',
      value: tasks?.length || 0,
      icon: CheckSquare,
      href: '/tasks',
      description: '全タスク数',
    },
    {
      title: 'ユーザー',
      value: users?.length || 0,
      icon: Users,
      href: '/users',
      description: '登録ユーザー数',
    },
    {
      title: '設備',
      value: equipmentMasters?.length || 0,
      icon: Package,
      href: '/equipment',
      description: '登録設備数',
    },
  ];

  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <PageHeader
          title="ダッシュボード"
          description="PMEライフサイクル管理システムの概要"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>最近のプロジェクト</CardTitle>
              <CardDescription>
                最新の5件のプロジェクト
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projects?.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {project.projectNumber}
                    </div>
                  </Link>
                )) || <p className="text-muted-foreground">プロジェクトがありません</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近のタスク</CardTitle>
              <CardDescription>
                最新の5件のタスク
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks?.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{task.taskName}</div>
                    <div className="text-sm text-muted-foreground">
                      タスクID: {task.id}
                    </div>
                  </Link>
                )) || <p className="text-muted-foreground">タスクがありません</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

