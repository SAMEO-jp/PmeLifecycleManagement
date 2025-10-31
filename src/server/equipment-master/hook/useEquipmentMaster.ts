/**
 * 設備マスタ詳細取得HOOK
 * IDで設備マスタを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { equipmentMasterService } from '../services';
import type { FindEquipmentMasterByIdParams, EquipmentMasterTable } from '../types';

/**
 * useEquipmentMasterの戻り値型
 */
export interface UseEquipmentMasterReturn {
  /** 設備マスタ情報 */
  equipmentMaster: EquipmentMasterTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * IDで設備マスタを取得するHOOK
 *
 * @param params - 検索パラメータ（idは必須）
 * @returns 設備マスタ情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { equipmentMaster, isLoading, error, refetch } = useEquipmentMaster({
 *   id: 'equipment-master-id',
 *   includeDeleted: false
 * });
 * ```
 */
export function useEquipmentMaster(params: FindEquipmentMasterByIdParams): UseEquipmentMasterReturn {
  const [equipmentMaster, setEquipmentMaster] = useState<EquipmentMasterTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipmentMaster = useCallback(async () => {
    if (!params.id) {
      setError('設備マスタIDが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await equipmentMasterService.getById(params);

      if (response.success) {
        setEquipmentMaster(response.data || null);
      } else {
        setError(response.error || '設備マスタの取得に失敗しました');
        setEquipmentMaster(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '設備マスタの取得に失敗しました';
      setError(errorMessage);
      setEquipmentMaster(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEquipmentMaster();
  }, [fetchEquipmentMaster]);

  return {
    equipmentMaster,
    isLoading,
    error,
    refetch: fetchEquipmentMaster,
  };
}
