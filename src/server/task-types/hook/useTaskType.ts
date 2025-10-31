/**
 * タスクタイプ詳細取得HOOK
 * IDでタスクタイプを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskTypesService } from '../services';
import type { FindTaskTypeByIdParams, TaskTypeTable } from '../types';

/**
 * useTaskTypeの戻り値型
 */
export interface UseTaskTypeReturn {
  /** タスクタイプ情報 */
  taskType: TaskTypeTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * IDでタスクタイプを取得するHOOK
 *
 * @param params - 検索パラメータ（idは必須）
 * @returns タスクタイプ情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskType, isLoading, error, refetch } = useTaskType({
 *   id: 'task-type-id',
 *   includeDeleted: false
 * });
 * ```
 */
export function useTaskType(params: FindTaskTypeByIdParams): UseTaskTypeReturn {
  const [taskType, setTaskType] = useState<TaskTypeTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskType = useCallback(async () => {
    if (!params.id) {
      setError('タスクタイプIDが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await taskTypesService.getTaskTypeById(params);

      if (response.success) {
        setTaskType(response.data || null);
      } else {
        setError(response.error || 'タスクタイプの取得に失敗しました');
        setTaskType(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクタイプの取得に失敗しました';
      setError(errorMessage);
      setTaskType(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTaskType();
  }, [fetchTaskType]);

  return {
    taskType,
    isLoading,
    error,
    refetch: fetchTaskType,
  };
}
