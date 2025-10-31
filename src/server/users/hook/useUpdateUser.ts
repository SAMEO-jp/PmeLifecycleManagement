/**
 * ユーザー更新HOOK
 * ユーザーを更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { usersService } from '../services';
import type { UpdateUserParams, UserTable } from '../types';

/**
 * useUpdateUserの戻り値型
 */
export interface UseUpdateUserReturn {
  /** 更新後のユーザー情報 */
  user: UserTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** ユーザー更新関数 */
  updateUser: (params: UpdateUserParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * ユーザーを更新するHOOK
 *
 * @returns ユーザー更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateUser, isUpdating, error, user, reset } = useUpdateUser();
 *
 * const handleUpdate = async () => {
 *   const success = await updateUser({
 *     id: 'user-id',
 *     name: '更新されたユーザー名'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateUser(): UseUpdateUserReturn {
  const [user, setUser] = useState<UserTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (params: UpdateUserParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setUser(null);

      const response = await usersService.update(params);

      if (response.success) {
        setUser(response.data || null);
        return true;
      } else {
        setError(response.error || 'ユーザーの更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ユーザーの更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    user,
    isUpdating,
    error,
    updateUser,
    reset,
  };
}
