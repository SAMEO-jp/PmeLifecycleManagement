/**
 * タスク詳細取得HOOK
 * IDでタスクを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '../services';
import type { FindTaskByIdParams, TaskTable } from '../types';

/**
 * useTaskの戻り値型
 */
export interface UseTaskReturn {
  /** タスク情報 */
  task: TaskTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * IDでタスクを取得するHOOK
 *
 * @param params - 検索パラメータ（idは必須）
 * @returns タスク情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { task, isLoading, error, refetch } = useTask({
 *   id: 'task-id'
 * });
 * ```
 */
export function useTask(params: FindTaskByIdParams): UseTaskReturn {
  const [task, setTask] = useState<TaskTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!params.id) {
      setError('タスクIDが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await tasksService.getById(params);

      if (response.success) {
        setTask(response.data || null);
      } else {
        setError(response.error || 'タスクの取得に失敗しました');
        setTask(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの取得に失敗しました';
      setError(errorMessage);
      setTask(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return {
    task,
    isLoading,
    error,
    refetch: fetchTask,
  };
}
