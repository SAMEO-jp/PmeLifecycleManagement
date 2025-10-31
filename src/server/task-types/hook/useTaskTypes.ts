/**
 * タスクタイプ一覧取得HOOK
 * 全タスクタイプを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskTypesService } from '../services';
import type { FindTaskTypesParams, TaskTypeTable } from '../types';

/**
 * useTaskTypesの戻り値型
 */
export interface UseTaskTypesReturn {
  /** タスクタイプ一覧 */
  taskTypes: TaskTypeTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * タスクタイプ一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns タスクタイプ一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskTypes, isLoading, error, refetch } = useTaskTypes({
 *   isActive: true,
 *   limit: 10
 * });
 * ```
 */
export function useTaskTypes(params: FindTaskTypesParams = {}): UseTaskTypesReturn {
  const [taskTypes, setTaskTypes] = useState<TaskTypeTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await taskTypesService.getAllTaskTypes(params);

      if (response.success) {
        setTaskTypes(response.data || []);
      } else {
        setError(response.error || 'タスクタイプの取得に失敗しました');
        setTaskTypes([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクタイプの取得に失敗しました';
      setError(errorMessage);
      setTaskTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTaskTypes();
  }, [fetchTaskTypes]);

  return {
    taskTypes,
    isLoading,
    error,
    refetch: fetchTaskTypes,
  };
}
