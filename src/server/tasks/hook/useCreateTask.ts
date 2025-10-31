/**
 * タスク作成HOOK
 * タスクを作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { tasksService } from '../services';
import type { CreateTaskParams, TaskTable } from '../types';

/**
 * useCreateTaskの戻り値型
 */
export interface UseCreateTaskReturn {
  /** 作成中のタスク情報 */
  task: TaskTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク作成関数 */
  createTask: (params: CreateTaskParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクを作成するHOOK
 *
 * @returns タスク作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createTask, isCreating, error, task, reset } = useCreateTask();
 *
 * const handleSubmit = async () => {
 *   const success = await createTask({ taskName: '新しいタスク', taskTypeId: 'type-id' });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateTask(): UseCreateTaskReturn {
  const [task, setTask] = useState<TaskTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (params: CreateTaskParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setTask(null);

      const response = await tasksService.create(params);

      if (response.success) {
        setTask(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクの作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTask(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    task,
    isCreating,
    error,
    createTask,
    reset,
  };
}
