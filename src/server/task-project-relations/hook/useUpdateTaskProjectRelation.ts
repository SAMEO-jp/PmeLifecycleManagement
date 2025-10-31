/**
 * タスクプロジェクト関連更新HOOK
 * タスクプロジェクト関連を更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskProjectRelationsService } from '../services';
import type { UpdateTaskProjectRelationParams, TaskProjectRelationTable } from '../types';

/**
 * useUpdateTaskProjectRelationの戻り値型
 */
export interface UseUpdateTaskProjectRelationReturn {
  /** 更新後のタスクプロジェクト関連情報 */
  taskProjectRelation: TaskProjectRelationTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクプロジェクト関連更新関数 */
  updateTaskProjectRelation: (params: UpdateTaskProjectRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクプロジェクト関連を更新するHOOK
 *
 * @returns タスクプロジェクト関連更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateTaskProjectRelation, isUpdating, error, taskProjectRelation, reset } = useUpdateTaskProjectRelation();
 *
 * const handleUpdate = async () => {
 *   const success = await updateTaskProjectRelation({
 *     taskId: 'task-123',
 *     projectId: 'project-456',
 *     relationType: 'completed'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateTaskProjectRelation(): UseUpdateTaskProjectRelationReturn {
  const [taskProjectRelation, setTaskProjectRelation] = useState<TaskProjectRelationTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskProjectRelation = useCallback(async (params: UpdateTaskProjectRelationParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setTaskProjectRelation(null);

      const response = await taskProjectRelationsService.update(params);

      if (response.success) {
        setTaskProjectRelation(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクプロジェクト関連の更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクプロジェクト関連の更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskProjectRelation(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    taskProjectRelation,
    isUpdating,
    error,
    updateTaskProjectRelation,
    reset,
  };
}
