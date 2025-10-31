'use client';

import { AuthGuard } from '@/components/app/components/AuthGuard';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProject } from '@/server/projects/hook';
import { useTaskProjectRelations } from '@/server/task-project-relations/hook';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { project, loading: projectLoading } = useProject({ id: projectId });
  const { taskProjectRelations, loading: relationsLoading } = useTaskProjectRelations({
    projectId,
  });

  if (projectLoading || relationsLoading) {
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
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              プロジェクト一覧に戻る
            </Button>
          </Link>
        </div>

        <PageHeader
          title={project.name}
          description={`PME番号: ${project.projectNumber}`}
        >
          <div className="flex gap-2 mt-4">
            <Button asChild>
              <Link href={`/projects/${project.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Link>
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>プロジェクト情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">PME番号</div>
                <div className="text-lg">{project.projectNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">ステータス</div>
                <div className="text-lg">
                  {project.status === 'active' && '進行中'}
                  {project.status === 'inactive' && '停止中'}
                  {project.status === 'completed' && '完了'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">作成日</div>
                <div className="text-lg">
                  {format(new Date(project.created_at), 'yyyy年MM月dd日', { locale: ja })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">更新日</div>
                <div className="text-lg">
                  {format(new Date(project.updated_at), 'yyyy年MM月dd日', { locale: ja })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>関連タスク</CardTitle>
              <CardDescription>
                このプロジェクトに関連付けられたタスク
              </CardDescription>
            </CardHeader>
            <CardContent>
              {taskProjectRelations && taskProjectRelations.length > 0 ? (
                <div className="space-y-2">
                  {taskProjectRelations.map((relation) => (
                    <Link
                      key={relation.id}
                      href={`/tasks/${relation.taskId}`}
                      className="block p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">タスクID: {relation.taskId}</div>
                      <div className="text-sm text-muted-foreground">
                        関連タイプ: {relation.relationType || '未指定'}
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
