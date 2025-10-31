/**
 * タスクプロジェクト関連一覧取得HOOK
 * 全タスクプロジェクト関連を取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskProjectRelationsService } from '../services';
import type { FindTaskProjectRelationsParams, TaskProjectRelationTable } from '../types';

/**
 * useTaskProjectRelationsの戻り値型
 */
export interface UseTaskProjectRelationsReturn {
  /** タスクプロジェクト関連一覧 */
  taskProjectRelations: TaskProjectRelationTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * タスクプロジェクト関連一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns タスクプロジェクト関連一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskProjectRelations, isLoading, error, refetch } = useTaskProjectRelations({
 *   taskId: 'task-123',
 *   limit: 10
 * });
 * ```
 */
export function useTaskProjectRelations(params: FindTaskProjectRelationsParams = {}): UseTaskProjectRelationsReturn {
  const [taskProjectRelations, setTaskProjectRelations] = useState<TaskProjectRelationTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskProjectRelations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await taskProjectRelationsService.getAll(params);

      if (response.success) {
        setTaskProjectRelations(response.data || []);
      } else {
        setError(response.error || 'タスクプロジェクト関連の取得に失敗しました');
        setTaskProjectRelations([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクプロジェクト関連の取得に失敗しました';
      setError(errorMessage);
      setTaskProjectRelations([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTaskProjectRelations();
  }, [fetchTaskProjectRelations]);

  return {
    taskProjectRelations,
    isLoading,
    error,
    refetch: fetchTaskProjectRelations,
  };
}
