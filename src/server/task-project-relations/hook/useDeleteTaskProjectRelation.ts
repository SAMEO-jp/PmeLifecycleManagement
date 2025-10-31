/**
 * タスクプロジェクト関連削除HOOK
 * タスクプロジェクト関連を論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskProjectRelationsService } from '../services';
import type { DeleteTaskProjectRelationParams } from '../types';

/**
 * useDeleteTaskProjectRelationの戻り値型
 */
export interface UseDeleteTaskProjectRelationReturn {
  /** 削除されたタスクプロジェクト関連ID */
  deletedId: { taskId: string; projectId: string } | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクプロジェクト関連削除関数 */
  deleteTaskProjectRelation: (params: DeleteTaskProjectRelationParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクプロジェクト関連を論理削除するHOOK
 *
 * @returns タスクプロジェクト関連削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteTaskProjectRelation, isDeleting, error, deletedId, reset } = useDeleteTaskProjectRelation();
 *
 * const handleDelete = async () => {
 *   const success = await deleteTaskProjectRelation({
 *     taskId: 'task-123',
 *     projectId: 'project-456'
 *   });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteTaskProjectRelation(): UseDeleteTaskProjectRelationReturn {
  const [deletedId, setDeletedId] = useState<{ taskId: string; projectId: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTaskProjectRelation = useCallback(async (params: DeleteTaskProjectRelationParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await taskProjectRelationsService.softDelete(params);

      if (response.success) {
        setDeletedId({ taskId: params.taskId, projectId: params.projectId });
        return true;
      } else {
        setError(response.error || 'タスクプロジェクト関連の削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクプロジェクト関連の削除に失敗しました';
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
    deleteTaskProjectRelation,
    reset,
  };
}
