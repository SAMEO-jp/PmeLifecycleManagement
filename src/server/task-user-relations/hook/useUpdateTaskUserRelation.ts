/**
 * タスクユーザー関連更新HOOK
 * タスクユーザー関連を更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskUserRelationsService } from '../services';
import type { UpdateTaskUserRelationParams, TaskUserRelationTable } from '../types';

/**
 * useUpdateTaskUserRelationの戻り値型
 */
export interface UseUpdateTaskUserRelationReturn {
  /** 更新後のタスクユーザー関連情報 */
  taskUserRelation: TaskUserRelationTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクユーザー関連更新関数 */
  updateTaskUserRelation: (params: UpdateTaskUserRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクユーザー関連を更新するHOOK
 *
 * @returns タスクユーザー関連更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateTaskUserRelation, isUpdating, error, taskUserRelation, reset } = useUpdateTaskUserRelation();
 *
 * const handleUpdate = async () => {
 *   const success = await updateTaskUserRelation({
 *     taskId: 'task-123',
 *     userId: 'user-456',
 *     roleType: 'reviewer'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateTaskUserRelation(): UseUpdateTaskUserRelationReturn {
  const [taskUserRelation, setTaskUserRelation] = useState<TaskUserRelationTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskUserRelation = useCallback(async (params: UpdateTaskUserRelationParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setTaskUserRelation(null);

      const response = await taskUserRelationsService.update(params);

      if (response.success) {
        setTaskUserRelation(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクユーザー関連の更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクユーザー関連の更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskUserRelation(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    taskUserRelation,
    isUpdating,
    error,
    updateTaskUserRelation,
    reset,
  };
}
