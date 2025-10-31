/**
 * タスクプロジェクト関連詳細取得HOOK
 * taskIdとprojectIdでタスクプロジェクト関連を取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskProjectRelationsService } from '../services';
import type { FindTaskProjectRelationByIdsParams, TaskProjectRelationTable } from '../types';

/**
 * useTaskProjectRelationの戻り値型
 */
export interface UseTaskProjectRelationReturn {
  /** タスクプロジェクト関連情報 */
  taskProjectRelation: TaskProjectRelationTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * taskIdとprojectIdでタスクプロジェクト関連を取得するHOOK
 *
 * @param params - 検索パラメータ（taskIdとprojectIdは必須）
 * @returns タスクプロジェクト関連情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskProjectRelation, isLoading, error, refetch } = useTaskProjectRelation({
 *   taskId: 'task-123',
 *   projectId: 'project-456',
 *   includeDeleted: false
 * });
 * ```
 */
export function useTaskProjectRelation(params: FindTaskProjectRelationByIdsParams): UseTaskProjectRelationReturn {
  const [taskProjectRelation, setTaskProjectRelation] = useState<TaskProjectRelationTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskProjectRelation = useCallback(async () => {
    if (!params.taskId || !params.projectId) {
      setError('taskIdとprojectIdが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Serviceに単一取得メソッドがないので、一覧取得からフィルタリング
      const response = await taskProjectRelationsService.getAll({
        taskId: params.taskId,
        projectId: params.projectId,
        includeDeleted: params.includeDeleted,
        limit: 1
      });

      if (response.success && response.data && response.data.length > 0) {
        setTaskProjectRelation(response.data[0]);
      } else {
        setError(response.error || 'タスクプロジェクト関連の取得に失敗しました');
        setTaskProjectRelation(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクプロジェクト関連の取得に失敗しました';
      setError(errorMessage);
      setTaskProjectRelation(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.taskId, params.projectId, params.includeDeleted]);

  useEffect(() => {
    fetchTaskProjectRelation();
  }, [fetchTaskProjectRelation]);

  return {
    taskProjectRelation,
    isLoading,
    error,
    refetch: fetchTaskProjectRelation,
  };
}
