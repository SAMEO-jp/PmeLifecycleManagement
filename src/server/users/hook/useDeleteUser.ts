/**
 * ユーザー削除HOOK
 * ユーザーを論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { usersService } from '../services';
import type { DeleteUserParams } from '../types';

/**
 * useDeleteUserの戻り値型
 */
export interface UseDeleteUserReturn {
  /** 削除されたユーザーID */
  deletedId: string | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** ユーザー削除関数 */
  deleteUser: (params: DeleteUserParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * ユーザーを論理削除するHOOK
 *
 * @returns ユーザー削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteUser, isDeleting, error, deletedId, reset } = useDeleteUser();
 *
 * const handleDelete = async () => {
 *   const success = await deleteUser({ id: 'user-id' });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteUser(): UseDeleteUserReturn {
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (params: DeleteUserParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await usersService.softDelete(params);

      if (response.success) {
        setDeletedId(params.id);
        return true;
      } else {
        setError(response.error || 'ユーザーの削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ユーザーの削除に失敗しました';
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
    deleteUser,
    reset,
  };
}
