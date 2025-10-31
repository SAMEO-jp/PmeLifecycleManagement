/**
 * タスクプロジェクト関連作成HOOK
 * タスクプロジェクト関連を作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskProjectRelationsService } from '../services';
import type { CreateTaskProjectRelationParams, TaskProjectRelationTable } from '../types';

/**
 * useCreateTaskProjectRelationの戻り値型
 */
export interface UseCreateTaskProjectRelationReturn {
  /** 作成中のタスクプロジェクト関連情報 */
  taskProjectRelation: TaskProjectRelationTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクプロジェクト関連作成関数 */
  createTaskProjectRelation: (params: CreateTaskProjectRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクプロジェクト関連を作成するHOOK
 *
 * @returns タスクプロジェクト関連作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createTaskProjectRelation, isCreating, error, taskProjectRelation, reset } = useCreateTaskProjectRelation();
 *
 * const handleSubmit = async () => {
 *   const success = await createTaskProjectRelation({
 *     taskId: 'task-123',
 *     projectId: 'project-456',
 *     relationType: 'assigned'
 *   });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateTaskProjectRelation(): UseCreateTaskProjectRelationReturn {
  const [taskProjectRelation, setTaskProjectRelation] = useState<TaskProjectRelationTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskProjectRelation = useCallback(async (params: CreateTaskProjectRelationParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setTaskProjectRelation(null);

      const response = await taskProjectRelationsService.create(params);

      if (response.success) {
        setTaskProjectRelation(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスクプロジェクト関連の作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクプロジェクト関連の作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskProjectRelation(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    taskProjectRelation,
    isCreating,
    error,
    createTaskProjectRelation,
    reset,
  };
}
