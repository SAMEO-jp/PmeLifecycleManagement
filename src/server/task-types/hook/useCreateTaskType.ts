/**
 * タスクタイプ作成HOOK
 * タスクタイプを作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskTypesService } from '../services';
import type { CreateTaskTypeParams, TaskTypeTable } from '../types';

/**
 * useCreateTaskTypeの戻り値型
 */
export interface UseCreateTaskTypeReturn {
  /** 作成中のタスクタイプ情報 */
  taskType: TaskTypeTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクタイプ作成関数 */
  createTaskType: (params: CreateTaskTypeParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクタイプを作成するHOOK
 *
 * @returns タスクタイプ作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createTaskType, isCreating, error, taskType, reset } = useCreateTaskType();
 *
 * const handleSubmit = async () => {
 *   const success = await createTaskType({ typeName: '新しいタスクタイプ' });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateTaskType(): UseCreateTaskTypeReturn {
  const [taskType, setTaskType] = useState<TaskTypeTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskType = useCallback(async (params: CreateTaskTypeParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setTaskType(null);

      const response = await taskTypesService.createTaskType(params);

      if (response.success) {
        setTaskType(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクタイプの作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクタイプの作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskType(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    taskType,
    isCreating,
    error,
    createTaskType,
    reset,
  };
}
