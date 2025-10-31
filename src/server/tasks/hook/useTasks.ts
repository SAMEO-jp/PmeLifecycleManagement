/**
 * タスク一覧取得HOOK
 * 全タスクを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '../services';
import type { FindTasksParams, TaskTable } from '../types';

/**
 * useTasksの戻り値型
 */
export interface UseTasksReturn {
  /** タスク一覧 */
  tasks: TaskTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * タスク一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns タスク一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { tasks, isLoading, error, refetch } = useTasks({
 *   taskTypeId: 'type-id',
 *   limit: 10
 * });
 * ```
 */
export function useTasks(params: FindTasksParams = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await tasksService.getAll(params);

      if (response.success) {
        setTasks(response.data || []);
      } else {
        setError(response.error || 'タスクの取得に失敗しました');
        setTasks([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの取得に失敗しました';
      setError(errorMessage);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
  };
}
