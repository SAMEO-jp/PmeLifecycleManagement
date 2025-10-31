/**
 * タスクタイプ削除HOOK
 * タスクタイプを論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskTypesService } from '../services';
import type { DeleteTaskTypeParams } from '../types';

/**
 * useDeleteTaskTypeの戻り値型
 */
export interface UseDeleteTaskTypeReturn {
  /** 削除されたタスクタイプID */
  deletedId: string | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクタイプ削除関数 */
  deleteTaskType: (params: DeleteTaskTypeParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクタイプを論理削除するHOOK
 *
 * @returns タスクタイプ削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteTaskType, isDeleting, error, deletedId, reset } = useDeleteTaskType();
 *
 * const handleDelete = async () => {
 *   const success = await deleteTaskType({ id: 'task-type-id' });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteTaskType(): UseDeleteTaskTypeReturn {
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTaskType = useCallback(async (params: DeleteTaskTypeParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await taskTypesService.softDelete(params);

      if (response.success) {
        setDeletedId(params.id);
        return true;
      } else {
        setError(response.error || 'タスクタイプの削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクタイプの削除に失敗しました';
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
    deleteTaskType,
    reset,
  };
}
