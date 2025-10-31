/**
 * ユーザー詳細取得HOOK
 * IDでユーザーを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services';
import type { FindUserByIdParams, UserTable } from '../types';

/**
 * useUserの戻り値型
 */
export interface UseUserReturn {
  /** ユーザー情報 */
  user: UserTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * IDでユーザーを取得するHOOK
 *
 * @param params - 検索パラメータ（idは必須）
 * @returns ユーザー情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { user, isLoading, error, refetch } = useUser({
 *   id: 'user-id'
 * });
 * ```
 */
export function useUser(params: FindUserByIdParams): UseUserReturn {
  const [user, setUser] = useState<UserTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!params.id) {
      setError('ユーザーIDが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.getById(params);

      if (response.success) {
        setUser(response.data || null);
      } else {
        setError(response.error || 'ユーザーの取得に失敗しました');
        setUser(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ユーザーの取得に失敗しました';
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
