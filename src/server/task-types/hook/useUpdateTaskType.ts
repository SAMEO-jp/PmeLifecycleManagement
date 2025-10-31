/**
 * タスクタイプ更新HOOK
 * タスクタイプを更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskTypesService } from '../services';
import type { UpdateTaskTypeParams, TaskTypeTable } from '../types';

/**
 * useUpdateTaskTypeの戻り値型
 */
export interface UseUpdateTaskTypeReturn {
  /** 更新後のタスクタイプ情報 */
  taskType: TaskTypeTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクタイプ更新関数 */
  updateTaskType: (params: UpdateTaskTypeParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクタイプを更新するHOOK
 *
 * @returns タスクタイプ更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateTaskType, isUpdating, error, taskType, reset } = useUpdateTaskType();
 *
 * const handleUpdate = async () => {
 *   const success = await updateTaskType({
 *     id: 'task-type-id',
 *     typeName: '更新されたタスクタイプ名'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateTaskType(): UseUpdateTaskTypeReturn {
  const [taskType, setTaskType] = useState<TaskTypeTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskType = useCallback(async (params: UpdateTaskTypeParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setTaskType(null);

      const response = await taskTypesService.updateTaskType(params);

      if (response.success) {
        setTaskType(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクタイプの更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクタイプの更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskType(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    taskType,
    isUpdating,
    error,
    updateTaskType,
    reset,
  };
}
