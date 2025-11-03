/**
 * タスクユーザー関連作成HOOK
 * タスクユーザー関連を作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskUserRelationsService } from '../services';
import type { CreateTaskUserRelationParams, TaskUserRelationTable } from '../types';

/**
 * useCreateTaskUserRelationの戻り値型
 */
export interface UseCreateTaskUserRelationReturn {
  /** 作成中のタスクユーザー関連情報 */
  taskUserRelation: TaskUserRelationTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクユーザー関連作成関数 */
  createTaskUserRelation: (params: CreateTaskUserRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクユーザー関連を作成するHOOK
 *
 * @returns タスクユーザー関連作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createTaskUserRelation, isCreating, error, taskUserRelation, reset } = useCreateTaskUserRelation();
 *
 * const handleSubmit = async () => {
 *   const success = await createTaskUserRelation({
 *     taskId: 'task-123',
 *     userId: 'user-456',
 *     roleType: 'developer'
 *   });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateTaskUserRelation(): UseCreateTaskUserRelationReturn {
  const [taskUserRelation, setTaskUserRelation] = useState<TaskUserRelationTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskUserRelation = useCallback(async (params: CreateTaskUserRelationParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setTaskUserRelation(null);

      const response = await taskUserRelationsService.create(params);

      if (response.success) {
        setTaskUserRelation(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクユーザー関連の作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクユーザー関連の作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskUserRelation(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    taskUserRelation,
    isCreating,
    error,
    createTaskUserRelation,
    reset,
  };
}

