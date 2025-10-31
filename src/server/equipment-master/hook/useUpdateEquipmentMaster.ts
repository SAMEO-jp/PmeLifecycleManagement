/**
 * 設備マスタ更新HOOK
 * 設備マスタを更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { equipmentMasterService } from '../services';
import type { UpdateEquipmentMasterParams, EquipmentMasterTable } from '../types';

/**
 * useUpdateEquipmentMasterの戻り値型
 */
export interface UseUpdateEquipmentMasterReturn {
  /** 更新後の設備マスタ情報 */
  equipmentMaster: EquipmentMasterTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** 設備マスタ更新関数 */
  updateEquipmentMaster: (params: UpdateEquipmentMasterParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * 設備マスタを更新するHOOK
 *
 * @returns 設備マスタ更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateEquipmentMaster, isUpdating, error, equipmentMaster, reset } = useUpdateEquipmentMaster();
 *
 * const handleUpdate = async () => {
 *   const success = await updateEquipmentMaster({
 *     id: 'equipment-master-id',
 *     equipmentName: '更新された設備マスタ名'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateEquipmentMaster(): UseUpdateEquipmentMasterReturn {
  const [equipmentMaster, setEquipmentMaster] = useState<EquipmentMasterTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateEquipmentMaster = useCallback(async (params: UpdateEquipmentMasterParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setEquipmentMaster(null);

      const response = await equipmentMasterService.update(params);

      if (response.success) {
        setEquipmentMaster(response.data || null);
        return true;
      } else {
        setError(response.error || '設備マスタの更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '設備マスタの更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEquipmentMaster(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    equipmentMaster,
    isUpdating,
    error,
    updateEquipmentMaster,
    reset,
  };
}
