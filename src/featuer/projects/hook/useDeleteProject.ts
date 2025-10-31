/**
 * プロジェクト削除HOOK
 * プロジェクトを論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { projectsService } from '../services';
import type { DeleteProjectParams } from '../types';

/**
 * useDeleteProjectの戻り値型
 */
export interface UseDeleteProjectReturn {
  /** 削除されたプロジェクトID */
  deletedId: string | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** プロジェクト削除関数 */
  deleteProject: (params: DeleteProjectParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * プロジェクトを論理削除するHOOK
 *
 * @returns プロジェクト削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteProject, isDeleting, error, deletedId, reset } = useDeleteProject();
 *
 * const handleDelete = async () => {
 *   const success = await deleteProject({ id: 'project-id' });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteProject(): UseDeleteProjectReturn {
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProject = useCallback(async (params: DeleteProjectParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await projectsService.softDeleteProject(params);

      if (response.success) {
        setDeletedId(params.id);
        return true;
      } else {
        setError(response.error || 'プロジェクトの削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの削除に失敗しました';
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
    deleteProject,
    reset,
  };
}

