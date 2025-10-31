/**
 * タスクユーザー関連一覧取得HOOK
 * 全タスクユーザー関連を取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskUserRelationsService } from '../services';
import type { FindTaskUserRelationsParams, TaskUserRelationTable } from '../types';

/**
 * useTaskUserRelationsの戻り値型
 */
export interface UseTaskUserRelationsReturn {
  /** タスクユーザー関連一覧 */
  taskUserRelations: TaskUserRelationTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * タスクユーザー関連一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns タスクユーザー関連一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskUserRelations, isLoading, error, refetch } = useTaskUserRelations({
 *   taskId: 'task-123',
 *   limit: 10
 * });
 * ```
 */
export function useTaskUserRelations(params: FindTaskUserRelationsParams = {}): UseTaskUserRelationsReturn {
  const [taskUserRelations, setTaskUserRelations] = useState<TaskUserRelationTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskUserRelations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await taskUserRelationsService.getAll(params);

      if (response.success) {
        setTaskUserRelations(response.data || []);
      } else {
        setError(response.error || 'タスクユーザー関連の取得に失敗しました');
        setTaskUserRelations([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクユーザー関連の取得に失敗しました';
      setError(errorMessage);
      setTaskUserRelations([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTaskUserRelations();
  }, [fetchTaskUserRelations]);

  return {
    taskUserRelations,
    isLoading,
    error,
    refetch: fetchTaskUserRelations,
  };
}
