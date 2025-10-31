/**
 * タスク設備関連削除HOOK
 * タスク設備関連を論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskEquipmentRelationsService } from '../services';
import type { DeleteTaskEquipmentRelationParams } from '../types';

/**
 * useDeleteTaskEquipmentRelationの戻り値型
 */
export interface UseDeleteTaskEquipmentRelationReturn {
  /** 削除されたタスク設備関連ID */
  deletedId: { taskId: string; equipmentId: string } | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク設備関連削除関数 */
  deleteTaskEquipmentRelation: (params: DeleteTaskEquipmentRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスク設備関連を論理削除するHOOK
 *
 * @returns タスク設備関連削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteTaskEquipmentRelation, isDeleting, error, deletedId, reset } = useDeleteTaskEquipmentRelation();
 *
 * const handleDelete = async () => {
 *   const success = await deleteTaskEquipmentRelation({
 *     taskId: 'task-123',
 *     equipmentId: 'equipment-456'
 *   });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteTaskEquipmentRelation(): UseDeleteTaskEquipmentRelationReturn {
  const [deletedId, setDeletedId] = useState<{ taskId: string; equipmentId: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTaskEquipmentRelation = useCallback(async (params: DeleteTaskEquipmentRelationParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await taskEquipmentRelationsService.softDelete(params);

      if (response.success) {
        setDeletedId({ taskId: params.taskId, equipmentId: params.equipmentId });
        return true;
      } else {
        setError(response.error || 'タスク設備関連の削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスク設備関連の削除に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDeletedId(null);
    setError(null);
    setIsDeleting(false);
  }, []);

  return {
    deletedId,
    isDeleting,
    error,
    deleteTaskEquipmentRelation,
    reset,
  };
}
