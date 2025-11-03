/**
 * タスク設備関連更新HOOK
 * タスク設備関連を更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskEquipmentRelationsService } from '../services';
import type { UpdateTaskEquipmentRelationParams, TaskEquipmentRelationTable } from '../types';

/**
 * useUpdateTaskEquipmentRelationの戻り値型
 */
export interface UseUpdateTaskEquipmentRelationReturn {
  /** 更新後のタスク設備関連情報 */
  taskEquipmentRelation: TaskEquipmentRelationTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク設備関連更新関数 */
  updateTaskEquipmentRelation: (params: UpdateTaskEquipmentRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスク設備関連を更新するHOOK
 *
 * @returns タスク設備関連更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateTaskEquipmentRelation, isUpdating, error, taskEquipmentRelation, reset } = useUpdateTaskEquipmentRelation();
 *
 * const handleUpdate = async () => {
 *   const success = await updateTaskEquipmentRelation({
 *     taskId: 'task-123',
 *     equipmentId: 'equipment-456',
 *     usageType: 'backup',
 *     plannedHours: 20
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateTaskEquipmentRelation(): UseUpdateTaskEquipmentRelationReturn {
  const [taskEquipmentRelation, setTaskEquipmentRelation] = useState<TaskEquipmentRelationTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskEquipmentRelation = useCallback(async (params: UpdateTaskEquipmentRelationParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setTaskEquipmentRelation(null);

      const response = await taskEquipmentRelationsService.update(params);

      if (response.success) {
        setTaskEquipmentRelation(response.data || null);
        return true;
      } else {
        setError(response.error || 'タスク設備関連の更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスク設備関連の更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTaskEquipmentRelation(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    taskEquipmentRelation,
    isUpdating,
    error,
    updateTaskEquipmentRelation,
    reset,
  };
}

