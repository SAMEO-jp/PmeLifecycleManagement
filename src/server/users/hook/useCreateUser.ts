/**
 * ユーザー作成HOOK
 * ユーザーを作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { usersService } from '../services';
import type { CreateUserParams, UserTable } from '../types';

/**
 * useCreateUserの戻り値型
 */
export interface UseCreateUserReturn {
  /** 作成中のユーザー情報 */
  user: UserTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** ユーザー作成関数 */
  createUser: (params: CreateUserParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * ユーザーを作成するHOOK
 *
 * @returns ユーザー作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createUser, isCreating, error, user, reset } = useCreateUser();
 *
 * const handleSubmit = async () => {
 *   const success = await createUser({ name: '新しいユーザー', email: 'user@example.com' });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateUser(): UseCreateUserReturn {
  const [user, setUser] = useState<UserTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (params: CreateUserParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setUser(null);

      const response = await usersService.create(params);

      if (response.success) {
        setUser(response.data || null);
        return true;
      } else {
        setError(response.error || 'ユーザーの作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ユーザーの作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    user,
    isCreating,
    error,
    createUser,
    reset,
  };
}
