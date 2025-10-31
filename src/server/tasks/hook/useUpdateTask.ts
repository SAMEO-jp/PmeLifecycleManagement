/**
 * タスク更新HOOK
 * タスクを更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { tasksService } from '../services';
import type { UpdateTaskParams, TaskTable } from '../types';

/**
 * useUpdateTaskの戻り値型
 */
export interface UseUpdateTaskReturn {
  /** 更新後のタスク情報 */
  task: TaskTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク更新関数 */
  updateTask: (params: UpdateTaskParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクを更新するHOOK
 *
 * @returns タスク更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateTask, isUpdating, error, task, reset } = useUpdateTask();
 *
 * const handleUpdate = async () => {
 *   const success = await updateTask({
 *     id: 'task-id',
 *     taskName: '更新されたタスク名'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateTask(): UseUpdateTaskReturn {
  const [task, setTask] = useState<TaskTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = useCallback(async (params: UpdateTaskParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setTask(null);

      const response = await tasksService.update(params);

      if (response.success) {
        setTask(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクの更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTask(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    task,
    isUpdating,
    error,
    updateTask,
    reset,
  };
}
