/**
 * タスク設備関連作成HOOK
 * タスク設備関連を作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskEquipmentRelationsService } from '../services';
import type { CreateTaskEquipmentRelationParams, TaskEquipmentRelationTable } from '../types';

/**
 * useCreateTaskEquipmentRelationの戻り値型
 */
export interface UseCreateTaskEquipmentRelationReturn {
  /** 作成中のタスク設備関連情報 */
  taskEquipmentRelation: TaskEquipmentRelationTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク設備関連作成関数 */
  createTaskEquipmentRelation: (params: CreateTaskEquipmentRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスク設備関連を作成するHOOK
 *
 * @returns タスク設備関連作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createTaskEquipmentRelation, isCreating, error, taskEquipmentRelation, reset } = useCreateTaskEquipmentRelation();
 *
 * const handleSubmit = async () => {
 *   const success = await createTaskEquipmentRelation({
 *     taskId: 'task-123',
 *     equipmentId: 'equipment-456',
 *     usageType: 'main',
 *     quantity: 1
 *   });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateTaskEquipmentRelation(): UseCreateTaskEquipmentRelationReturn {
  const [taskEquipmentRelation, setTaskEquipmentRelation] = useState<TaskEquipmentRelationTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskEquipmentRelation = useCallback(async (params: CreateTaskEquipmentRelationParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setTaskEquipmentRelation(null);

      const response = await taskEquipmentRelationsService.create(params);

      if (response.success) {
        setTaskEquipmentRelation(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスク設備関連の作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスク設備関連の作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskEquipmentRelation(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    taskEquipmentRelation,
    isCreating,
    error,
    createTaskEquipmentRelation,
    reset,
  };
}
