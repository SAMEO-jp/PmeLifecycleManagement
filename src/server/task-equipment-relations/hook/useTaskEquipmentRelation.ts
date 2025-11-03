/**
 * タスク設備関連詳細取得HOOK
 * taskIdとequipmentIdでタスク設備関連を取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { taskEquipmentRelationsService } from '../services';
import type { FindTaskEquipmentRelationByIdsParams, TaskEquipmentRelationTable } from '../types';

/**
 * useTaskEquipmentRelationの戻り値型
 */
export interface UseTaskEquipmentRelationReturn {
  /** タスク設備関連情報 */
  taskEquipmentRelation: TaskEquipmentRelationTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * taskIdとequipmentIdでタスク設備関連を取得するHOOK
 *
 * @param params - 検索パラメータ（taskIdとequipmentIdは必須）
 * @returns タスク設備関連情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { taskEquipmentRelation, isLoading, error, refetch } = useTaskEquipmentRelation({
 *   taskId: 'task-123',
 *   equipmentId: 'equipment-456',
 *   includeDeleted: false
 * });
 * ```
 */
export function useTaskEquipmentRelation(params: FindTaskEquipmentRelationByIdsParams): UseTaskEquipmentRelationReturn {
  const [taskEquipmentRelation, setTaskEquipmentRelation] = useState<TaskEquipmentRelationTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskEquipmentRelation = useCallback(async () => {
    if (!params.taskId || !params.equipmentId) {
      setError('taskIdとequipmentIdが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Serviceに単一取得メソッドがないので、一覧取得からフィルタリング
      const response = await taskEquipmentRelationsService.getAll({
        taskId: params.taskId,
        equipmentId: params.equipmentId,
        includeDeleted: params.includeDeleted,
        limit: 1
      });

      if (response.success && response.data && response.data.length > 0) {
        setTaskEquipmentRelation(response.data[0]);
      } else {
        setError(response.error || 'タスク設備関連の取得に失敗しました');
        setTaskEquipmentRelation(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスク設備関連の取得に失敗しました';
      setError(errorMessage);
      setTaskEquipmentRelation(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.taskId, params.equipmentId, params.includeDeleted]);

  useEffect(() => {
    fetchTaskEquipmentRelation();
  }, [fetchTaskEquipmentRelation]);

  return {
    taskEquipmentRelation,
    isLoading,
    error,
    refetch: fetchTaskEquipmentRelation,
  };
}

