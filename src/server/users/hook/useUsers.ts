/**
 * ユーザー一覧取得HOOK
 * 全ユーザーを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services';
import type { FindUsersParams, UserTable } from '../types';

/**
 * useUsersの戻り値型
 */
export interface UseUsersReturn {
  /** ユーザー一覧 */
  users: UserTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * ユーザー一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns ユーザー一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { users, isLoading, error, refetch } = useUsers({
 *   limit: 10
 * });
 * ```
 */
export function useUsers(params: FindUsersParams = {}): UseUsersReturn {
  const [users, setUsers] = useState<UserTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.getAll(params);

      if (response.success) {
        setUsers(response.data || []);
      } else {
        setError(response.error || 'ユーザーの取得に失敗しました');
        setUsers([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ユーザーの取得に失敗しました';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
}
