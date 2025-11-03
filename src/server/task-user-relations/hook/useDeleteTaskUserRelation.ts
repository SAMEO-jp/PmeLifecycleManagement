/**
 * タスクユーザー関連削除HOOK
 * タスクユーザー関連を論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskUserRelationsService } from '../services';
import type { DeleteTaskUserRelationParams } from '../types';

/**
 * useDeleteTaskUserRelationの戻り値型
 */
export interface UseDeleteTaskUserRelationReturn {
  /** 削除されたタスクユーザー関連ID */
  deletedId: { taskId: string; userId: string } | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクユーザー関連削除関数 */
  deleteTaskUserRelation: (params: DeleteTaskUserRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクユーザー関連を論理削除するHOOK
 *
 * @returns タスクユーザー関連削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteTaskUserRelation, isDeleting, error, deletedId, reset } = useDeleteTaskUserRelation();
 *
 * const handleDelete = async () => {
 *   const success = await deleteTaskUserRelation({
 *     taskId: 'task-123',
 *     userId: 'user-456'
 *   });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteTaskUserRelation(): UseDeleteTaskUserRelationReturn {
  const [deletedId, setDeletedId] = useState<{ taskId: string; userId: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTaskUserRelation = useCallback(async (params: DeleteTaskUserRelationParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await taskUserRelationsService.softDelete(params);

      if (response.success) {
        setDeletedId({ taskId: params.taskId, userId: params.userId });
        return true;
      } else {
        setError(response.error || 'タスクユーザー関連の削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクユーザー関連の削除に失敗しました';
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
    deleteTaskUserRelation,
    reset,
  };
}

