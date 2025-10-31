/**
 * タスクプロジェクト関連同期HOOK
 * タスクのプロジェクト関連を同期（バルク作成・削除）するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskProjectRelationsService } from '../services';

/**
 * useSyncTaskProjectRelationsの戻り値型
 */
export interface UseSyncTaskProjectRelationsReturn {
  /** 同期中かどうか */
  isSyncing: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスクプロジェクト関連同期関数 */
  syncTaskProjectRelations: (taskId: string, projectIds: string[]) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクのプロジェクト関連を同期するHOOK
 * 指定されたタスクに対して、指定されたプロジェクトIDリストに同期する
 *
 * @returns タスクプロジェクト関連同期関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { syncTaskProjectRelations, isSyncing, error, reset } = useSyncTaskProjectRelations();
 *
 * const handleSync = async () => {
 *   const success = await syncTaskProjectRelations('task-123', ['project-1', 'project-2', 'project-3']);
 *   if (success) {
 *     console.log('同期成功！');
 *   }
 * };
 * ```
 */
export function useSyncTaskProjectRelations(): UseSyncTaskProjectRelationsReturn {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const syncTaskProjectRelations = useCallback(async (taskId: string, projectIds: string[]): Promise<boolean> => {
    try {
      setIsSyncing(true);
      setError(null);

      const response = await taskProjectRelationsService.syncRelations(taskId, projectIds);

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'タスクプロジェクト関連の同期に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクプロジェクト関連の同期に失敗しました';
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
    syncTaskProjectRelations,
    reset,
  };
}
