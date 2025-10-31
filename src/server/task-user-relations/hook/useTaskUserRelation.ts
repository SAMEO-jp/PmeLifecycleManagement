/**
 * タスクユーザー関連詳細取得HOOK
 * taskIdとuserIdでタスクユーザー関連を取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskUserRelationsService } from '../services';
import type { FindTaskUserRelationByIdsParams, TaskUserRelationTable } from '../types';

/**
 * useTaskUserRelationの戻り値型
 */
export interface UseTaskUserRelationReturn {
  /** タスクユーザー関連情報 */
  taskUserRelation: TaskUserRelationTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * taskIdとuserIdでタスクユーザー関連を取得するHOOK
 *
 * @param params - 検索パラメータ（taskIdとuserIdは必須）
 * @returns タスクユーザー関連情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskUserRelation, isLoading, error, refetch } = useTaskUserRelation({
 *   taskId: 'task-123',
 *   userId: 'user-456',
 *   includeDeleted: false
 * });
 * ```
 */
export function useTaskUserRelation(params: FindTaskUserRelationByIdsParams): UseTaskUserRelationReturn {
  const [taskUserRelation, setTaskUserRelation] = useState<TaskUserRelationTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskUserRelation = useCallback(async () => {
    if (!params.taskId || !params.userId) {
      setError('taskIdとuserIdが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Serviceに単一取得メソッドがないので、一覧取得からフィルタリング
      const response = await taskUserRelationsService.getAll({
        taskId: params.taskId,
        userId: params.userId,
        includeDeleted: params.includeDeleted,
        limit: 1
      });

      if (response.success && response.data && response.data.length > 0) {
        setTaskUserRelation(response.data[0]);
      } else {
        setError(response.error || 'タスクユーザー関連の取得に失敗しました');
        setTaskUserRelation(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクユーザー関連の取得に失敗しました';
      setError(errorMessage);
      setTaskUserRelation(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.taskId, params.userId, params.includeDeleted]);

  useEffect(() => {
    fetchTaskUserRelation();
  }, [fetchTaskUserRelation]);

  return {
    taskUserRelation,
    isLoading,
    error,
    refetch: fetchTaskUserRelation,
  };
}
