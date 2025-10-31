/**
 * タスク設備関連同期HOOK
 * タスクの設備関連を同期（バルク作成・削除）するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { taskEquipmentRelationsService } from '../services';

/**
 * useSyncTaskEquipmentRelationsの戻り値型
 */
export interface UseSyncTaskEquipmentRelationsReturn {
  /** 同期中かどうか */
  isSyncing: boolean;
  /** エラー情報 */
  error: string | null;
  /** タスク設備関連同期関数 */
  syncTaskEquipmentRelations: (taskId: string, equipmentRelations: Array<{
    equipmentId: string;
    usageType?: string;
    plannedHours?: number;
    actualHours?: number;
    quantity?: number;
  }>) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * タスクの設備関連を同期するHOOK
 * 指定されたタスクに対して、指定された設備関連リストに同期する
 *
 * @returns タスク設備関連同期関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { syncTaskEquipmentRelations, isSyncing, error, reset } = useSyncTaskEquipmentRelations();
 *
 * const handleSync = async () => {
 *   const success = await syncTaskEquipmentRelations('task-123', [
 *     { equipmentId: 'equipment-1', usageType: 'main', quantity: 1, plannedHours: 10 },
 *     { equipmentId: 'equipment-2', usageType: 'backup', quantity: 2, plannedHours: 5 }
 *   ]);
 *   if (success) {
 *     console.log('同期成功！');
 *   }
 * };
 * ```
 */
export function useSyncTaskEquipmentRelations(): UseSyncTaskEquipmentRelationsReturn {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const syncTaskEquipmentRelations = useCallback(async (taskId: string, equipmentRelations: Array<{
    equipmentId: string;
    usageType?: string;
    plannedHours?: number;
    actualHours?: number;
    quantity?: number;
  }>): Promise<boolean> => {
    try {
      setIsSyncing(true);
      setError(null);

      const response = await taskEquipmentRelationsService.syncRelations(taskId, equipmentRelations);

      if (response.success) {
        return true;
      } else {
        setError(response.error || 'タスク設備関連の同期に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスク設備関連の同期に失敗しました';
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
    syncTaskEquipmentRelations,
    reset,
  };
}
