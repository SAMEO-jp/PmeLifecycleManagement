/**
 * タスクユーザー関連同期HOOK
 * タスクのユーザー関連を同期（バルク作成・削除）するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskUserRelationsService } from '../services';

/**
 * useSyncTaskUserRelationsの戻り値型
 */
export interface UseSyncTaskUserRelationsReturn {
  /** 同期中かどうか */
  isSyncing: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクユーザー関連同期関数 */
  syncTaskUserRelations: (taskId: string, userRelations: Array<{
    userId: string;
    roleType?: string;
    estimatedHours?: number;
    actualHours?: number;
  }>) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクのユーザー関連を同期するHOOK
 * 指定されたタスクに対して、指定されたユーザー関連リストに同期する
 *
 * @returns タスクユーザー関連同期関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { syncTaskUserRelations, isSyncing, error, reset } = useSyncTaskUserRelations();
 *
 * const handleSync = async () => {
 *   const success = await syncTaskUserRelations('task-123', [
 *     { userId: 'user-1', roleType: 'developer', estimatedHours: 10 },
 *     { userId: 'user-2', roleType: 'reviewer', estimatedHours: 5 }
 *   ]);
 *   if (success) {
 *     console.log('同期成功！');
 *   }
 * };
 * ```
 */
export function useSyncTaskUserRelations(): UseSyncTaskUserRelationsReturn {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const syncTaskUserRelations = useCallback(async (taskId: string, userRelations: Array<{
    userId: string;
    roleType?: string;
    estimatedHours?: number;
    actualHours?: number;
  }>): Promise<boolean> => {
    try {
      setIsSyncing(true);
      setError(null);

      const response = await taskUserRelationsService.syncRelations(taskId, userRelations);

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'タスクユーザー関連の同期に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクユーザー関連の同期に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsSyncing(false);
  }, []);

  return {
    isSyncing,
    error,
    syncTaskUserRelations,
    reset,
  };
}
