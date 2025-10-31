/**
 * 設備マスタ一覧取得HOOK
 * 全設備マスタを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { equipmentMasterService } from '../services';
import type { FindEquipmentMastersParams, EquipmentMasterTable } from '../types';

/**
 * useEquipmentMastersの戻り値型
 */
export interface UseEquipmentMastersReturn {
  /** 設備マスタ一覧 */
  equipmentMasters: EquipmentMasterTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * 設備マスタ一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns 設備マスタ一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { equipmentMasters, isLoading, error, refetch } = useEquipmentMasters({
 *   parentId: 'parent-id',
 *   limit: 10
 * });
 * ```
 */
export function useEquipmentMasters(params: FindEquipmentMastersParams = {}): UseEquipmentMastersReturn {
  const [equipmentMasters, setEquipmentMasters] = useState<EquipmentMasterTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipmentMasters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await equipmentMasterService.getAll(params);

      if (response.success) {
        setEquipmentMasters(response.data || []);
      } else {
        setError(response.error || '設備マスタの取得に失敗しました');
        setEquipmentMasters([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '設備マスタの取得に失敗しました';
      setError(errorMessage);
      setEquipmentMasters([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEquipmentMasters();
  }, [fetchEquipmentMasters]);

  return {
    equipmentMasters,
    isLoading,
    error,
    refetch: fetchEquipmentMasters,
  };
}
