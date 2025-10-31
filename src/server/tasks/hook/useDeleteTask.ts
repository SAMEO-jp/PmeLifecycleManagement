/**
 * タスク削除HOOK
 * タスクを論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { tasksService } from '../services';
import type { DeleteTaskParams } from '../types';

/**
 * useDeleteTaskの戻り値型
 */
export interface UseDeleteTaskReturn {
  /** 削除されたタスクID */
  deletedId: string | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク削除関数 */
  deleteTask: (params: DeleteTaskParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクを論理削除するHOOK
 *
 * @returns タスク削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteTask, isDeleting, error, deletedId, reset } = useDeleteTask();
 *
 * const handleDelete = async () => {
 *   const success = await deleteTask({ id: 'task-id' });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteTask(): UseDeleteTaskReturn {
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = useCallback(async (params: DeleteTaskParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await tasksService.softDelete(params);

      if (response.success) {
        setDeletedId(params.id);
        return true;
      } else {
        setError(response.error || 'タスクの削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの削除に失敗しました';
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
    deleteTask,
    reset,
  };
}
